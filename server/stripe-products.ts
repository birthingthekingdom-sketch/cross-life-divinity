/**
 * Stripe Products and Prices Configuration
 * Cross Life School of Divinity
 */

export const STRIPE_PRODUCTS = {
  // All-Access Subscription
  SUBSCRIPTION: {
    name: "All-Access Subscription",
    description: "Unlimited access to all 10 courses + future courses",
    priceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID || "price_subscription", // Will be created in Stripe
    amount: 4900, // $49.00 in cents
    currency: "usd",
    interval: "month",
    intervalCount: 1,
    minimumMonths: 6, // 6-month minimum commitment
  },

  // Individual Course Purchase
  INDIVIDUAL_COURSE: {
    name: "Individual Course",
    description: "One-time access to a single course",
    amount: 8900, // $89.00 in cents
    currency: "usd",
  },

  // Learning Path Purchase
  LEARNING_PATH: {
    name: "Learning Path",
    description: "Structured sequence of 4-6 courses",
    amount: 19900, // $199.00 in cents
    currency: "usd",
  },

  // 3-Course Bundle
  COURSE_BUNDLE: {
    name: "3-Course Bundle",
    description: "Choose any 3 courses from catalog",
    amount: 29900, // $299.00 in cents
    currency: "usd",
  },

  // Chaplain Course
  CHAPLAIN_COURSE: {
    name: "Chaplain Course",
    description: "Comprehensive chaplaincy training program",
    amount: 27500, // $275.00 in cents
    currency: "usd",
  },

  // Bridge Academy (GED) - Standalone
  BRIDGE_ACADEMY: {
    name: "Bridge Academy - GED Preparation",
    description: "Complete GED preparation program with all 4 subjects",
    amount: 0, // FREE - but can be purchased standalone
    currency: "usd",
  },
} as const;

/**
 * Calculate subscription total for minimum period
 */
export function getSubscriptionMinimumTotal(): number {
  return STRIPE_PRODUCTS.SUBSCRIPTION.amount * STRIPE_PRODUCTS.SUBSCRIPTION.minimumMonths;
}

/**
 * Calculate savings when choosing subscription vs individual courses
 */
export function calculateSubscriptionSavings(courseCount: number = 10): number {
  const individualTotal = STRIPE_PRODUCTS.INDIVIDUAL_COURSE.amount * courseCount;
  const subscriptionTotal = getSubscriptionMinimumTotal();
  return individualTotal - subscriptionTotal;
}

/**
 * Format price in dollars
 */
export function formatPrice(amountInCents: number): string {
  return `$${(amountInCents / 100).toFixed(2)}`;
}

/**
 * Get price display for UI
 */
export function getPriceDisplay() {
  return {
    subscription: {
      monthly: formatPrice(STRIPE_PRODUCTS.SUBSCRIPTION.amount),
      minimumTotal: formatPrice(getSubscriptionMinimumTotal()),
      minimumMonths: STRIPE_PRODUCTS.SUBSCRIPTION.minimumMonths,
    },
    individualCourse: {
      price: formatPrice(STRIPE_PRODUCTS.INDIVIDUAL_COURSE.amount),
      total10Courses: formatPrice(STRIPE_PRODUCTS.INDIVIDUAL_COURSE.amount * 10),
    },
    savings: {
      amount: formatPrice(calculateSubscriptionSavings()),
      percentage: Math.round((calculateSubscriptionSavings() / (STRIPE_PRODUCTS.INDIVIDUAL_COURSE.amount * 10)) * 100),
    },
  };
}
