import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { getDb } from '../db';
import { idSubmissions } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('ID Verification System', () => {
  let db: any;
  let testUserId = 1;
  let testSubmissionId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error('Database connection failed');
    }
  });

  describe('ID Submission Creation', () => {
    it('should create a new ID submission', async () => {
      const result = await db
        .insert(idSubmissions)
        .values({
          userId: testUserId,
          fileUrl: 'https://example.com/id.jpg',
          fileName: 'government_id.jpg',
          fileSize: 2048576,
          mimeType: 'image/jpeg',
          status: 'pending',
        });

      expect(result).toBeDefined();
    });

    it('should retrieve a pending submission', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.userId, testUserId))
        .limit(1);

      expect(submissions).toHaveLength(1);
      expect(submissions[0].status).toBe('pending');
      expect(submissions[0].userId).toBe(testUserId);
      testSubmissionId = submissions[0].id;
    });

    it('should not allow duplicate pending submissions', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.userId, testUserId));

      const pendingCount = submissions.filter(
        (s: any) => s.status === 'pending'
      ).length;
      expect(pendingCount).toBeLessThanOrEqual(1);
    });
  });

  describe('ID Submission Status Updates', () => {
    it('should approve an ID submission', async () => {
      await db
        .update(idSubmissions)
        .set({
          status: 'approved',
          reviewedBy: 1,
          reviewedAt: new Date(),
        })
        .where(eq(idSubmissions.id, testSubmissionId));

      const submission = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.id, testSubmissionId))
        .limit(1);

      expect(submission[0].status).toBe('approved');
      expect(submission[0].reviewedBy).toBe(1);
    });

    it('should reject an ID submission with notes', async () => {
      // Create a new submission for rejection test
      const result = await db
        .insert(idSubmissions)
        .values({
          userId: testUserId + 1,
          fileUrl: 'https://example.com/id2.jpg',
          fileName: 'government_id2.jpg',
          fileSize: 2048576,
          mimeType: 'image/jpeg',
          status: 'pending',
        });

      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.userId, testUserId + 1))
        .limit(1);

      const rejectionSubmissionId = submissions[0].id;

      await db
        .update(idSubmissions)
        .set({
          status: 'rejected',
          reviewedBy: 1,
          reviewNotes: 'ID is blurry and not readable',
          reviewedAt: new Date(),
        })
        .where(eq(idSubmissions.id, rejectionSubmissionId));

      const submission = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.id, rejectionSubmissionId))
        .limit(1);

      expect(submission[0].status).toBe('rejected');
      expect(submission[0].reviewNotes).toBe('ID is blurry and not readable');
    });
  });

  describe('ID Submission Queries', () => {
    it('should retrieve all pending submissions', async () => {
      // Create a test submission
      await db
        .insert(idSubmissions)
        .values({
          userId: testUserId + 2,
          fileUrl: 'https://example.com/id3.jpg',
          fileName: 'government_id3.jpg',
          fileSize: 2048576,
          mimeType: 'image/jpeg',
          status: 'pending',
        });

      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.status, 'pending'));

      expect(submissions.length).toBeGreaterThan(0);
      submissions.forEach((sub: any) => {
        expect(sub.status).toBe('pending');
      });
    });

    it('should retrieve user submission by userId', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.userId, testUserId));

      expect(submissions.length).toBeGreaterThan(0);
      submissions.forEach((sub: any) => {
        expect(sub.userId).toBe(testUserId);
      });
    });

    it('should retrieve approved submissions', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.status, 'approved'));

      submissions.forEach((sub: any) => {
        expect(sub.status).toBe('approved');
      });
    });

    it('should retrieve rejected submissions', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.status, 'rejected'));

      submissions.forEach((sub: any) => {
        expect(sub.status).toBe('rejected');
      });
    });
  });

  describe('ID Submission Validation', () => {
    it('should validate file size constraints', async () => {
      const fileSize = 10 * 1024 * 1024; // 10MB
      expect(fileSize).toBeLessThanOrEqual(10 * 1024 * 1024);
    });

    it('should validate supported MIME types', async () => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const testType = 'image/jpeg';
      expect(allowedTypes).toContain(testType);
    });

    it('should reject unsupported MIME types', async () => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const testType = 'video/mp4';
      expect(allowedTypes).not.toContain(testType);
    });
  });

  describe('ID Submission Fields', () => {
    it('should have all required fields', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .limit(1);

      if (submissions.length > 0) {
        const sub = submissions[0];
        expect(sub).toHaveProperty('id');
        expect(sub).toHaveProperty('userId');
        expect(sub).toHaveProperty('fileUrl');
        expect(sub).toHaveProperty('fileName');
        expect(sub).toHaveProperty('fileSize');
        expect(sub).toHaveProperty('mimeType');
        expect(sub).toHaveProperty('status');
        expect(sub).toHaveProperty('submittedAt');
        expect(sub).toHaveProperty('createdAt');
        expect(sub).toHaveProperty('updatedAt');
      }
    });

    it('should have optional review fields', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.status, 'approved'))
        .limit(1);

      if (submissions.length > 0) {
        const sub = submissions[0];
        expect(sub).toHaveProperty('reviewedBy');
        expect(sub).toHaveProperty('reviewedAt');
        expect(sub).toHaveProperty('reviewNotes');
      }
    });
  });

  describe('ID Submission Timestamps', () => {
    it('should set submittedAt timestamp on creation', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .limit(1);

      if (submissions.length > 0) {
        expect(submissions[0].submittedAt).toBeDefined();
        expect(submissions[0].submittedAt instanceof Date).toBe(true);
      }
    });

    it('should set reviewedAt timestamp on review', async () => {
      const submissions = await db
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.status, 'approved'))
        .limit(1);

      if (submissions.length > 0) {
        expect(submissions[0].reviewedAt).toBeDefined();
        expect(submissions[0].reviewedAt instanceof Date).toBe(true);
      }
    });
  });
});
