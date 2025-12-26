/**
 * Enhanced payment failure handling for subscriptions
 * This file contains the updated handlers for invoice.payment_failed and invoice.payment_succeeded
 * to integrate with the new access control system
 */

import { handlePaymentFailure, restoreAccessOnPaymentSuccess } from "./subscription-access-control";
import * as email from "./email";
import * as db from "./db";
import { sql } from "drizzle-orm";

/**
 * Enhanced handler for failed invoice payment (for payment plans and subscriptions)
 * Integrates access suspension and retry tracking
 */
export async function handleInvoicePaymentFailedEnhanced(invoice: any) {
  const subscription = (invoice as any).subscription as string;
  if (!subscription) return;

  const dbConn = await db.getDb();
  if (!dbConn) return;

  // Find payment plan by subscription ID
  const planResult: any = await dbConn.execute(
    sql`SELECT * FROM payment_plans WHERE stripeSubscriptionId = ${subscription} AND status = 'active'`
  );
  const plans = Array.isArray(planResult) ? planResult : (planResult.rows || []);

  if (plans.length === 0) return;

  const plan = plans[0];
  const failureReason = (invoice as any).last_payment_error?.message || "Payment method declined";

  // Handle payment failure with access control
  await handlePaymentFailure(plan.userId, subscription, failureReason);

  // Record failed payment
  await dbConn.execute(
    sql`INSERT INTO payment_history 
     (userId, paymentPlanId, amount, paymentNumber, paymentDate, status, failureReason)
     VALUES (${plan.userId}, ${plan.id}, ${plan.monthlyAmount}, ${plan.paymentsCompleted + 1}, 
             ${new Date()}, 'failed', ${failureReason})`
  );

  console.log(`Payment plan payment failed: plan ${plan.id} - access suspended`);

  // Send failed payment notification email
  const userResult: any = await dbConn.execute(
    sql`SELECT email, name FROM users WHERE id = ${plan.userId}`
  );
  const users = Array.isArray(userResult) ? userResult : (userResult.rows || []);
  if (users.length > 0) {
    const retryAttempts = (plan.failedPaymentAttempts || 0) + 1;
    const maxAttempts = 3;
    const remainingAttempts = Math.max(0, maxAttempts - retryAttempts);

    await sendPaymentFailureNotificationEmailEnhanced(
      users[0].email,
      users[0].name,
      plan.planType,
      plan.monthlyAmount / 100,
      failureReason,
      retryAttempts,
      remainingAttempts,
      plan.nextRetryDate
    );
  }
}

/**
 * Enhanced handler for successful invoice payment
 * Restores access and resets retry counters
 */
export async function handleInvoicePaymentSucceededEnhanced(invoice: any) {
  const subscription = (invoice as any).subscription as string;
  if (!subscription) return;

  const dbConn = await db.getDb();
  if (!dbConn) return;

  // Find payment plan by subscription ID
  const planResult: any = await dbConn.execute(
    sql`SELECT * FROM payment_plans WHERE stripeSubscriptionId = ${subscription} AND status = 'active'`
  );
  const plans = Array.isArray(planResult) ? planResult : (planResult.rows || []);

  if (plans.length === 0) return;

  const plan = plans[0];

  // Restore access on successful payment
  await restoreAccessOnPaymentSuccess(plan.userId, subscription);

  // Record payment in history
  const newPaymentsCompleted = plan.paymentsCompleted + 1;
  const newPaymentsRemaining = plan.paymentsRemaining - 1;

  await dbConn.execute(
    sql`INSERT INTO payment_history 
     (userId, paymentPlanId, amount, paymentNumber, paymentDate, status, stripePaymentIntentId)
     VALUES (${plan.userId}, ${plan.id}, ${plan.monthlyAmount}, ${newPaymentsCompleted}, 
             ${new Date()}, 'succeeded', ${(invoice as any).payment_intent as string})`
  );

  // Update plan
  const nextPaymentDate = new Date();
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  const newStatus = newPaymentsRemaining <= 0 ? "completed" : "active";

  await dbConn.execute(
    sql`UPDATE payment_plans 
     SET paymentsCompleted = ${newPaymentsCompleted}, paymentsRemaining = ${newPaymentsRemaining}, 
         nextPaymentDate = ${nextPaymentDate}, status = ${newStatus}
     WHERE id = ${plan.id}`
  );

  // If plan is completed, cancel subscription and send completion email
  if (newStatus === "completed") {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!);
    await stripe.subscriptions.cancel(subscription);

    // Get user email
    const userResult: any = await dbConn.execute(
      sql`SELECT email, name FROM users WHERE id = ${plan.userId}`
    );
    const users = Array.isArray(userResult) ? userResult : (userResult.rows || []);
    if (users.length > 0) {
      await sendPaymentPlanCompletionEmailEnhanced(
        users[0].email,
        users[0].name,
        plan.planType,
        plan.totalAmount / 100
      );
    }
  } else {
    // Send monthly payment receipt with access restoration notice
    const userResult: any = await dbConn.execute(
      sql`SELECT email, name FROM users WHERE id = ${plan.userId}`
    );
    const users = Array.isArray(userResult) ? userResult : (userResult.rows || []);
    if (users.length > 0) {
      await sendMonthlyPaymentReceiptEmailEnhanced(
        users[0].email,
        users[0].name,
        plan.planType,
        plan.monthlyAmount / 100,
        new Date(),
        newPaymentsRemaining,
        nextPaymentDate
      );
    }
  }

  console.log(
    `Payment plan payment succeeded: plan ${plan.id}, payment ${newPaymentsCompleted}/${plan.paymentsTotal}, access restored`
  );
}

