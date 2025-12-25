import { Request, Response } from "express";
import Stripe from "stripe";
import { sql } from "drizzle-orm";
import * as db from "./db";
import { sendMonthlyPaymentReceiptEmail, sendFailedPaymentNotificationEmail, sendPaymentPlanCompletionEmail, sendPaymentPlanEnrollmentEmail, sendFullPaymentReceiptEmail, sendEnhancedWelcomeEmail } from './email';

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
  const planType = session.metadata?.planType;
  const paymentMethod = session.metadata?.paymentMethod;

  if (!userId) {
    console.error("No userId in checkout session metadata");
    return;
  }

  // Handle new payment plan checkout sessions
  if (planType && paymentMethod) {
    console.log(`Payment plan checkout completed: user ${userId}, plan ${planType}, method ${paymentMethod}`);
    
    const dbConn = await db.getDb();
    if (!dbConn) {
      console.error("Database not available");
      return;
    }

    // Get pricing config
    const PLAN_CONFIG: any = {
      LEARNING_PATH: { totalAmount: 39900, monthlyAmount: 6650, months: 6 },
      BUNDLE_3_COURSE: { totalAmount: 29900, monthlyAmount: 4983, months: 6 },
      CHAPLAINCY_TRAINING: { totalAmount: 27500, monthlyAmount: 4583, months: 6 },
    };
    const config = PLAN_CONFIG[planType];

    if (paymentMethod === 'payment_plan') {
      // Create payment plan record for subscription
      const subscriptionId = session.subscription as string;
      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      await dbConn.execute(
        sql`INSERT INTO payment_plans 
            (userId, planType, bundleId, learningPathId, totalAmount, monthlyAmount, 
             paymentsTotal, paymentsCompleted, paymentsRemaining, nextPaymentDate, 
             status, stripeSubscriptionId, stripeCustomerId, agreementAcceptedAt)
            VALUES (${userId}, ${planType}, ${session.metadata?.bundleId || null}, 
                    ${session.metadata?.learningPathId || null}, ${config.totalAmount}, ${config.monthlyAmount}, 
                    ${config.months}, 1, ${config.months - 1}, ${nextPaymentDate}, 
                    'active', ${subscriptionId}, ${session.customer as string}, ${new Date()})`
      );

      // Record first payment
      await dbConn.execute(
        sql`INSERT INTO payment_history 
            (userId, paymentPlanId, amount, paymentNumber, paymentDate, status, stripePaymentIntentId)
            SELECT ${userId}, LAST_INSERT_ID(), ${config.monthlyAmount}, 1, ${new Date()}, 
                   'succeeded', ${session.payment_intent as string}`
      );
    }

    // Enroll user in courses based on plan type
    let enrolledCourseNames: string[] = [];
    
    if (planType === 'BUNDLE_3_COURSE') {
      // Get selected course IDs from metadata
      const selectedCourseIds = session.metadata?.selectedCourseIds 
        ? JSON.parse(session.metadata.selectedCourseIds) 
        : [];
      
      for (const courseId of selectedCourseIds) {
        const existing: any = await dbConn.execute(
          sql`SELECT * FROM course_enrollments 
              WHERE userId = ${userId} AND courseId = ${courseId}`
        );
        const enrollments = Array.isArray(existing) ? existing : (existing.rows || []);
        
        if (enrollments.length === 0) {
          await dbConn.execute(
            sql`INSERT INTO course_enrollments (userId, courseId, enrolledAt) 
                VALUES (${userId}, ${courseId}, NOW())`
          );
          
          // Get course name for welcome email
          const courseData: any = await dbConn.execute(
            sql`SELECT title FROM courses WHERE id = ${courseId}`
          );
          const courses = Array.isArray(courseData) ? courseData : (courseData.rows || []);
          if (courses.length > 0) {
            enrolledCourseNames.push(courses[0].title);
          }
        }
      }
      console.log(`Enrolled user ${userId} in bundle courses: ${selectedCourseIds.join(', ')}`);
    } else if (planType === 'LEARNING_PATH') {
      const learningPathId = parseInt(session.metadata?.learningPathId || '0');
      if (learningPathId) {
        const pathCourses: any = await dbConn.execute(
          sql`SELECT courseId FROM learning_path_courses WHERE learningPathId = ${learningPathId}`
        );
        const courses = Array.isArray(pathCourses) ? pathCourses : (pathCourses.rows || []);

        for (const course of courses) {
          const existing: any = await dbConn.execute(
            sql`SELECT * FROM course_enrollments 
                WHERE userId = ${userId} AND courseId = ${course.courseId}`
          );
          const enrollments = Array.isArray(existing) ? existing : (existing.rows || []);
          
          if (enrollments.length === 0) {
            await dbConn.execute(
              sql`INSERT INTO course_enrollments (userId, courseId, enrolledAt) 
                  VALUES (${userId}, ${course.courseId}, NOW())`
            );
            
            // Get course name for welcome email
            const courseTitle: any = await dbConn.execute(
              sql`SELECT title FROM courses WHERE id = ${course.courseId}`
            );
            const titles = Array.isArray(courseTitle) ? courseTitle : (courseTitle.rows || []);
            if (titles.length > 0) {
              enrolledCourseNames.push(titles[0].title);
            }
          }
        }
        console.log(`Enrolled user ${userId} in learning path ${learningPathId} courses`);
      }
    } else if (planType === 'CHAPLAINCY_TRAINING') {
      // Find chaplaincy course
      const chaplainCourse: any = await dbConn.execute(
        sql`SELECT id, title FROM courses WHERE courseCode = 'CHAP-501' LIMIT 1`
      );
      const courses = Array.isArray(chaplainCourse) ? chaplainCourse : (chaplainCourse.rows || []);
      
      if (courses.length > 0) {
        const courseId = courses[0].id;
        const courseTitle = courses[0].title;
        const existing: any = await dbConn.execute(
          sql`SELECT * FROM course_enrollments 
              WHERE userId = ${userId} AND courseId = ${courseId}`
        );
        const enrollments = Array.isArray(existing) ? existing : (existing.rows || []);
        
        if (enrollments.length === 0) {
          await dbConn.execute(
            sql`INSERT INTO course_enrollments (userId, courseId, enrolledAt) 
                VALUES (${userId}, ${courseId}, NOW())`
          );
          enrolledCourseNames.push(courseTitle);
        }
        console.log(`Enrolled user ${userId} in chaplaincy training`);
      }
    }

    // Send email notification based on payment method
    const user: any = await dbConn.execute(
      sql`SELECT name, email FROM users WHERE id = ${userId}`
    );
    const users = Array.isArray(user) ? user : (user.rows || []);
    
    if (users.length > 0 && users[0].email) {
      const userName = users[0].name || 'Student';
      const userEmail = users[0].email;
      
      if (paymentMethod === 'payment_plan') {
        // Send payment plan enrollment email
        await sendPaymentPlanEnrollmentEmail(
          userEmail,
          userName,
          planType,
          config.totalAmount / 100,
          config.monthlyAmount / 100,
          config.months,
          new Date()
        );
      } else if (paymentMethod === 'full_payment') {
        // Send full payment receipt email
        await sendFullPaymentReceiptEmail(
          userEmail,
          userName,
          planType,
          config.totalAmount / 100,
          new Date(),
          session.payment_intent as string || session.id
        );
      }
      
      // Send welcome email with enrolled courses
      if (enrolledCourseNames.length > 0) {
        await sendEnhancedWelcomeEmail(
          userEmail,
          userName,
          enrolledCourseNames
        );
      }
    }

    return; // Exit after handling payment plan checkout
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

  // If plan is completed, cancel subscription and send completion email
  if (newStatus === 'completed') {
    await stripe.subscriptions.cancel(subscription);
    
    // Get user email
    const userResult: any = await dbConn.execute(
      sql`SELECT email, name FROM users WHERE id = ${plan.userId}`
    );
    const users = Array.isArray(userResult) ? userResult : (userResult.rows || []);
    if (users.length > 0) {
      await sendPaymentPlanCompletionEmail(
        users[0].email,
        users[0].name,
        plan.planType,
        plan.totalAmount / 100
      );
    }
  } else {
    // Send monthly payment receipt
    const userResult: any = await dbConn.execute(
      sql`SELECT email, name FROM users WHERE id = ${plan.userId}`
    );
    const users = Array.isArray(userResult) ? userResult : (userResult.rows || []);
    if (users.length > 0) {
      await sendMonthlyPaymentReceiptEmail(
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
  
  // Send failed payment notification email
  const userResult: any = await dbConn.execute(
    sql`SELECT email, name FROM users WHERE id = ${plan.userId}`
  );
  const users = Array.isArray(userResult) ? userResult : (userResult.rows || []);
  if (users.length > 0) {
    await sendFailedPaymentNotificationEmail(
      users[0].email,
      users[0].name,
      plan.planType,
      plan.monthlyAmount / 100,
      'Payment method declined'
    );
  }
}
