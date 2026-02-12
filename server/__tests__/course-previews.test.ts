import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as previewsDb from '../course-previews';
import { getDb } from '../db';
import { coursePreviews, previewQuizAttempts } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Course Previews Database Functions', () => {
  let db: any;
  let testCourseId = 1; // Assuming course 1 exists
  let testLessonId = 1; // Assuming lesson 1 exists
  let testUserId = 1; // Assuming user 1 exists
  let testPreviewId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error('Database not available');
  });

  afterAll(async () => {
    // Cleanup: delete test data
    if (testPreviewId) {
      await db.delete(previewQuizAttempts).where(eq(previewQuizAttempts.courseId, testCourseId));
      await db.delete(coursePreviews).where(eq(coursePreviews.id, testPreviewId));
    }
  });

  describe('upsertCoursePreview', () => {
    it('should create a new course preview', async () => {
      const previewData = {
        courseId: testCourseId,
        previewLessonId: testLessonId,
        studyGuideUrl: 'https://example.com/study-guide.pdf',
        isActive: true,
      };

      const preview = await previewsDb.upsertCoursePreview(previewData);
      
      expect(preview).toBeDefined();
      expect(preview?.courseId).toBe(testCourseId);
      expect(preview?.previewLessonId).toBe(testLessonId);
      expect(preview?.isActive).toBe(true);
      
      if (preview) testPreviewId = preview.id;
    });

    it('should update existing course preview', async () => {
      if (!testPreviewId) {
        throw new Error('No test preview ID available');
      }

      const updatedData = {
        courseId: testCourseId,
        previewLessonId: testLessonId,
        studyGuideUrl: 'https://example.com/updated-study-guide.pdf',
        isActive: true,
      };

      const preview = await previewsDb.upsertCoursePreview(updatedData);
      
      expect(preview).toBeDefined();
      expect(preview?.studyGuideUrl).toBe('https://example.com/updated-study-guide.pdf');
    });
  });

  describe('getCoursePreview', () => {
    it('should retrieve course preview by course ID', async () => {
      const preview = await previewsDb.getCoursePreview(testCourseId);
      
      expect(preview).toBeDefined();
      expect(preview?.courseId).toBe(testCourseId);
    });

    it('should return null for non-existent preview', async () => {
      const preview = await previewsDb.getCoursePreview(99999);
      expect(preview).toBeNull();
    });
  });

  describe('getAllCoursePreviews', () => {
    it('should retrieve all active course previews', async () => {
      const previews = await previewsDb.getAllCoursePreviews();
      
      expect(Array.isArray(previews)).toBe(true);
      expect(previews.length).toBeGreaterThan(0);
      previews.forEach(p => {
        expect(p.isActive).toBe(true);
      });
    });
  });

  describe('recordPreviewQuizAttempt', () => {
    it('should record a preview quiz attempt', async () => {
      const attemptData = {
        userId: testUserId,
        courseId: testCourseId,
        lessonId: testLessonId,
        score: 8,
        totalQuestions: 10,
      };

      const attempt = await previewsDb.recordPreviewQuizAttempt(attemptData);
      
      expect(attempt).toBeDefined();
      expect(attempt?.userId).toBe(testUserId);
      expect(attempt?.courseId).toBe(testCourseId);
      expect(attempt?.score).toBe(8);
      expect(attempt?.totalQuestions).toBe(10);
    });
  });

  describe('getUserPreviewQuizAttempts', () => {
    it('should retrieve user quiz attempts for a course', async () => {
      const attempts = await previewsDb.getUserPreviewQuizAttempts(testUserId, testCourseId);
      
      expect(Array.isArray(attempts)).toBe(true);
      expect(attempts.length).toBeGreaterThan(0);
      attempts.forEach(a => {
        expect(a.userId).toBe(testUserId);
        expect(a.courseId).toBe(testCourseId);
      });
    });

    it('should return empty array for user with no attempts', async () => {
      const attempts = await previewsDb.getUserPreviewQuizAttempts(99999, testCourseId);
      
      expect(Array.isArray(attempts)).toBe(true);
      expect(attempts.length).toBe(0);
    });
  });

  describe('getBestPreviewQuizScore', () => {
    it('should return best quiz score for user', async () => {
      // Record multiple attempts
      await previewsDb.recordPreviewQuizAttempt({
        userId: testUserId,
        courseId: testCourseId,
        lessonId: testLessonId,
        score: 7,
        totalQuestions: 10,
      });

      await previewsDb.recordPreviewQuizAttempt({
        userId: testUserId,
        courseId: testCourseId,
        lessonId: testLessonId,
        score: 9,
        totalQuestions: 10,
      });

      const best = await previewsDb.getBestPreviewQuizScore(testUserId, testCourseId);
      
      expect(best).toBeDefined();
      expect(best?.score).toBe(9); // Should be the highest score
      expect(best?.percentage).toBe(90);
    });

    it('should return null if user has no attempts', async () => {
      const best = await previewsDb.getBestPreviewQuizScore(99999, testCourseId);
      expect(best).toBeNull();
    });
  });

  describe('updateCoursePreviewStudyGuide', () => {
    it('should update study guide URL', async () => {
      const newUrl = 'https://example.com/new-study-guide.pdf';
      const preview = await previewsDb.updateCoursePreviewStudyGuide(testCourseId, newUrl);
      
      expect(preview).toBeDefined();
      expect(preview?.studyGuideUrl).toBe(newUrl);
    });
  });

  describe('deactivateCoursePreview', () => {
    it('should deactivate course preview', async () => {
      await previewsDb.deactivateCoursePreview(testCourseId);
      
      const preview = await previewsDb.getCoursePreview(testCourseId);
      expect(preview?.isActive).toBe(false);
    });
  });

  describe('getCoursePreviewStats', () => {
    it('should calculate preview statistics', async () => {
      // Reactivate preview for stats calculation
      if (testPreviewId) {
        await db.update(coursePreviews)
          .set({ isActive: true })
          .where(eq(coursePreviews.id, testPreviewId));
      }

      const stats = await previewsDb.getCoursePreviewStats(testCourseId);
      
      expect(stats).toBeDefined();
      expect(stats.totalAttempts).toBeGreaterThanOrEqual(0);
      expect(stats.uniqueUsers).toBeGreaterThanOrEqual(0);
      expect(stats.averageScore).toBeGreaterThanOrEqual(0);
      expect(stats.passRate).toBeGreaterThanOrEqual(0);
      expect(stats.passRate).toBeLessThanOrEqual(100);
    });

    it('should return zero stats for course with no attempts', async () => {
      const stats = await previewsDb.getCoursePreviewStats(99999);
      
      expect(stats).toBeDefined();
      expect(stats.totalAttempts).toBe(0);
      expect(stats.uniqueUsers).toBe(0);
      expect(stats.averageScore).toBe(0);
      expect(stats.passRate).toBe(0);
    });
  });
});
