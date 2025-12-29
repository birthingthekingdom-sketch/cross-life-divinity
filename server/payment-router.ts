import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import * as db from "./db";
import { STRIPE_PRODUCTS } from "./stripe-products";
import { TRPCError } from "@trpc/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export const paymentRouter = router({
  /**
   * Create checkout session for subscription
   */
  createSubscriptionCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.user;

    // Get or create Stripe customer
    let stripeCustomer = await db.getStripeCustomerByUserId(user.id);

    let customerId: string;

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: {
          userId: user.id.toString(),
        },
      });

      await db.getOrCreateStripeCustomer(user.id, customer.id);
      customerId = customer.id;
    } else {
      customerId = stripeCustomer.stripeCustomerId;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["us_bank_account"],
      line_items: [
        {
          price_data: {
            currency: STRIPE_PRODUCTS.SUBSCRIPTION.currency,
            product_data: {
              name: STRIPE_PRODUCTS.SUBSCRIPTION.name,
              description: STRIPE_PRODUCTS.SUBSCRIPTION.description,
            },
            recurring: {
              interval: STRIPE_PRODUCTS.SUBSCRIPTION.interval,
              interval_count: STRIPE_PRODUCTS.SUBSCRIPTION.intervalCount,
            },
            unit_amount: STRIPE_PRODUCTS.SUBSCRIPTION.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${ctx.req.headers.origin}/dashboard?subscription=success`,
      cancel_url: `${ctx.req.headers.origin}/pricing?subscription=canceled`,
      client_reference_id: user.id.toString(),
      metadata: {
        userId: user.id.toString(),
        type: "subscription",
      },
      allow_promotion_codes: true,
    });

    return { url: session.url };
  }),

  /**
   * Create checkout session for individual course
   */
  createCourseCheckout: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      // Get course details
      const course = await db.getCourseById(input.courseId);

      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }

      // Check if already enrolled
      const isEnrolled = await db.isUserEnrolledInCourse(user.id, input.courseId);

      if (isEnrolled) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already enrolled in this course" });
      }

      // Get or create Stripe customer
      let stripeCustomer = await db.getStripeCustomerByUserId(user.id);

      let customerId: string;

      if (!stripeCustomer) {
        const customer = await stripe.customers.create({
          email: user.email!,
          name: user.name || undefined,
          metadata: {
            userId: user.id.toString(),
          },
        });

        await db.getOrCreateStripeCustomer(user.id, customer.id);
        customerId = customer.id;
      } else {
        customerId = stripeCustomer.stripeCustomerId;
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: STRIPE_PRODUCTS.INDIVIDUAL_COURSE.currency,
              product_data: {
                name: course.title,
                description: course.description || undefined,
              },
              unit_amount: STRIPE_PRODUCTS.INDIVIDUAL_COURSE.amount,
            },
            quantity: 1,
          },
        ],
        success_url: `${ctx.req.headers.origin}/dashboard?purchase=success&courseId=${input.courseId}`,
        cancel_url: `${ctx.req.headers.origin}/pricing?purchase=canceled`,
        client_reference_id: user.id.toString(),
        metadata: {
          userId: user.id.toString(),
          courseId: input.courseId.toString(),
          type: "course_purchase",
        },
        allow_promotion_codes: true,
      });

      return { url: session.url };
    }),

  /**
   * Get user's subscription status
   */
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);
    return subscription || null;
  }),

  /**
   * Get user's course purchases
   */
  getCoursePurchases: protectedProcedure.query(async ({ ctx }) => {
    const purchases = await db.getCoursePurchasesByUserId(ctx.user.id);
    return purchases;
  }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await db.getActiveSubscription(ctx.user.id);

    if (!subscription) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No active subscription found" });
    }

    // Cancel at period end in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update local database
    await db.updateSubscription(subscription.id, { cancelAtPeriodEnd: true });

    return { success: true };
  }),

  /**
   * Upgrade from individual courses to subscription
   */
  upgradeToSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.user;

    // Get all completed course purchases
    const purchases = await db.getCompletedCoursePurchases(user.id);

    const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
    const creditAmount = totalSpent; // Full credit for previous purchases

    // Get or create Stripe customer
    let stripeCustomer = await db.getStripeCustomerByUserId(user.id);

    let customerId: string;

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: {
          userId: user.id.toString(),
        },
      });

      await db.getOrCreateStripeCustomer(user.id, customer.id);
      customerId = customer.id;
    } else {
      customerId = stripeCustomer.stripeCustomerId;
    }

    // Create a coupon for the credit amount if there's any credit
    let coupon;
    if (creditAmount > 0) {
      coupon = await stripe.coupons.create({
        amount_off: creditAmount,
        currency: "usd",
        duration: "once",
        name: `Upgrade Credit - $${(creditAmount / 100).toFixed(2)}`,
      });
    }

    // Create checkout session with coupon if applicable
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["us_bank_account"],
      line_items: [
        {
          price_data: {
            currency: STRIPE_PRODUCTS.SUBSCRIPTION.currency,
            product_data: {
              name: STRIPE_PRODUCTS.SUBSCRIPTION.name,
              description: creditAmount > 0 
                ? `${STRIPE_PRODUCTS.SUBSCRIPTION.description} (Upgrade with $${(creditAmount / 100).toFixed(2)} credit)`
                : STRIPE_PRODUCTS.SUBSCRIPTION.description,
            },
            recurring: {
              interval: STRIPE_PRODUCTS.SUBSCRIPTION.interval,
              interval_count: STRIPE_PRODUCTS.SUBSCRIPTION.intervalCount,
            },
            unit_amount: STRIPE_PRODUCTS.SUBSCRIPTION.amount,
          },
          quantity: 1,
        },
      ],
      ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),
      success_url: `${ctx.req.headers.origin}/dashboard?upgrade=success`,
      cancel_url: `${ctx.req.headers.origin}/pricing?upgrade=canceled`,
      client_reference_id: user.id.toString(),
      metadata: {
        userId: user.id.toString(),
        type: "subscription_upgrade",
        creditAmount: creditAmount.toString(),
      },
      allow_promotion_codes: true,
    });

    return {
      url: session.url,
      creditAmount,
      creditDisplay: `$${(creditAmount / 100).toFixed(2)}`,
    };
  }),
});
