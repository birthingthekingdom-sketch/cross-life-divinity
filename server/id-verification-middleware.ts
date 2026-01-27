import { TRPCError } from '@trpc/server';
import { getDb } from './db';
import { courseEnrollments, idSubmissions } from '../drizzle/schema';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * Check if user is enrolled in a course
 * VERIFICATION DISABLED: All users have immediate access upon enrollment
 * No ID verification is required
 */
export async function checkIdVerificationStatus(
  userId: number,
  courseId: number
): Promise<{
  canAccess: boolean;
  verificationStatus: 'approved' | 'pending';
  reason?: string;
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
        verificationStatus: 'pending',
        reason: 'User is not enrolled in this course',
      };
    }

    const enrollmentRecord = enrollment[0];

    // Check if verification is completed
    const isVerified = enrollmentRecord.idVerificationCompletedAt !== null;

    // VERIFICATION DISABLED: Always allow access regardless of verification status
    return {
      canAccess: true,
      verificationStatus: 'approved', // No verification required
    };
  } catch (error) {
    console.error('Error checking ID verification status:', error);
    // On error, allow access to avoid blocking users
    return { canAccess: true, verificationStatus: 'approved' };
  }
}

/**
 * Get verification status for all user enrollments
 */
export async function getUserVerificationStatus(userId: number): Promise<
  Array<{
    enrollmentId: number;
    courseId: number;
    enrolledAt: Date;
    verificationStatus: 'approved' | 'pending';
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

    return enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      courseId: enrollment.courseId,
      enrolledAt: new Date(enrollment.enrolledAt),
      verificationStatus: enrollment.idVerificationCompletedAt ? 'approved' : 'pending',
    }));
  } catch (error) {
    console.error('Error getting user verification status:', error);
    return [];
  }
}

/**
 * Mark ID verification as completed for a user
 * This updates all pending enrollments for the user
 */
export async function markVerificationCompleted(userId: number): Promise<number> {
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
    console.error('Error marking verification as completed:', error);
    return 0;
  }
}

/**
 * NOTE: The new workflow does NOT enforce deadlines or suspend access
 * Students have immediate access to courses upon enrollment
 * Admin has 72 hours to review ID verification, but no automatic penalties apply
 * If admin finds issues, they contact the student directly via email
 */