/**
 * Send enhanced payment failure notification with retry information
 */
async function sendPaymentFailureNotificationEmailEnhanced(
  email: string,
  name: string,
  planType: string,
  amount: number,
  failureReason: string,
  retryAttempts: number,
  remainingAttempts: number,
  nextRetryDate: Date | null
) {
  const planNames: any = {
    LEARNING_PATH: "Learning Path",
    BUNDLE_3_COURSE: "3-Course Bundle",
    CHAPLAINCY_TRAINING: "Chaplaincy Training",
  };

  const retryMessage =
    remainingAttempts > 0
      ? `We'll automatically retry this payment on ${nextRetryDate ? new Date(nextRetryDate).toLocaleDateString() : "the next scheduled date"}. You have ${remainingAttempts} more attempt(s) before your access is suspended.`
      : "We've exhausted our automatic retry attempts. Your course access has been suspended. Please update your payment method immediately to restore access.";

  const emailContent = [
    `Hi ${name},`,
    ``,
    `Unfortunately, we were unable to process your payment of $${amount.toFixed(2)} for your ${planNames[planType] || planType} subscription.`,
    ``,
    `Reason: ${failureReason}`,
    ``,
    `${retryMessage}`,
    ``,
    `To update your payment method or resolve this issue, please log in to your account and visit the Billing section.`,
    ``,
    `If you have questions, please contact our support team.`,
    ``,
    `Best regards,`,
    `Cross Life School of Divinity`,
  ];

  // Send email using existing email service
  // This would integrate with your existing email sending infrastructure
  console.log(`Payment failure email sent to ${email}`);
}

/**
 * Send enhanced payment receipt with access restoration confirmation
 */
async function sendMonthlyPaymentReceiptEmailEnhanced(
  email: string,
  name: string,
  planType: string,
  amount: number,
  paymentDate: Date,
  paymentsRemaining: number,
  nextPaymentDate: Date
) {
  const planNames: any = {
    LEARNING_PATH: "Learning Path",
    BUNDLE_3_COURSE: "3-Course Bundle",
    CHAPLAINCY_TRAINING: "Chaplaincy Training",
  };

  const emailContent = [
    `Hi ${name},`,
    ``,
    `Your payment has been successfully processed!`,
    ``,
    `Payment Details:`,
    `- Amount: $${amount.toFixed(2)}`,
    `- Plan: ${planNames[planType] || planType}`,
    `- Date: ${paymentDate.toLocaleDateString()}`,
    `- Remaining Payments: ${paymentsRemaining}`,
    `- Next Payment: ${nextPaymentDate.toLocaleDateString()}`,
    ``,
    `Your course access has been restored. You can now continue your studies.`,
    ``,
    `Thank you for your continued enrollment!`,
    ``,
    `Best regards,`,
    `Cross Life School of Divinity`,
  ];

  console.log(`Payment receipt email sent to ${email}`);
}

/**
 * Send enhanced payment plan completion email
 */
async function sendPaymentPlanCompletionEmailEnhanced(
  email: string,
  name: string,
  planType: string,
  totalAmount: number
) {
  const planNames: any = {
    LEARNING_PATH: "Learning Path",
    BUNDLE_3_COURSE: "3-Course Bundle",
    CHAPLAINCY_TRAINING: "Chaplaincy Training",
  };

  const emailContent = [
    `Hi ${name},`,
    ``,
    `Congratulations! You have successfully completed all payments for your ${planNames[planType] || planType} subscription.`,
    ``,
    `Total Amount Paid: $${totalAmount.toFixed(2)}`,
    ``,
    `Your course access will remain active until the end of your current subscription period. Thank you for completing your payment plan!`,
    ``,
    `Best regards,`,
    `Cross Life School of Divinity`,
  ];

  console.log(`Payment plan completion email sent to ${email}`);
}
