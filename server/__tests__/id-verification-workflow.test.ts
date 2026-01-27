import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from '../db';
import { courseEnrollments, idSubmissions, users } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

describe('Simplified ID Verification Workflow (72-hour)', () => {
  let db: any;
  let testUserId: number;
  let testCourseId = 1;
  let testEnrollmentId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Get or create a test user
    const existingUsers = await db
      .select()
      .from(users)
      .limit(1);

    if (existingUsers.length > 0) {
      testUserId = existingUsers[0].id;
    } else {
      throw new Error('No test users available');
    }
  });

  describe('Immediate Course Access on Enrollment', () => {
    it('should create enrollment with immediate access', async () => {
      const result = await db
        .insert(courseEnrollments)
        .values({
          userId: testUserId,
          courseId: testCourseId,
          accessCodeId: 1,
          enrolledAt: new Date(),
          idVerificationCompletedAt: null, // Not verified yet
        });

      expect(result).toBeDefined();
    });

    it('should retrieve enrollment with pending verification status', async () => {
      const enrollments = await db
        .select()
        .from(courseEnrollments)
        .where(
          and(
            eq(courseEnrollments.userId, testUserId),
            eq(courseEnrollments.courseId, testCourseId)
          )
        )
        .limit(1);

      expect(enrollments).toHaveLength(1);
      expect(enrollments[0].idVerificationCompletedAt).toBeNull();
      testEnrollmentId = enrollments[0].id;
    });

    it('should not have deadline fields in enrollment', async () => {
      const enrollment = await db
        .select()
        .from(courseEnrollments)
        .where(eq(courseEnrollments.id, testEnrollmentId))
        .limit(1);

      expect(enrollment[0]).toBeDefined();
      // These fields should not exist in the schema
      expect(enrollment[0].idVerificationDeadlineAt).toBeUndefined();
      expect(enrollment[0].accessSuspendedAt).toBeUndefined();
    });
  });

  describe('ID Verification Status Tracking', () => {
    it('should mark verification as completed', async () => {
      await db
        .update(courseEnrollments)
        .set({
          idVerificationCompletedAt: new Date(),
        })
        .where(eq(courseEnrollments.id, testEnrollmentId));

      const updated = await db
        .select()
        .from(courseEnrollments)
        .where(eq(courseEnrollments.id, testEnrollmentId))
        .limit(1);

      expect(updated[0].idVerificationCompletedAt).not.toBeNull();
    });

    it('should track ID submission status', async () => {
      const result = await db
        .insert(idSubmissions)
        .values({
          userId: testUserId,
          fileUrl: 'https://example.com/id.jpg',
          fileName: 'government_id.jpg',
          fileSize: 2048576,
          mimeType: 'image/jpeg',
          status: 'pending',
          submittedAt: new Date(),
        });

      expect(result).toBeDefined();
    });

    it('should retrieve pending ID submissions', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(
          and(
            eq(idSubmissions.userId, testUserId),
            eq(idSubmissions.status, 'pending')
          )
        );

      expect(submissions.length).toBeGreaterThan(0);
      expect(submissions[0].status).toBe('pending');
    });
  });

  describe('No Deadline Enforcement', () => {
    it('should not enforce 7-day deadline', async () => {
      // Create an old enrollment (more than 7 days old)
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10);

      const result = await db
        .insert(courseEnrollments)
        .values({
          userId: testUserId,
          courseId: 2,
          accessCodeId: 1,
          enrolledAt: oldDate,
          idVerificationCompletedAt: null,
        });

      expect(result).toBeDefined();

      // Verify that old enrollment still exists and is not suspended
      const oldEnrollment = await db
        .select()
        .from(courseEnrollments)
        .where(
          and(
            eq(courseEnrollments.userId, testUserId),
            eq(courseEnrollments.courseId, 2)
          )
        )
        .limit(1);

      expect(oldEnrollment[0]).toBeDefined();
      expect(oldEnrollment[0].idVerificationCompletedAt).toBeNull();
      // accessSuspendedAt should not exist
      expect(oldEnrollment[0].accessSuspendedAt).toBeUndefined();
    });
  });
});
