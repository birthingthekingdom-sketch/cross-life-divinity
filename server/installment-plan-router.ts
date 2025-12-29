import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import { sql } from "drizzle-orm";
import Stripe from "stripe";
import * as email from "./email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const BUNDLE_PRICE = 29900; // $299 in cents
const MONTHLY_PAYMENT = 4983; // $49.83 in cents (299 / 6 = 49.83)
const TOTAL_PAYMENTS = 6;

export const installmentPlanRouter = router({
  // Create a new installment plan
  createPlan: protectedProcedure
    .input(z.object({
      bundleId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Check if user already has an active plan for this bundle
      const existingPlan: any = await dbConn.execute(
        sql`SELECT * FROM payment_plans 
            WHERE userId = ${ctx.user.id} 
            AND bundleId = ${input.bundleId} 
            AND status IN ('active', 'pending')`
      );
      const plans = Array.isArray(existingPlan) ? existingPlan : (existingPlan.rows || []);
      
      if (plans.length > 0) {
        throw new Error("You already have an active payment plan for this bundle");
      }

      // Create Stripe customer if doesn't exist
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
        
        // Update user with Stripe customer ID
        await dbConn.execute(
          sql`UPDATE users SET stripeCustomerId = ${stripeCustomerId} WHERE id = ${ctx.user.id}`
        );
      }

      // Create SetupIntent for ACH payment method
      const setupIntent = await stripe.setupIntents.create({
        customer: stripeCustomerId,
        payment_method_types: ['us_bank_account'],
        metadata: {
          userId: ctx.user.id.toString(),
          bundleId: input.bundleId.toString(),
          type: 'installment_plan',
        },
      });

      return {
        clientSecret: setupIntent.client_secret,
        customerId: stripeCustomerId,
      };
    }),

  // Confirm payment plan after payment method setup
  confirmPlan: protectedProcedure
    .input(z.object({
      bundleId: z.number(),
      setupIntentId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Retrieve setup intent to get payment method
      const setupIntent = await stripe.setupIntents.retrieve(input.setupIntentId);
      
      if (setupIntent.status !== 'succeeded') {
        throw new Error("Payment method setup failed");
      }

      const paymentMethodId = setupIntent.payment_method as string;
      const customerId = setupIntent.customer as string;

      // Create first payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: MONTHLY_PAYMENT,
        currency: "usd",
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          userId: ctx.user.id.toString(),
          bundleId: input.bundleId.toString(),
          paymentNumber: '1',
          type: 'installment_plan_payment',
        },
      });

      if (paymentIntent.status !== 'succeeded') {
        throw new Error("First payment failed");
      }

      // Calculate next payment date (30 days from now)
      const startDate = new Date();
      const nextPaymentDate = new Date();
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

      // Create payment plan record
      const planResult: any = await dbConn.execute(
        sql`INSERT INTO payment_plans 
            (userId, bundleId, totalAmount, monthlyAmount, paymentsTotal, paymentsCompleted, 
             status, startDate, nextPaymentDate, stripeCustomerId, stripePaymentMethodId)
            VALUES (${ctx.user.id}, ${input.bundleId}, ${BUNDLE_PRICE}, ${MONTHLY_PAYMENT}, 
                    ${TOTAL_PAYMENTS}, 1, 'active', ${startDate}, ${nextPaymentDate}, 
                    ${customerId}, ${paymentMethodId})`
      );

      const planId = planResult.insertId;

      // Record first transaction
      await dbConn.execute(
        sql`INSERT INTO payment_plan_transactions 
            (planId, amount, status, paymentDate, stripePaymentIntentId)
            VALUES (${planId}, ${MONTHLY_PAYMENT}, 'completed', ${new Date()}, ${paymentIntent.id})`
      );

      // Enroll user in all bundle courses
      const bundleCourses: any = await dbConn.execute(
        sql`SELECT courseId FROM bundle_courses WHERE bundleId = ${input.bundleId}`
      );
      const courses = Array.isArray(bundleCourses) ? bundleCourses : (bundleCourses.rows || []);

      for (const course of courses) {
        // Check if already enrolled
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

      // Send confirmation email
      if (ctx.user.email) {
        await email.sendWelcomeEmail(
          ctx.user.email,
          ctx.user.name || 'Student',
          [`Payment Plan Activated: First payment of $49.83 processed. Next payment: ${nextPaymentDate.toLocaleDateString()}`]
        );
      }

      return {
        success: true,
        planId,
        nextPaymentDate: nextPaymentDate.toISOString(),
      };
    }),

  // Get user's payment plans
  getMyPlans: protectedProcedure
    .query(async ({ ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) return [];

      const result: any = await dbConn.execute(
        sql`SELECT pp.*, cb.name as bundleName, cb.price as bundlePrice
            FROM payment_plans pp
            LEFT JOIN course_bundles cb ON pp.bundleId = cb.id
            WHERE pp.userId = ${ctx.user.id}
            ORDER BY pp.createdAt DESC`
      );

      return Array.isArray(result) ? result : (result.rows || []);
    }),

  // Get payment plan transactions
  getPlanTransactions: protectedProcedure
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
        sql`SELECT * FROM payment_plan_transactions 
            WHERE planId = ${input.planId}
            ORDER BY paymentDate DESC`
      );

      return Array.isArray(result) ? result : (result.rows || []);
    }),

  // Cancel payment plan
  cancelPlan: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Verify plan belongs to user
      const planCheck: any = await dbConn.execute(
        sql`SELECT * FROM payment_plans WHERE id = ${input.planId} AND userId = ${ctx.user.id}`
      );
      const plans = Array.isArray(planCheck) ? planCheck : (planCheck.rows || []);
      
      if (plans.length === 0) {
        throw new Error("Payment plan not found");
      }

      // Update plan status
      await dbConn.execute(
        sql`UPDATE payment_plans SET status = 'cancelled' WHERE id = ${input.planId}`
      );

      return { success: true };
    }),

  // Process monthly payment (called by cron job or webhook)
  processMonthlyPayment: protectedProcedure
    .input(z.object({ planId: z.number() }))
    .mutation(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Get plan details
      const planResult: any = await dbConn.execute(
        sql`SELECT * FROM payment_plans WHERE id = ${input.planId} AND status = 'active'`
      );
      const plans = Array.isArray(planResult) ? planResult : (planResult.rows || []);
      
      if (plans.length === 0) {
        throw new Error("Active payment plan not found");
      }

      const plan = plans[0];

      // Check if all payments are completed
      if (plan.paymentsCompleted >= plan.paymentsTotal) {
        await dbConn.execute(
          sql`UPDATE payment_plans SET status = 'completed' WHERE id = ${input.planId}`
        );
        return { success: true, completed: true };
      }

      try {
        // Create payment intent for next payment
        const paymentIntent = await stripe.paymentIntents.create({
          amount: plan.monthlyAmount,
          currency: "usd",
          customer: plan.stripeCustomerId,
          payment_method: plan.stripePaymentMethodId,
          off_session: true,
          confirm: true,
          metadata: {
            planId: input.planId.toString(),
            paymentNumber: (plan.paymentsCompleted + 1).toString(),
            type: 'installment_plan_payment',
          },
        });

        if (paymentIntent.status === 'succeeded') {
          // Record successful transaction
          await dbConn.execute(
            sql`INSERT INTO payment_plan_transactions 
                (planId, amount, status, paymentDate, stripePaymentIntentId)
                VALUES (${input.planId}, ${plan.monthlyAmount}, 'completed', ${new Date()}, ${paymentIntent.id})`
          );

          // Update plan
          const newPaymentsCompleted = plan.paymentsCompleted + 1;
          const nextPaymentDate = new Date();
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

          const newStatus = newPaymentsCompleted >= plan.paymentsTotal ? 'completed' : 'active';

          await dbConn.execute(
            sql`UPDATE payment_plans 
                SET paymentsCompleted = ${newPaymentsCompleted}, 
                    nextPaymentDate = ${nextPaymentDate},
                    status = ${newStatus}
                WHERE id = ${input.planId}`
          );

          // Get user email
          const userResult: any = await dbConn.execute(
            sql`SELECT email, name FROM users WHERE id = ${plan.userId}`
          );
          const users = Array.isArray(userResult) ? userResult : (userResult.rows || []);
          const user = users[0];

          // Send confirmation email
          await email.sendWelcomeEmail(
            user.email,
            user.name,
            [`Payment ${newPaymentsCompleted} of ${plan.paymentsTotal} received: $${(plan.monthlyAmount / 100).toFixed(2)}`]
          );

          return { success: true, completed: newStatus === 'completed' };
        } else {
          throw new Error("Payment failed");
        }
      } catch (error: any) {
        // Record failed transaction
        await dbConn.execute(
          sql`INSERT INTO payment_plan_transactions 
              (planId, amount, status, paymentDate, failureReason)
              VALUES (${input.planId}, ${plan.monthlyAmount}, 'failed', ${new Date()}, ${error.message})`
        );

        // TODO: Implement retry logic and send failure notification email

        throw error;
      }
    }),
});
