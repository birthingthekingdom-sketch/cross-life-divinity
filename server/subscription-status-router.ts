import { router, protectedProcedure } from "./_core/trpc";
import { checkSubscriptionAccess, getSubscriptionStatusForDisplay, getRetryAttemptDetails } from "./subscription-access-control";
import * as db from "./db";

export const subscriptionStatusRouter = router({
  /**
   * Get current subscription status for authenticated user
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const statusInfo = await getSubscriptionStatusForDisplay(ctx.user.id);
    return statusInfo;
  }),

  /**
   * Check if user has access to courses
   */
  checkAccess: protectedProcedure.query(async ({ ctx }) => {
    const accessStatus = await checkSubscriptionAccess(ctx.user.id);
    return accessStatus;
  }),

  /**
   * Get detailed retry attempt information
   */
  getRetryDetails: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);
    if (!subscription) {
      return null;
    }
    return getRetryAttemptDetails(subscription);
  }),

  /**
   * Get payment method update URL (for Stripe customer portal)
   */
  getPaymentMethodUpdateUrl: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);
    if (!subscription) {
      return null;
    }

    // Return Stripe customer portal URL for updating payment method
    const Stripe = require("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.VITE_APP_URL}/dashboard`,
      });

      return {
        url: session.url,
      };
    } catch (error) {
      console.error("Failed to create billing portal session:", error);
      return null;
    }
  }),

  /**
   * Get subscription history and payment details
   */
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    const dbConn = await db.getDb();
    if (!dbConn) return [];

    const { sql } = require("drizzle-orm");

    // Get payment history for user
    const result: any = await dbConn.execute(
      sql`SELECT * FROM payment_history 
          WHERE userId = ${ctx.user.id} 
          ORDER BY paymentDate DESC 
          LIMIT 12`
    );

    const payments = Array.isArray(result) ? result : (result.rows || []);
    return payments.map((payment: any) => ({
      id: payment.id,
      amount: payment.amount / 100, // Convert from cents
      date: payment.paymentDate,
      status: payment.status,
      paymentNumber: payment.paymentNumber,
      failureReason: payment.failureReason,
    }));
  }),

  /**
   * Get subscription details for admin view
   */
  getSubscriptionDetails: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);
    if (!subscription) {
      return null;
    }

    const accessStatus = await checkSubscriptionAccess(ctx.user.id);

    return {
      id: subscription.id,
      status: subscription.status,
      accessStatus,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      failedPaymentAttempts: subscription.failedPaymentAttempts,
      lastFailedPaymentDate: subscription.lastFailedPaymentDate,
      nextRetryDate: subscription.nextRetryDate,
      accessSuspendedAt: subscription.accessSuspendedAt,
      lastPaymentFailureReason: subscription.lastPaymentFailureReason,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    };
  }),
});
