import { Request, Response } from "express";
import Stripe from "stripe";
import { sql } from "drizzle-orm";
import * as db from "./db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing stripe-signature header");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Error handling webhook event:", error);
    res.status(500).send(`Webhook handler error: ${error.message}`);
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = parseInt(session.metadata?.userId || "0");
  const type = session.metadata?.type;

  if (!userId) {
    console.error("No userId in checkout session metadata");
    return;
  }

  if (type === "subscription" || type === "subscription_upgrade") {
    // Subscription will be handled by subscription.created event
    console.log(`Checkout completed for subscription (user ${userId})`);
    
    // If this is an upgrade, grant immediate access to all courses
    if (type === "subscription_upgrade") {
      const allCourses = await db.getAllCourses();
      
      for (const course of allCourses) {
        const isEnrolled = await db.isUserEnrolledInCourse(userId, course.id);
        if (!isEnrolled) {
          await db.createCourseEnrollment({
            userId,
            courseId: course.id,
            accessCodeId: 0, // Subscription upgrade enrollment
          });
        }
      }
    }
  } else if (type === "bundle_purchase") {
    // Handle 3-course bundle purchase
    const courseIds = session.metadata?.courseIds?.split(",").map(id => parseInt(id)) || [];
    
    if (courseIds.length === 3) {
      // Create purchase record for bundle
      for (const courseId of courseIds) {
        await db.createCoursePurchase({
          userId,
          courseId,
          stripeCustomerId: session.customer as string,
          stripePaymentIntentId: session.payment_intent as string,
          amount: 9967, // $99.67 per course in bundle
          status: "completed",
        });

        // Enroll user in each course
        const isEnrolled = await db.isUserEnrolledInCourse(userId, courseId);
        if (!isEnrolled) {
          await db.createCourseEnrollment({
            userId,
            courseId,
            accessCodeId: 0, // Bundle purchase enrollment
          });
        }
      }

      console.log(`Bundle purchase completed: user ${userId}, courses ${courseIds.join(", ")}`);
    }
  } else if (type === "course_purchase") {
    // Handle one-time course purchase
    const courseId = parseInt(session.metadata?.courseId || "0");
    
    if (courseId) {
      // Create course purchase record
      await db.createCoursePurchase({
        userId,
        courseId,
        stripeCustomerId: session.customer as string,
        stripePaymentIntentId: session.payment_intent as string,
        amount: session.amount_total || 0,
        status: "completed",
      });

      // Enroll user in the course
      const isEnrolled = await db.isUserEnrolledInCourse(userId, courseId);
      if (!isEnrolled) {
      await db.createCourseEnrollment({
        userId,
        courseId,
        accessCodeId: 0, // Purchase-based enrollment
      });
      }

      console.log(`Course purchase completed: user ${userId}, course ${courseId}`);
    }
  }
}

/**
 * Handle subscription creation or update
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = parseInt(subscription.metadata?.userId || "0");

  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }

  // Check if subscription already exists
  const existing = await db.getSubscriptionByStripeId(subscription.id);

  if (existing) {
    // Update existing subscription
    await db.updateSubscription(existing.id, {
      status: subscription.status as "active" | "canceled" | "past_due" | "unpaid",
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    });
  } else {
    // Create new subscription
    await db.createSubscription({
      userId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status: subscription.status as "active" | "canceled" | "past_due" | "unpaid",
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    });

    // Grant access to all courses
    const allCourses = await db.getAllCourses();
    
    for (const course of allCourses) {
      const isEnrolled = await db.isUserEnrolledInCourse(userId, course.id);
      if (!isEnrolled) {
        await db.createCourseEnrollment({
          userId,
          courseId: course.id,
          accessCodeId: 0, // Subscription-based enrollment
        });
      }
    }
  }

  console.log(`Subscription updated: ${subscription.id} for user ${userId}`);
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const existing = await db.getSubscriptionByStripeId(subscription.id);

  if (existing) {
    await db.updateSubscription(existing.id, {
      status: "canceled",
    });

    console.log(`Subscription canceled: ${subscription.id}`);
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Update course purchase status if exists
  const purchase = await db.getCoursePurchaseByPaymentIntent(paymentIntent.id);

  if (purchase) {
    await db.updateCoursePurchase(purchase.id, {
      status: "completed",
    });

    console.log(`Payment succeeded for purchase ${purchase.id}`);
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Update course purchase status if exists
  const purchase = await db.getCoursePurchaseByPaymentIntent(paymentIntent.id);

  if (purchase) {
    await db.updateCoursePurchase(purchase.id, {
      status: "failed",
    });

    console.log(`Payment failed for purchase ${purchase.id}`);
  }
}

/**
 * Handle successful invoice payment (for payment plans)
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
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
  const newPaymentsCompleted = plan.paymentsCompleted + 1;
  const newPaymentsRemaining = plan.paymentsRemaining - 1;

  // Record payment in history
  await dbConn.execute(
    sql`INSERT INTO payment_history 
     (userId, paymentPlanId, amount, paymentNumber, paymentDate, status, stripePaymentIntentId)
     VALUES (${plan.userId}, ${plan.id}, ${plan.monthlyAmount}, ${newPaymentsCompleted}, 
             ${new Date()}, 'succeeded', ${(invoice as any).payment_intent as string})`
  );

  // Update plan
  const nextPaymentDate = new Date();
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  const newStatus = newPaymentsRemaining <= 0 ? 'completed' : 'active';

  await dbConn.execute(
    sql`UPDATE payment_plans 
     SET paymentsCompleted = ${newPaymentsCompleted}, paymentsRemaining = ${newPaymentsRemaining}, 
         nextPaymentDate = ${nextPaymentDate}, status = ${newStatus}
     WHERE id = ${plan.id}`
  );

  // If plan is completed, cancel subscription
  if (newStatus === 'completed') {
    await stripe.subscriptions.cancel(subscription);
  }

  console.log(`Payment plan payment succeeded: plan ${plan.id}, payment ${newPaymentsCompleted}/${plan.paymentsTotal}`);
}

/**
 * Handle failed invoice payment (for payment plans)
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
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

  // Record failed payment
  await dbConn.execute(
    sql`INSERT INTO payment_history 
     (userId, paymentPlanId, amount, paymentNumber, paymentDate, status, failureReason)
     VALUES (${plan.userId}, ${plan.id}, ${plan.monthlyAmount}, ${plan.paymentsCompleted + 1}, 
             ${new Date()}, 'failed', 'Payment method declined')`
  );

  // Pause access
  await dbConn.execute(
    sql`UPDATE payment_plans SET status = 'paused' WHERE id = ${plan.id}`
  );

  console.log(`Payment plan payment failed: plan ${plan.id} - access paused`);
  
  // TODO: Send email notification to user
}
