import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import { sql } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const CHAPLAINCY_PRICE = 27500; // $275 in cents
const CHAPLAINCY_COURSE_ID = 999; // Special course ID for chaplaincy

export const chaplaincyRouter = router({
  // Create payment intent for chaplaincy training
  createPaymentIntent: protectedProcedure
    .mutation(async ({ ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Check if user already enrolled in chaplaincy
      const existing: any = await dbConn.execute(
        sql`SELECT * FROM course_enrollments 
            WHERE userId = ${ctx.user.id} AND courseId = ${CHAPLAINCY_COURSE_ID}`
      );
      const enrollments = Array.isArray(existing) ? existing : (existing.rows || []);
      
      if (enrollments.length > 0) {
        throw new Error("You are already enrolled in Chaplaincy Training");
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: CHAPLAINCY_PRICE,
        currency: "usd",
        metadata: {
          userId: ctx.user.id.toString(),
          type: "chaplaincy_training",
          courseId: CHAPLAINCY_COURSE_ID.toString(),
        },
      });

      // Record purchase in database
      await dbConn.execute(
        sql`INSERT INTO course_purchases (userId, courseId, stripePaymentIntentId, amount, status)
            VALUES (${ctx.user.id}, ${CHAPLAINCY_COURSE_ID}, ${paymentIntent.id}, ${CHAPLAINCY_PRICE}, 'pending')`
      );

      return {
        clientSecret: paymentIntent.client_secret,
        amount: CHAPLAINCY_PRICE,
      };
    }),

  // Check if user is enrolled in chaplaincy
  checkEnrollment: protectedProcedure
    .query(async ({ ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return { enrolled: false };

      const result: any = await dbConn.execute(
        sql`SELECT * FROM course_enrollments 
            WHERE userId = ${ctx.user.id} AND courseId = ${CHAPLAINCY_COURSE_ID}`
      );
      
      const rows = Array.isArray(result) ? result : (result.rows || []);
      return { enrolled: rows.length > 0 };
    }),

  // Complete chaplaincy enrollment (called by webhook)
  completeEnrollment: protectedProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Update purchase status
      await dbConn.execute(
        sql`UPDATE course_purchases 
            SET status = 'completed'
            WHERE stripePaymentIntentId = ${input.paymentIntentId} 
            AND userId = ${ctx.user.id}`
      );

      // Enroll user in chaplaincy course
      const existing: any = await dbConn.execute(
        sql`SELECT * FROM course_enrollments 
            WHERE userId = ${ctx.user.id} AND courseId = ${CHAPLAINCY_COURSE_ID}`
      );
      const enrollments = Array.isArray(existing) ? existing : (existing.rows || []);
      
      if (enrollments.length === 0) {
        await dbConn.execute(
          sql`INSERT INTO course_enrollments (userId, courseId, enrolledAt) 
              VALUES (${ctx.user.id}, ${CHAPLAINCY_COURSE_ID}, NOW())`
        );
      }

      // TODO: Send welcome email with background check instructions

      return { success: true };
    }),
});
