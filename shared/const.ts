export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

// Pricing Constants
export const PRICING = {
  LEARNING_PATH: 399.00,
  BUNDLE_3_COURSE: 299.00,
  CHAPLAINCY_TRAINING: 275.00,
  PAYMENT_PLAN_MONTHS: 6,
} as const;

// Payment Plan Calculations
export const PAYMENT_PLANS = {
  LEARNING_PATH: {
    total: PRICING.LEARNING_PATH,
    monthly: Number((PRICING.LEARNING_PATH / PRICING.PAYMENT_PLAN_MONTHS).toFixed(2)),
    months: PRICING.PAYMENT_PLAN_MONTHS,
  },
  BUNDLE_3_COURSE: {
    total: PRICING.BUNDLE_3_COURSE,
    monthly: Number((PRICING.BUNDLE_3_COURSE / PRICING.PAYMENT_PLAN_MONTHS).toFixed(2)),
    months: PRICING.PAYMENT_PLAN_MONTHS,
  },
  CHAPLAINCY_TRAINING: {
    total: PRICING.CHAPLAINCY_TRAINING,
    monthly: Number((PRICING.CHAPLAINCY_TRAINING / PRICING.PAYMENT_PLAN_MONTHS).toFixed(2)),
    months: PRICING.PAYMENT_PLAN_MONTHS,
  },
} as const;

// Payment Plan Types
export type PaymentPlanType = 'LEARNING_PATH' | 'BUNDLE_3_COURSE' | 'CHAPLAINCY_TRAINING';
export type PaymentStatus = 'active' | 'paused' | 'completed' | 'cancelled';
