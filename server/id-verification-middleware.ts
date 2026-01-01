import { TRPCError } from '@trpc/server';
import { getDb } from './db';
import { courseEnrollments, idSubmissions } from '../drizzle/schema';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * Check if user has completed ID verification or is within the 7-day grace period
 * Returns true if user can access course content, false if access should be blocked
 */
export async function checkIdVerificationDeadline(
  userId: number,
  courseId: number
): Promise<{
  canAccess: boolean;
  reason?: string;
  daysRemaining?: number;
  deadlineAt?: Date;
}> {
  try {
    const database = await getDb();
    if (!database) {
      throw new Error('Database not available');
    }

    // Get the enrollment record
    const enrollment = await database
      .select()
      .from(courseEnrollments)
      .where(
        and(
          eq(courseEnrollments.userId, userId),
          eq(courseEnrollments.courseId, courseId)
        )
      )
      .limit(1);

    if (enrollment.length === 0) {
      return {
        canAccess: false,
        reason: 'User is not enrolled in this course',
      };
    }

    const enrollmentRecord = enrollment[0];

    // If verification is already completed, allow access
    if (enrollmentRecord.idVerificationCompletedAt) {
      return { canAccess: true };
    }

    // If access has been suspended, deny access
    if (enrollmentRecord.accessSuspendedAt) {
      return {
        canAccess: false,
        reason: 'Your course access has been suspended due to incomplete ID verification. Please complete your ID verification to regain access.',
      };
    }

    // Calculate the 7-day deadline
    const enrolledAt = new Date(enrollmentRecord.enrolledAt);
    const sevenDaysLater = new Date(enrolledAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    // If within 7 days, allow access
    if (now <= sevenDaysLater) {
      const daysRemaining = Math.ceil((sevenDaysLater.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      return {
        canAccess: true,
        daysRemaining,
        deadlineAt: sevenDaysLater,
      };
    }

    // Past 7 days and no verification - deny access
    return {
      canAccess: false,
      reason: 'Your 7-day grace period has ended. You must complete ID verification to continue accessing course materials.',
      deadlineAt: sevenDaysLater,
    };
  } catch (error) {
    console.error('Error checking ID verification deadline:', error);
    // On error, allow access to avoid blocking users
    return { canAccess: true };
  }
}

/**
 * Get all enrollments for a user that are past the deadline without verification
 */
export async function getOverdueEnrollments(userId: number): Promise<
  Array<{
    enrollmentId: number;
    courseId: number;
    enrolledAt: Date;
    deadlineAt: Date;
  }>
> {
  try {
    const database = await getDb();
    if (!database) {
      return [];
    }

    const enrollments = await database
      .select()
      .from(courseEnrollments)
      .where(eq(courseEnrollments.userId, userId));

    const now = new Date();
    const overdue = [];

    for (const enrollment of enrollments) {
      // Skip if already verified
      if (enrollment.idVerificationCompletedAt) continue;

      // Skip if access already suspended
      if (enrollment.accessSuspendedAt) continue;

      const enrolledAt = new Date(enrollment.enrolledAt);
      const deadlineAt = new Date(enrolledAt.getTime() + 7 * 24 * 60 * 60 * 1000);

      // If past deadline, add to overdue list
      if (now > deadlineAt) {
        overdue.push({
          enrollmentId: enrollment.id,
          courseId: enrollment.courseId,
          enrolledAt,
          deadlineAt,
        });
      }
    }

    return overdue;
  } catch (error) {
    console.error('Error getting overdue enrollments:', error);
    return [];
  }
}

/**
 * Suspend access for all overdue enrollments
 * Called by scheduler to enforce deadline
 */
export async function suspendOverdueAccess(userId: number): Promise<number> {
  try {
    const database = await getDb();
    if (!database) {
      return 0;
    }

    const overdue = await getOverdueEnrollments(userId);

    if (overdue.length === 0) {
      return 0;
    }

    let suspendedCount = 0;
    for (const item of overdue) {
      await database
        .update(courseEnrollments)
        .set({
          accessSuspendedAt: new Date(),
        })
        .where(eq(courseEnrollments.id, item.enrollmentId));

      suspendedCount++;
    }

    return suspendedCount;
  } catch (error) {
    console.error('Error suspending overdue access:', error);
    return 0;
  }
}

/**
 * Restore access when ID verification is approved
 */
export async function restoreAccessOnVerification(userId: number): Promise<number> {
  try {
    const database = await getDb();
    if (!database) {
      return 0;
    }

    // Update all enrollments for this user to mark verification as completed
    const result = await database
      .update(courseEnrollments)
      .set({
        idVerificationCompletedAt: new Date(),
        accessSuspendedAt: null, // Clear suspension if it was set
      })
      .where(
        and(
          eq(courseEnrollments.userId, userId),
          // Only update if not already verified
          isNull(courseEnrollments.idVerificationCompletedAt)
        )
      );

    return 1; // Update successful
  } catch (error) {
    console.error('Error restoring access on verification:', error);
    return 0;
  }
}
