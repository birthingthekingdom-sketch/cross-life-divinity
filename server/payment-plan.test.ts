import { describe, it, expect, beforeAll } from 'vitest';
import { PAYMENT_PLANS, PRICING } from '../shared/const';

describe('Payment Plan Configuration', () => {
  it('should have correct pricing for Learning Paths', () => {
    expect(PRICING.LEARNING_PATH).toBe(399);
    expect(PAYMENT_PLANS.LEARNING_PATH.total).toBe(39900); // cents
    expect(PAYMENT_PLANS.LEARNING_PATH.monthly).toBe(6650); // $66.50
    expect(PAYMENT_PLANS.LEARNING_PATH.months).toBe(6);
  });

  it('should have correct pricing for 3-Course Bundles', () => {
    expect(PRICING.BUNDLE_3_COURSE).toBe(299);
    expect(PAYMENT_PLANS.BUNDLE_3_COURSE.total).toBe(29900); // cents
    expect(PAYMENT_PLANS.BUNDLE_3_COURSE.monthly).toBe(4983); // $49.83
    expect(PAYMENT_PLANS.BUNDLE_3_COURSE.months).toBe(6);
  });

  it('should have correct pricing for Chaplaincy Training', () => {
    expect(PRICING.CHAPLAINCY_TRAINING).toBe(275);
    expect(PAYMENT_PLANS.CHAPLAINCY_TRAINING.total).toBe(27500); // cents
    expect(PAYMENT_PLANS.CHAPLAINCY_TRAINING.monthly).toBe(4583); // $45.83
    expect(PAYMENT_PLANS.CHAPLAINCY_TRAINING.months).toBe(6);
  });

  it('should calculate monthly payments correctly (total / months)', () => {
    Object.entries(PAYMENT_PLANS).forEach(([key, plan]) => {
      const expectedMonthly = Math.round(plan.total / plan.months);
      expect(plan.monthly).toBe(expectedMonthly);
    });
  });

  it('should have 0% interest (monthly * months = total)', () => {
    Object.entries(PAYMENT_PLANS).forEach(([key, plan]) => {
      const totalFromMonthly = plan.monthly * plan.months;
      // Allow small rounding difference (within $1)
      expect(Math.abs(totalFromMonthly - plan.total)).toBeLessThanOrEqual(100);
    });
  });
});

describe('Payment Plan Terms', () => {
  it('should enforce 6-month payment period', () => {
    Object.values(PAYMENT_PLANS).forEach(plan => {
      expect(plan.months).toBe(6);
    });
  });

  it('should have reasonable monthly amounts', () => {
    Object.values(PAYMENT_PLANS).forEach(plan => {
      const monthlyDollars = plan.monthly / 100;
      expect(monthlyDollars).toBeGreaterThan(40);
      expect(monthlyDollars).toBeLessThan(70);
    });
  });
});
