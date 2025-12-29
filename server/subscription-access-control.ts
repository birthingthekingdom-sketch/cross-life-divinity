import { sql } from "drizzle-orm";
import * as db from "./db";

/**
 * Subscription access control and payment failure handling
 */

export interface SubscriptionAccessStatus {
  hasAccess: boolean;
  status: "active" | "suspended" | "failed" | "expired";
  reason?: string;
  failedPaymentAttempts?: number;
  nextRetryDate?: Date;
  accessSuspendedAt?: Date;
}

/**
 * Check if user has active subscription access
 */
export async function checkSubscriptionAccess(userId: number): Promise<SubscriptionAccessStatus> {
  const subscription = await db.getActiveSubscription(userId);

  if (!subscription) {
    return {
      hasAccess: false,
      status: "expired",
      reason: "No active subscription found",
    };
  }

  // Check if subscription is suspended due to payment failure
  if (subscription.status === "suspended") {
    return {
      hasAccess: false,
      status: "suspended",
      reason: "Subscription suspended due to payment failure",
      failedPaymentAttempts: subscription.failedPaymentAttempts,
      nextRetryDate: subscription.nextRetryDate || undefined,
      accessSuspendedAt: subscription.accessSuspendedAt || undefined,
    };
  }

  // Check if subscription is in past_due or unpaid state
  if (subscription.status === "past_due" || subscription.status === "unpaid") {
    return {
      hasAccess: false,
      status: "failed",
      reason: `Subscription status: ${subscription.status}`,
      failedPaymentAttempts: subscription.failedPaymentAttempts,
    };
  }

  // Check if current period has ended
  if (new Date() > subscription.currentPeriodEnd) {
    return {
      hasAccess: false,
      status: "expired",
      reason: "Subscription period has ended",
    };
  }

  // Subscription is active
  return {
    hasAccess: true,
    status: "active",
  };
}

/**
 * Handle payment failure - suspend access and track retry attempts
 */
export async function handlePaymentFailure(
  userId: number,
  stripeSubscriptionId: string,
  failureReason: string
): Promise<void> {
  const subscription = await db.getSubscriptionByStripeId(stripeSubscriptionId);

  if (!subscription) {
    console.error(`Subscription not found for Stripe ID: ${stripeSubscriptionId}`);
    return;
  }

  // Increment failed payment attempts
  const newAttempts = (subscription.failedPaymentAttempts || 0) + 1;
  const maxRetries = 3;

  // Calculate next retry date (exponential backoff: 3 days, 7 days, 14 days)
  const retryDelays = [3, 7, 14]; // days
  const daysUntilNextRetry = newAttempts <= maxRetries ? retryDelays[newAttempts - 1] : null;
  const nextRetryDate = daysUntilNextRetry
    ? new Date(Date.now() + daysUntilNextRetry * 24 * 60 * 60 * 1000)
    : null;

  // Suspend access if max retries exceeded
  const newStatus = newAttempts > maxRetries ? "suspended" : subscription.status;
  const accessSuspendedAt = newAttempts > maxRetries ? new Date() : subscription.accessSuspendedAt;

  // Update subscription with payment failure info
  await db.updateSubscription(subscription.id, {
    status: newStatus,
    failedPaymentAttempts: newAttempts,
    lastFailedPaymentDate: new Date(),
    nextRetryDate: nextRetryDate,
    accessSuspendedAt: accessSuspendedAt,
    lastPaymentFailureReason: failureReason,
  });

  console.log(
    `Payment failure handled for user ${userId}: attempt ${newAttempts}/${maxRetries}, status: ${newStatus}`
  );
}

/**
 * Restore access on successful payment
 */
export async function restoreAccessOnPaymentSuccess(
  userId: number,
  stripeSubscriptionId: string
): Promise<void> {
  const subscription = await db.getSubscriptionByStripeId(stripeSubscriptionId);

  if (!subscription) {
    console.error(`Subscription not found for Stripe ID: ${stripeSubscriptionId}`);
    return;
  }

  // Reset payment failure tracking
  await db.updateSubscription(subscription.id, {
    status: "active",
    failedPaymentAttempts: 0,
    lastFailedPaymentDate: null,
    nextRetryDate: null,
    accessSuspendedAt: null,
    lastPaymentFailureReason: null,
  });

  console.log(`Access restored for user ${userId} after successful payment`);
}

/**
 * Get subscription status for display
 */
export async function getSubscriptionStatusForDisplay(userId: number) {
  const subscription = await db.getActiveSubscription(userId);

  if (!subscription) {
    return null;
  }

  const accessStatus = await checkSubscriptionAccess(userId);

  return {
    subscription,
    accessStatus,
    displayStatus: getDisplayStatus(subscription, accessStatus),
    message: getStatusMessage(subscription, accessStatus),
  };
}

/**
 * Get human-readable status for display
 */
function getDisplayStatus(subscription: any, accessStatus: SubscriptionAccessStatus): string {
  if (accessStatus.status === "active") {
    return "Active";
  } else if (accessStatus.status === "suspended") {
    return "Suspended - Payment Failed";
  } else if (accessStatus.status === "failed") {
    return "Payment Issue";
  } else {
    return "Expired";
  }
}

/**
 * Get user-friendly status message
 */
function getStatusMessage(subscription: any, accessStatus: SubscriptionAccessStatus): string {
  if (accessStatus.status === "active") {
    const daysRemaining = Math.ceil(
      (subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return `Your subscription is active. Renews in ${daysRemaining} days.`;
  } else if (accessStatus.status === "suspended") {
    const attemptsRemaining = 3 - (subscription.failedPaymentAttempts || 0);
    if (attemptsRemaining > 0) {
      const nextRetry = subscription.nextRetryDate
        ? new Date(subscription.nextRetryDate).toLocaleDateString()
        : "soon";
      return `Payment failed. We'll retry on ${nextRetry}. Attempts remaining: ${attemptsRemaining}.`;
    } else {
      return "Payment failed after multiple attempts. Please update your payment method.";
    }
  } else if (accessStatus.status === "failed") {
    return "There's an issue with your subscription. Please update your payment method.";
  } else {
    return "Your subscription has expired. Please renew to continue.";
  }
}

/**
 * Get retry attempt details
 */
export function getRetryAttemptDetails(subscription: any) {
  const attempts = subscription.failedPaymentAttempts || 0;
  const maxAttempts = 3;
  const remaining = Math.max(0, maxAttempts - attempts);

  return {
    attempts,
    maxAttempts,
    remaining,
    isMaxed: attempts >= maxAttempts,
    nextRetryDate: subscription.nextRetryDate,
    lastFailureReason: subscription.lastPaymentFailureReason,
  };
}
