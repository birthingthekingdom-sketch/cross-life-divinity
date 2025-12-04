import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Payment System Database Functions", () => {
  const testUserId = 999999; // Test user ID
  const testStripeCustomerId = "cus_test_" + Date.now();
  const testStripeSubscriptionId = "sub_test_" + Date.now();
  const testPaymentIntentId = "pi_test_" + Date.now();

  describe("Stripe Customer Management", () => {
    it("should create and retrieve Stripe customer", async () => {
      const customer = await db.getOrCreateStripeCustomer(testUserId, testStripeCustomerId);
      
      expect(customer).toBeDefined();
      expect(customer.userId).toBe(testUserId);
      expect(customer.stripeCustomerId).toBe(testStripeCustomerId);
    });

    it("should return existing Stripe customer if already exists", async () => {
      const customer1 = await db.getOrCreateStripeCustomer(testUserId, testStripeCustomerId);
      const customer2 = await db.getOrCreateStripeCustomer(testUserId, testStripeCustomerId);
      
      expect(customer1.id).toBe(customer2.id);
      expect(customer1.stripeCustomerId).toBe(customer2.stripeCustomerId);
    });

    it("should get Stripe customer by user ID", async () => {
      const customer = await db.getStripeCustomerByUserId(testUserId);
      
      expect(customer).toBeDefined();
      expect(customer?.userId).toBe(testUserId);
      expect(customer?.stripeCustomerId).toBe(testStripeCustomerId);
    });
  });

  describe("Subscription Management", () => {
    let subscriptionId: number;

    it("should create subscription", async () => {
      subscriptionId = await db.createSubscription({
        userId: testUserId,
        stripeCustomerId: testStripeCustomerId,
        stripeSubscriptionId: testStripeSubscriptionId,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
      });
      
      expect(subscriptionId).toBeGreaterThan(0);
    });

    it("should get active subscription for user", async () => {
      const subscription = await db.getActiveSubscription(testUserId);
      
      expect(subscription).toBeDefined();
      expect(subscription?.userId).toBe(testUserId);
      expect(subscription?.status).toBe("active");
      expect(subscription?.stripeSubscriptionId).toBe(testStripeSubscriptionId);
    });

    it("should update subscription", async () => {
      const subscription = await db.getActiveSubscription(testUserId);
      
      if (subscription) {
        await db.updateSubscription(subscription.id, {
          cancelAtPeriodEnd: true,
        });
        
        const updated = await db.getActiveSubscription(testUserId);
        expect(updated?.cancelAtPeriodEnd).toBe(true);
        
        // Reset for other tests
        await db.updateSubscription(subscription.id, {
          cancelAtPeriodEnd: false,
        });
      }
    });

    it("should get subscription by Stripe subscription ID", async () => {
      const found = await db.getSubscriptionByStripeId(testStripeSubscriptionId);
      
      expect(found).toBeDefined();
      expect(found?.stripeSubscriptionId).toBe(testStripeSubscriptionId);
      expect(found?.userId).toBe(testUserId);
    });
  });

  describe("Course Purchase Management", () => {
    let purchaseId: number;

    it("should create course purchase", async () => {
      // Get first available course
      const courses = await db.getAllCourses();
      expect(courses.length).toBeGreaterThan(0);
      
      const testCourseId = courses[0].id;
      
      purchaseId = await db.createCoursePurchase({
        userId: testUserId,
        courseId: testCourseId,
        stripeCustomerId: testStripeCustomerId,
        stripePaymentIntentId: testPaymentIntentId,
        amount: 8900, // $89.00
        status: "completed",
      });
      
      expect(purchaseId).toBeGreaterThan(0);
    });

    it("should get course purchases by user ID", async () => {
      const purchases = await db.getCoursePurchasesByUserId(testUserId);
      
      expect(purchases).toBeDefined();
      expect(Array.isArray(purchases)).toBe(true);
      expect(purchases.length).toBeGreaterThan(0);
    });

    it("should get completed course purchases", async () => {
      const purchases = await db.getCompletedCoursePurchases(testUserId);
      
      expect(purchases).toBeDefined();
      expect(Array.isArray(purchases)).toBe(true);
      expect(purchases.length).toBeGreaterThan(0);
      
      // All purchases should have status "completed"
      purchases.forEach(purchase => {
        expect(purchase.status).toBe("completed");
      });
    });

    it("should update course purchase status", async () => {
      const purchases = await db.getCoursePurchasesByUserId(testUserId);
      
      if (purchases.length > 0) {
        const purchase = purchases[0];
        
        await db.updateCoursePurchase(purchase.id, {
          status: "refunded",
        });
        
        const updated = await db.getCoursePurchasesByUserId(testUserId);
        const refunded = updated.find(p => p.id === purchase.id);
        
        expect(refunded?.status).toBe("refunded");
        
        // Reset for other tests
        await db.updateCoursePurchase(purchase.id, {
          status: "completed",
        });
      }
    });

    it("should get course purchase by payment intent ID", async () => {
      const found = await db.getCoursePurchaseByPaymentIntent(testPaymentIntentId);
      
      expect(found).toBeDefined();
      expect(found?.stripePaymentIntentId).toBe(testPaymentIntentId);
      expect(found?.userId).toBe(testUserId);
    });
  });

  describe("Upgrade Credit Calculation", () => {
    it("should calculate total spent on completed purchases", async () => {
      const purchases = await db.getCompletedCoursePurchases(testUserId);
      
      const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
      
      expect(totalSpent).toBeGreaterThanOrEqual(0);
      
      // If user has completed purchases, total should be positive
      if (purchases.length > 0) {
        expect(totalSpent).toBeGreaterThan(0);
        
        // Verify the calculation matches expected amount
        const expectedTotal = purchases.length * 8900; // $89.00 per course
        expect(totalSpent).toBe(expectedTotal);
      }
    });

    it("should provide credit display format", async () => {
      const purchases = await db.getCompletedCoursePurchases(testUserId);
      const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
      
      const creditDisplay = `$${(totalSpent / 100).toFixed(2)}`;
      
      expect(creditDisplay).toMatch(/^\$\d+\.\d{2}$/);
      
      if (purchases.length > 0) {
        expect(creditDisplay).not.toBe("$0.00");
      }
    });
  });

  describe("Payment System Integration", () => {
    it("should verify all payment tables exist", async () => {
      // Test that we can query all payment-related tables
      const stripeCustomer = await db.getStripeCustomerByUserId(testUserId);
      const subscription = await db.getActiveSubscription(testUserId);
      const purchases = await db.getCoursePurchasesByUserId(testUserId);
      
      expect(stripeCustomer).toBeDefined();
      expect(subscription).toBeDefined();
      expect(Array.isArray(purchases)).toBe(true);
    });

    it("should handle user with no purchases", async () => {
      const nonExistentUserId = 888888;
      const purchases = await db.getCoursePurchasesByUserId(nonExistentUserId);
      
      expect(Array.isArray(purchases)).toBe(true);
      expect(purchases.length).toBe(0);
    });

    it("should handle user with no subscription", async () => {
      const nonExistentUserId = 777777;
      const subscription = await db.getActiveSubscription(nonExistentUserId);
      
      expect(subscription).toBeNull();
    });
  });
});
