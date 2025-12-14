import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import { sql } from "drizzle-orm";
import Stripe from "stripe";
import * as email from "./email";
import { PAYMENT_PLANS, PRICING } from "@shared/const";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

// Plan type configuration
const PLAN_CONFIG = {
  LEARNING_PATH: {
    totalAmount: PRICING.LEARNING_PATH * 100, // Convert to cents
    monthlyAmount: Math.round(PAYMENT_PLANS.LEARNING_PATH.monthly * 100),
    months: PAYMENT_PLANS.LEARNING_PATH.months,
  },
  BUNDLE_3_COURSE: {
    totalAmount: PRICING.BUNDLE_3_COURSE * 100,
    monthlyAmount: Math.round(PAYMENT_PLANS.BUNDLE_3_COURSE.monthly * 100),
    months: PAYMENT_PLANS.BUNDLE_3_COURSE.months,
  },
  CHAPLAINCY_TRAINING: {
    totalAmount: PRICING.CHAPLAINCY_TRAINING * 100,
    monthlyAmount: Math.round(PAYMENT_PLANS.CHAPLAINCY_TRAINING.monthly * 100),
    months: PAYMENT_PLANS.CHAPLAINCY_TRAINING.months,
  },
};

export const paymentPlanRouter = router({
  // Create a new payment plan
  createPlan: protectedProcedure
    .input(z.object({
      planType: z.enum(['LEARNING_PATH', 'BUNDLE_3_COURSE', 'CHAPLAINCY_TRAINING']),
      bundleId: z.number().optional(),
      learningPathId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      const config = PLAN_CONFIG[input.planType];

      // Check if user already has an active plan of this type
      const existingPlan: any = await dbConn.execute(
        sql`SELECT * FROM payment_plans 
            WHERE userId = ${ctx.user.id} 
            AND planType = ${input.planType}
            AND status IN ('active', 'paused')`
      );
      const plans = Array.isArray(existingPlan) ? existingPlan : (existingPlan.rows || []);
      
      if (plans.length > 0) {
        throw new Error("You already have an active payment plan of this type");
      }

      // Create or get Stripe customer
      let stripeCustomerId = (ctx.user as any).stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: ctx.user.email || undefined,
          name: ctx.user.name || undefined,
          metadata: {
            userId: ctx.user.id.toString(),
          },
        });
        stripeCustomerId = customer.id;
        
        await dbConn.execute(
          sql`UPDATE users SET stripeCustomerId = ${stripeCustomerId} WHERE id = ${ctx.user.id}`
        );
      }

      // Create Stripe subscription for recurring payments
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{
          price_data: {
            currency: 'usd',
            product: `${input.planType.replace(/_/g, ' ')} - Payment Plan`,
            unit_amount: config.monthlyAmount,
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          } as any,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId: ctx.user.id.toString(),
          planType: input.planType,
          bundleId: input.bundleId?.toString() || '',
          learningPathId: input.learningPathId?.toString() || '',
        },
      });

      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice?.payment_intent as any;

      // Calculate next payment date
      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      // Create payment plan record
      const planResult: any = await dbConn.execute(
        sql`INSERT INTO payment_plans 
            (userId, planType, bundleId, learningPathId, totalAmount, monthlyAmount, 
             paymentsTotal, paymentsCompleted, paymentsRemaining, nextPaymentDate, 
             status, stripeSubscriptionId, stripeCustomerId, agreementAcceptedAt)
            VALUES (${ctx.user.id}, ${input.planType}, ${input.bundleId || null}, 
                    ${input.learningPathId || null}, ${config.totalAmount}, ${config.monthlyAmount}, 
                    ${config.months}, 0, ${config.months}, ${nextPaymentDate}, 
                    'active', ${subscription.id}, ${stripeCustomerId}, ${new Date()})`
      );

      return {
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        planId: planResult.insertId,
      };
    }),

  // Confirm payment plan after first payment
  confirmPlan: protectedProcedure
    .input(z.object({
      planId: z.number(),
      subscriptionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Verify subscription payment succeeded
      const subscription = await stripe.subscriptions.retrieve(input.subscriptionId);
      
      if (subscription.status !== 'active') {
        throw new Error("First payment failed or is pending");
      }

      // Get plan details
      const planResult: any = await dbConn.execute(
        sql`SELECT * FROM payment_plans WHERE id = ${input.planId} AND userId = ${ctx.user.id}`
      );
      const plans = Array.isArray(planResult) ? planResult : (planResult.rows || []);
      
      if (plans.length === 0) {
        throw new Error("Payment plan not found");
      }

      const plan = plans[0];

      // Record first payment
      await dbConn.execute(
        sql`INSERT INTO payment_history 
            (userId, paymentPlanId, amount, paymentNumber, paymentDate, status, stripePaymentIntentId)
            VALUES (${ctx.user.id}, ${input.planId}, ${plan.monthlyAmount}, 1, ${new Date()}, 
                    'succeeded', ${subscription.latest_invoice})`
      );

      // Update plan
      await dbConn.execute(
        sql`UPDATE payment_plans 
            SET paymentsCompleted = 1, paymentsRemaining = ${plan.paymentsTotal - 1}
            WHERE id = ${input.planId}`
      );

      // Enroll user in courses based on plan type
      if (plan.planType === 'BUNDLE_3_COURSE' && plan.bundleId) {
        const bundleCourses: any = await dbConn.execute(
          sql`SELECT courseId FROM bundle_courses WHERE bundleId = ${plan.bundleId}`
        );
        const courses = Array.isArray(bundleCourses) ? bundleCourses : (bundleCourses.rows || []);

        for (const course of courses) {
          const existing: any = await dbConn.execute(
            sql`SELECT * FROM course_enrollments 
                WHERE userId = ${ctx.user.id} AND courseId = ${course.courseId}`
          );
          const enrollments = Array.isArray(existing) ? existing : (existing.rows || []);
          
          if (enrollments.length === 0) {
            await dbConn.execute(
              sql`INSERT INTO course_enrollments (userId, courseId, enrolledAt) 
                  VALUES (${ctx.user.id}, ${course.courseId}, NOW())`
            );
          }
        }
      } else if (plan.planType === 'LEARNING_PATH' && plan.learningPathId) {
        const pathCourses: any = await dbConn.execute(
          sql`SELECT courseId FROM path_courses WHERE learningPathId = ${plan.learningPathId}`
        );
        const courses = Array.isArray(pathCourses) ? pathCourses : (pathCourses.rows || []);

        for (const course of courses) {
          const existing: any = await dbConn.execute(
            sql`SELECT * FROM course_enrollments 
                WHERE userId = ${ctx.user.id} AND courseId = ${course.courseId}`
          );
          const enrollments = Array.isArray(existing) ? existing : (existing.rows || []);
          
          if (enrollments.length === 0) {
            await dbConn.execute(
              sql`INSERT INTO course_enrollments (userId, courseId, enrolledAt) 
                  VALUES (${ctx.user.id}, ${course.courseId}, NOW())`
            );
          }
        }
      }

      // Send payment plan enrollment confirmation email
      if (ctx.user.email) {
        await email.sendPaymentPlanEnrollmentEmail(
          ctx.user.email,
          ctx.user.name || 'Student',
          plan.planType,
          plan.totalAmount / 100,
          plan.monthlyAmount / 100,
          plan.paymentsTotal,
          new Date()
        );
      }

      return {
        success: true,
        planId: input.planId,
      };
    }),

  // Get user's payment plans
  getMyPlans: protectedProcedure
    .query(async ({ ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return [];

      const result: any = await dbConn.execute(
        sql`SELECT * FROM payment_plans
            WHERE userId = ${ctx.user.id}
            ORDER BY createdAt DESC`
      );

      return Array.isArray(result) ? result : (result.rows || []);
    }),

  // Get payment history
  getPaymentHistory: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .query(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return [];

      // Verify plan belongs to user
      const planCheck: any = await dbConn.execute(
        sql`SELECT * FROM payment_plans WHERE id = ${input.planId} AND userId = ${ctx.user.id}`
      );
      const plans = Array.isArray(planCheck) ? planCheck : (planCheck.rows || []);
      
      if (plans.length === 0) {
        throw new Error("Payment plan not found");
      }

      const result: any = await dbConn.execute(
        sql`SELECT * FROM payment_history 
            WHERE paymentPlanId = ${input.planId}
            ORDER BY paymentDate DESC`
      );

      return Array.isArray(result) ? result : (result.rows || []);
    }),

  // Pay off early
  payOffEarly: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Get plan details
      const planResult: any = await dbConn.execute(
        sql`SELECT * FROM payment_plans WHERE id = ${input.planId} AND userId = ${ctx.user.id}`
      );
      const plans = Array.isArray(planResult) ? planResult : (planResult.rows || []);
      
      if (plans.length === 0) {
        throw new Error("Payment plan not found");
      }

      const plan = plans[0];
      const remainingAmount = plan.monthlyAmount * plan.paymentsRemaining;

      // Create payment intent for remaining balance
      const paymentIntent = await stripe.paymentIntents.create({
        amount: remainingAmount,
        currency: "usd",
        customer: plan.stripeCustomerId,
        metadata: {
          planId: input.planId.toString(),
          type: 'early_payoff',
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        amount: remainingAmount,
      };
    }),

  // Cancel payment plan
  cancelPlan: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Get plan details
      const planResult: any = await dbConn.execute(
        sql`SELECT * FROM payment_plans WHERE id = ${input.planId} AND userId = ${ctx.user.id}`
      );
      const plans = Array.isArray(planResult) ? planResult : (planResult.rows || []);
      
      if (plans.length === 0) {
        throw new Error("Payment plan not found");
      }

      const plan = plans[0];

      // Cancel Stripe subscription
      if (plan.stripeSubscriptionId) {
        await stripe.subscriptions.cancel(plan.stripeSubscriptionId);
      }

      // Update plan status
      await dbConn.execute(
        sql`UPDATE payment_plans 
            SET status = 'cancelled', cancelledAt = ${new Date()}
            WHERE id = ${input.planId}`
      );

      return { success: true };
    }),
});
