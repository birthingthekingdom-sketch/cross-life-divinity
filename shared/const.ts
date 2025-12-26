export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

// Pricing Constants
export const PRICING = {
  LEARNING_PATH: 199.00,
  BUNDLE_3_COURSE: 299.00,
  CHAPLAINCY_TRAINING: 325.00, // $275 course + $50 background check
  PAYMENT_PLAN_MONTHS: 6,
} as const;

// Payment Plan Calculations (amounts in cents for Stripe)
export const PAYMENT_PLANS = {
  LEARNING_PATH: {
    total: Math.round(PRICING.LEARNING_PATH * 100), // cents
    monthly: Math.round((PRICING.LEARNING_PATH / PRICING.PAYMENT_PLAN_MONTHS) * 100), // cents
    months: PRICING.PAYMENT_PLAN_MONTHS,
  },
  BUNDLE_3_COURSE: {
    total: Math.round(PRICING.BUNDLE_3_COURSE * 100), // cents
    monthly: Math.round((PRICING.BUNDLE_3_COURSE / PRICING.PAYMENT_PLAN_MONTHS) * 100), // cents
    months: PRICING.PAYMENT_PLAN_MONTHS,
  },
  CHAPLAINCY_TRAINING: {
    total: Math.round(PRICING.CHAPLAINCY_TRAINING * 100), // cents
    monthly: Math.round((PRICING.CHAPLAINCY_TRAINING / PRICING.PAYMENT_PLAN_MONTHS) * 100), // cents
    months: PRICING.PAYMENT_PLAN_MONTHS,
  },
} as const;

// Payment Plan Types
export type PaymentPlanType = 'LEARNING_PATH' | 'BUNDLE_3_COURSE' | 'CHAPLAINCY_TRAINING';
export type PaymentStatus = 'active' | 'paused' | 'completed' | 'cancelled';
