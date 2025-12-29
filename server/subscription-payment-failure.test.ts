import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  checkSubscriptionAccess,
  handlePaymentFailure,
  restoreAccessOnPaymentSuccess,
  getRetryAttemptDetails,
} from "./subscription-access-control";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  getActiveSubscription: vi.fn(),
  getSubscriptionByStripeId: vi.fn(),
  updateSubscription: vi.fn(),
}));

describe("Subscription Payment Failure Framework", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkSubscriptionAccess", () => {
    it("should deny access when no subscription exists", async () => {
      vi.mocked(db.getActiveSubscription).mockResolvedValue(null);

      const result = await checkSubscriptionAccess(1);

      expect(result.hasAccess).toBe(false);
      expect(result.status).toBe("expired");
      expect(result.reason).toBe("No active subscription found");
    });

    it("should deny access when subscription is suspended", async () => {
      const mockSubscription = {
        id: 1,
        userId: 1,
        status: "suspended",
        failedPaymentAttempts: 3,
        nextRetryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        accessSuspendedAt: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      vi.mocked(db.getActiveSubscription).mockResolvedValue(mockSubscription as any);

      const result = await checkSubscriptionAccess(1);

      expect(result.hasAccess).toBe(false);
      expect(result.status).toBe("suspended");
      expect(result.failedPaymentAttempts).toBe(3);
    });

    it("should deny access when subscription is past_due", async () => {
      const mockSubscription = {
        id: 1,
        userId: 1,
        status: "past_due",
        failedPaymentAttempts: 1,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      vi.mocked(db.getActiveSubscription).mockResolvedValue(mockSubscription as any);

      const result = await checkSubscriptionAccess(1);

      expect(result.hasAccess).toBe(false);
      expect(result.status).toBe("failed");
    });

    it("should deny access when subscription period has ended", async () => {
      const mockSubscription = {
        id: 1,
        userId: 1,
        status: "active",
        currentPeriodEnd: new Date(Date.now() - 1000), // Ended 1 second ago
      };

      vi.mocked(db.getActiveSubscription).mockResolvedValue(mockSubscription as any);

      const result = await checkSubscriptionAccess(1);

      expect(result.hasAccess).toBe(false);
      expect(result.status).toBe("expired");
    });

    it("should allow access when subscription is active and valid", async () => {
      const mockSubscription = {
        id: 1,
        userId: 1,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      vi.mocked(db.getActiveSubscription).mockResolvedValue(mockSubscription as any);

      const result = await checkSubscriptionAccess(1);

      expect(result.hasAccess).toBe(true);
      expect(result.status).toBe("active");
    });
  });

  describe("handlePaymentFailure", () => {
    it("should increment failed payment attempts on first failure", async () => {
      const mockSubscription = {
        id: 1,
        userId: 1,
        status: "active",
        failedPaymentAttempts: 0,
        accessSuspendedAt: null,
      };

      vi.mocked(db.getSubscriptionByStripeId).mockResolvedValue(mockSubscription as any);
      vi.mocked(db.updateSubscription).mockResolvedValue(undefined);

      await handlePaymentFailure(1, "sub_123", "Card declined");

      expect(db.updateSubscription).toHaveBeenCalledWith(1, expect.objectContaining({
        failedPaymentAttempts: 1,
        status: "active", // Still active on first attempt
      }));
    });

    it("should suspend access after 3 failed attempts", async () => {
      const mockSubscription = {
        id: 1,
        userId: 1,
        status: "active",
        failedPaymentAttempts: 3, // Already failed 3 times
        accessSuspendedAt: null,
      };

      vi.mocked(db.getSubscriptionByStripeId).mockResolvedValue(mockSubscription as any);
      vi.mocked(db.updateSubscription).mockResolvedValue(undefined);

      await handlePaymentFailure(1, "sub_123", "Card declined");

      expect(db.updateSubscription).toHaveBeenCalledWith(1, expect.objectContaining({
        failedPaymentAttempts: 4,
        status: "suspended", // Suspended after 4 attempts (> 3)
        accessSuspendedAt: expect.any(Date),
      }));
    });

    it("should calculate correct retry dates with exponential backoff", async () => {
      const mockSubscription = {
        id: 1,
        userId: 1,
        status: "active",
        failedPaymentAttempts: 0,
        accessSuspendedAt: null,
      };

      vi.mocked(db.getSubscriptionByStripeId).mockResolvedValue(mockSubscription as any);
      vi.mocked(db.updateSubscription).mockResolvedValue(undefined);

      const beforeCall = Date.now();
      await handlePaymentFailure(1, "sub_123", "Card declined");
      const afterCall = Date.now();

      const updateCall = vi.mocked(db.updateSubscription).mock.calls[0];
      const nextRetryDate = updateCall[1].nextRetryDate as Date;

      // First retry should be 3 days from now
      const expectedMinTime = beforeCall + 3 * 24 * 60 * 60 * 1000;
      const expectedMaxTime = afterCall + 3 * 24 * 60 * 60 * 1000;

      expect(nextRetryDate.getTime()).toBeGreaterThanOrEqual(expectedMinTime);
      expect(nextRetryDate.getTime()).toBeLessThanOrEqual(expectedMaxTime + 1000); // 1 second buffer
    });
  });

  describe("restoreAccessOnPaymentSuccess", () => {
    it("should reset all payment failure tracking on successful payment", async () => {
      const mockSubscription = {
        id: 1,
        userId: 1,
        status: "suspended",
        failedPaymentAttempts: 3,
        lastFailedPaymentDate: new Date(),
        nextRetryDate: new Date(),
        accessSuspendedAt: new Date(),
        lastPaymentFailureReason: "Card declined",
      };

      vi.mocked(db.getSubscriptionByStripeId).mockResolvedValue(mockSubscription as any);
      vi.mocked(db.updateSubscription).mockResolvedValue(undefined);

      await restoreAccessOnPaymentSuccess(1, "sub_123");

      expect(db.updateSubscription).toHaveBeenCalledWith(1, {
        status: "active",
        failedPaymentAttempts: 0,
        lastFailedPaymentDate: null,
        nextRetryDate: null,
        accessSuspendedAt: null,
        lastPaymentFailureReason: null,
      });
    });
  });

  describe("getRetryAttemptDetails", () => {
    it("should calculate correct retry attempt details", () => {
      const mockSubscription = {
        failedPaymentAttempts: 1,
        nextRetryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        lastPaymentFailureReason: "Card declined",
      };

      const details = getRetryAttemptDetails(mockSubscription);

      expect(details.attempts).toBe(1);
      expect(details.maxAttempts).toBe(3);
      expect(details.remaining).toBe(2);
      expect(details.isMaxed).toBe(false);
    });

    it("should indicate when max attempts reached", () => {
      const mockSubscription = {
        failedPaymentAttempts: 3,
        nextRetryDate: null,
        lastPaymentFailureReason: "Card declined",
      };

      const details = getRetryAttemptDetails(mockSubscription);

      expect(details.attempts).toBe(3);
      expect(details.remaining).toBe(0);
      expect(details.isMaxed).toBe(true);
    });

    it("should handle undefined failedPaymentAttempts", () => {
      const mockSubscription = {
        failedPaymentAttempts: undefined,
        nextRetryDate: null,
        lastPaymentFailureReason: null,
      };

      const details = getRetryAttemptDetails(mockSubscription);

      expect(details.attempts).toBe(0);
      expect(details.remaining).toBe(3);
      expect(details.isMaxed).toBe(false);
    });
  });

  describe("Payment failure workflow", () => {
    it("should complete full payment failure and recovery cycle", async () => {
      // Step 1: First payment fails
      const mockSubscription1 = {
        id: 1,
        userId: 1,
        status: "active",
        failedPaymentAttempts: 0,
        accessSuspendedAt: null,
      };

      vi.mocked(db.getSubscriptionByStripeId).mockResolvedValue(mockSubscription1 as any);
      vi.mocked(db.updateSubscription).mockResolvedValue(undefined);

      await handlePaymentFailure(1, "sub_123", "Card declined");

      expect(db.updateSubscription).toHaveBeenCalledWith(1, expect.objectContaining({
        failedPaymentAttempts: 1,
      }));

      // Step 2: Payment is retried and succeeds
      const mockSubscription2 = {
        id: 1,
        userId: 1,
        status: "active",
        failedPaymentAttempts: 1,
        accessSuspendedAt: null,
      };

      vi.mocked(db.getSubscriptionByStripeId).mockResolvedValue(mockSubscription2 as any);

      await restoreAccessOnPaymentSuccess(1, "sub_123");

      expect(db.updateSubscription).toHaveBeenLastCalledWith(1, {
        status: "active",
        failedPaymentAttempts: 0,
        lastFailedPaymentDate: null,
        nextRetryDate: null,
        accessSuspendedAt: null,
        lastPaymentFailureReason: null,
      });
    });
  });
});
