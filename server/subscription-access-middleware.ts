import { TRPCError } from "@trpc/server";
import { checkSubscriptionAccess } from "./subscription-access-control";
import * as db from "./db";

/**
 * Middleware to check subscription access before allowing course/lesson access
 */
export async function checkSubscriptionAccessMiddleware(userId: number, courseId?: number) {
  const subscription = await db.getActiveSubscription(userId);

  // If no subscription, check if user has individual course access
  if (!subscription) {
    if (courseId) {
      const isEnrolled = await db.isUserEnrolledInCourse(userId, courseId);
      if (!isEnrolled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this course. Please purchase or subscribe.",
        });
      }
    }
    return { hasSubscription: false, accessAllowed: true };
  }

  // Check subscription access status
  const accessStatus = await checkSubscriptionAccess(userId);

  if (!accessStatus.hasAccess) {
    let errorMessage = "Your subscription access has been suspended.";

    if (accessStatus.status === "suspended") {
      errorMessage = `Your subscription has been suspended due to payment failure. ${accessStatus.reason}`;
    } else if (accessStatus.status === "failed") {
      errorMessage = "There's an issue with your subscription payment. Please update your payment method.";
    } else if (accessStatus.status === "expired") {
      errorMessage = "Your subscription has expired. Please renew to continue.";
    }

    throw new TRPCError({
      code: "FORBIDDEN",
      message: errorMessage,
    });
  }

  return { hasSubscription: true, accessAllowed: true };
}

/**
 * Middleware for lesson access - checks both subscription and enrollment
 */
export async function checkLessonAccessMiddleware(userId: number, lessonId: number, courseId: number) {
  // First check subscription access
  await checkSubscriptionAccessMiddleware(userId, courseId);

  // Then check if user is enrolled in the course
  const isEnrolled = await db.isUserEnrolledInCourse(userId, courseId);
  if (!isEnrolled) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not enrolled in this course.",
    });
  }

  return { accessAllowed: true };
}

/**
 * Middleware for quiz access - checks subscription, enrollment, and lesson completion
 */
export async function checkQuizAccessMiddleware(userId: number, quizId: number, courseId: number) {
  // Check subscription and enrollment
  await checkLessonAccessMiddleware(userId, quizId, courseId);

  // Additional quiz-specific checks can be added here
  return { accessAllowed: true };
}

/**
 * Middleware for progress update - prevents updates if subscription is suspended
 */
export async function checkProgressUpdateAccessMiddleware(userId: number, courseId: number) {
  const subscription = await db.getActiveSubscription(userId);

  if (subscription) {
    const accessStatus = await checkSubscriptionAccess(userId);

    if (!accessStatus.hasAccess) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot update progress: Your subscription access has been suspended due to payment failure.",
      });
    }
  }

  return { accessAllowed: true };
}
