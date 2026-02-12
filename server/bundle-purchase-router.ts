import { z } from "zod";
import { sql } from "drizzle-orm";
import { router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import * as bundlesDb from "./bundles-db";
import Stripe from "stripe";
import { ENV } from "./_core/env";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export const bundlePurchaseRouter = router({
  // Create payment intent for bundle purchase
  createBundlePaymentIntent: protectedProcedure
    .input(z.object({ bundleId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const bundle = await bundlesDb.getBundleById(input.bundleId);
      if (!bundle) {
        throw new Error("Bundle not found");
      }

      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Get bundle price from database
      const bundleData: any = await dbConn.execute(
        sql`SELECT price, name, discountPercentage FROM course_bundles WHERE id = ${input.bundleId}`
      );
      const bundleInfo = Array.isArray(bundleData) ? bundleData[0] : bundleData.rows?.[0];
      
      if (!bundleInfo || !bundleInfo.price) {
        throw new Error("Bundle price not configured");
      }

      // Check if user already purchased this bundle
      const existingPurchase: any = await dbConn.execute(
        sql`SELECT * FROM bundle_purchases 
            WHERE userId = ${ctx.user.id} 
            AND bundleId = ${input.bundleId} 
            AND status = 'completed'`
      );
      const purchases = Array.isArray(existingPurchase) ? existingPurchase : existingPurchase.rows || [];
      
      if (purchases.length > 0) {
        throw new Error("You have already purchased this bundle");
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: bundleInfo.price,
        currency: "usd",
        metadata: {
          userId: ctx.user.id.toString(),
          bundleId: input.bundleId.toString(),
          bundleName: bundleInfo.name,
          type: "bundle_purchase",
        },
      });

      // Record purchase in database
      await dbConn.execute(
        sql`INSERT INTO bundle_purchases (userId, bundleId, stripePaymentIntentId, amount, status)
            VALUES (${ctx.user.id}, ${input.bundleId}, ${paymentIntent.id}, ${bundleInfo.price}, 'pending')`
      );

      return {
        clientSecret: paymentIntent.client_secret,
        amount: bundleInfo.price,
        bundleName: bundleInfo.name,
      };
    }),

  // Get user's purchased bundles
  getMyPurchasedBundles: protectedProcedure
    .query(async ({ ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      const purchases: any = await dbConn.execute(
        sql`SELECT bp.*, cb.name, cb.description, cb.icon, cb.colorTheme
            FROM bundle_purchases bp
            JOIN course_bundles cb ON bp.bundleId = cb.id
            WHERE bp.userId = ${ctx.user.id} AND bp.status = 'completed'
            ORDER BY bp.purchasedAt DESC`
      );
      
      return Array.isArray(purchases) ? purchases : (purchases.rows || []);
    }),

  // Check if user has purchased a specific bundle
  checkBundlePurchase: protectedProcedure
    .input(z.object({ bundleId: z.number() }))
    .query(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      const result: any = await dbConn.execute(
        sql`SELECT * FROM bundle_purchases 
            WHERE userId = ${ctx.user.id} 
            AND bundleId = ${input.bundleId} 
            AND status = 'completed'`
      );
      
      const rows = Array.isArray(result) ? result : (result.rows || []);
      return { purchased: rows.length > 0 };
    }),

  // Complete bundle purchase (called by webhook)
  completeBundlePurchase: protectedProcedure
    .input(z.object({ 
      paymentIntentId: z.string(),
      bundleId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Update purchase status
      await dbConn.execute(
        sql`UPDATE bundle_purchases 
            SET status = 'completed'
            WHERE stripePaymentIntentId = ${input.paymentIntentId} 
            AND userId = ${ctx.user.id}`
      );

      // Get all courses in the bundle
      const bundleCourses = await bundlesDb.getBundleCourses(input.bundleId);
      
      // Enroll user in all bundle courses
      for (const bc of bundleCourses) {
        try {
          // Check if already enrolled
          const existing: any = await dbConn.execute(
            sql`SELECT * FROM course_enrollments WHERE userId = ${ctx.user.id} AND courseId = ${bc.courseId}`
          );
          const enrollments = Array.isArray(existing) ? existing : (existing.rows || []);
          
          if (enrollments.length === 0) {
            await dbConn.execute(
              sql`INSERT INTO course_enrollments (userId, courseId, enrolledAt) 
                  VALUES (${ctx.user.id}, ${bc.courseId}, NOW())`
            );
          }
        } catch (error) {
          console.error(`Failed to enroll in course ${bc.courseId}:`, error);
        }
      }

      return { success: true };
    }),
});
