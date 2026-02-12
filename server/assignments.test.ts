import { describe, it, expect, beforeAll } from 'vitest';
import * as db from './db';

describe('Assignment System', () => {
  let testUserId: number;
  let testLessonId: number;
  let testSubmissionId: number;

  beforeAll(async () => {
    // Use existing test data from database
    testUserId = 1; // Assuming admin user exists
    testLessonId = 1; // Assuming first lesson exists
  });

  describe('Assignment Submission', () => {
    it('should create an assignment submission', async () => {
      const submissionId = await db.createAssignmentSubmission({
        userId: testUserId,
        lessonId: testLessonId,
        fileUrl: 'https://example.com/test-assignment.pdf',
        fileName: 'test-assignment.pdf',
        notes: 'This is a test submission',
      });

      expect(submissionId).toBeTypeOf('number');
      expect(submissionId).toBeGreaterThan(0);
      testSubmissionId = submissionId;
    });

    it('should retrieve submissions by user', async () => {
      const submissions = await db.getAssignmentSubmissionsByUser(testUserId);
      
      expect(Array.isArray(submissions)).toBe(true);
      if (submissions.length > 0) {
        expect(submissions[0]).toHaveProperty('submission');
        expect(submissions[0]).toHaveProperty('lesson');
        expect(submissions[0]).toHaveProperty('course');
        expect(submissions[0].submission.userId).toBe(testUserId);
      }
    });

    it('should retrieve submissions by lesson', async () => {
      const submissions = await db.getAssignmentSubmissionsByUser(testUserId, testLessonId);
      
      expect(Array.isArray(submissions)).toBe(true);
      if (submissions.length > 0) {
        expect(submissions[0].submission.lessonId).toBe(testLessonId);
      }
    });

    it('should retrieve all submissions with filters', async () => {
      const allSubmissions = await db.getAllAssignmentSubmissions({});
      expect(Array.isArray(allSubmissions)).toBe(true);

      const pendingSubmissions = await db.getAllAssignmentSubmissions({ 
        status: 'submitted' 
      });
      expect(Array.isArray(pendingSubmissions)).toBe(true);
    });
  });

  describe('Assignment Grading', () => {
    it('should grade an assignment submission', async () => {
      if (!testSubmissionId) {
        // Create a submission if it doesn't exist
        testSubmissionId = await db.createAssignmentSubmission({
          userId: testUserId,
          lessonId: testLessonId,
          fileUrl: 'https://example.com/test-assignment-2.pdf',
          fileName: 'test-assignment-2.pdf',
        });
      }

      await db.gradeAssignment({
        submissionId: testSubmissionId,
        grade: 85,
        feedback: 'Good work! Your theological analysis was thorough.',
        rubricScores: {
          theology: 35,
          content: 35,
          writing: 15,
        },
        gradedBy: testUserId,
      });

      // Verify the grade was created
      const submissions = await db.getAssignmentSubmissionsByUser(testUserId);
      const gradedSubmission = submissions.find(
        s => s.submission.id === testSubmissionId
      );

      expect(gradedSubmission).toBeDefined();
      if (gradedSubmission?.grade) {
        expect(gradedSubmission.grade.grade).toBe(85);
        expect(gradedSubmission.grade.feedback).toContain('Good work');
      }
    });

    it('should update submission status to graded', async () => {
      const submissions = await db.getAssignmentSubmissionsByUser(testUserId);
      const gradedSubmission = submissions.find(
        s => s.submission.id === testSubmissionId
      );

      if (gradedSubmission) {
        expect(gradedSubmission.submission.status).toBe('graded');
      }
    });

    it('should store rubric scores as JSON', async () => {
      const submissions = await db.getAssignmentSubmissionsByUser(testUserId);
      const gradedSubmission = submissions.find(
        s => s.submission.id === testSubmissionId
      );

      if (gradedSubmission?.grade?.rubricScores) {
        const rubricScores = JSON.parse(gradedSubmission.grade.rubricScores);
        expect(rubricScores).toHaveProperty('theology');
        expect(rubricScores).toHaveProperty('content');
        expect(rubricScores).toHaveProperty('writing');
        expect(rubricScores.theology).toBe(35);
        expect(rubricScores.content).toBe(35);
        expect(rubricScores.writing).toBe(15);
      }
    });
  });

  describe('Progress Analytics with Assignments', () => {
    it('should include assignment metrics in progress summary', async () => {
      const progressSummary = await db.getStudentProgressSummary(testUserId);

      expect(progressSummary).toHaveProperty('totalAssignments');
      expect(progressSummary).toHaveProperty('gradedAssignments');
      expect(progressSummary).toHaveProperty('averageAssignmentGrade');
      expect(typeof progressSummary.totalAssignments).toBe('number');
      expect(typeof progressSummary.gradedAssignments).toBe('number');
      expect(typeof progressSummary.averageAssignmentGrade).toBe('number');
    });

    it('should calculate average assignment grade correctly', async () => {
      const progressSummary = await db.getStudentProgressSummary(testUserId);

      if (progressSummary.gradedAssignments > 0) {
        expect(progressSummary.averageAssignmentGrade).toBeGreaterThanOrEqual(0);
        expect(progressSummary.averageAssignmentGrade).toBeLessThanOrEqual(100);
      } else {
        expect(progressSummary.averageAssignmentGrade).toBe(0);
      }
    });

    it('should track pending vs graded assignments', async () => {
      const progressSummary = await db.getStudentProgressSummary(testUserId);

      expect(progressSummary.gradedAssignments).toBeLessThanOrEqual(
        progressSummary.totalAssignments
      );
    });
  });

  describe('Assignment Filtering', () => {
    it('should filter submissions by course', async () => {
      const courseId = 1; // Assuming first course exists
      const submissions = await db.getAllAssignmentSubmissions({ courseId });
      
      expect(Array.isArray(submissions)).toBe(true);
      if (submissions.length > 0) {
        expect(submissions[0].course?.id).toBe(courseId);
      }
    });

    it('should filter submissions by lesson', async () => {
      const submissions = await db.getAllAssignmentSubmissions({ 
        lessonId: testLessonId 
      });
      
      expect(Array.isArray(submissions)).toBe(true);
      if (submissions.length > 0) {
        expect(submissions[0].submission.lessonId).toBe(testLessonId);
      }
    });

    it('should filter submissions by status', async () => {
      const gradedSubmissions = await db.getAllAssignmentSubmissions({ 
        status: 'graded' 
      });
      
      expect(Array.isArray(gradedSubmissions)).toBe(true);
      gradedSubmissions.forEach(sub => {
        expect(sub.submission.status).toBe('graded');
      });
    });
  });

  describe('Data Validation', () => {
    it('should handle missing optional notes', async () => {
      const submissionId = await db.createAssignmentSubmission({
        userId: testUserId,
        lessonId: testLessonId,
        fileUrl: 'https://example.com/no-notes.pdf',
        fileName: 'no-notes.pdf',
        // notes is optional
      });

      expect(submissionId).toBeGreaterThan(0);
    });

    it('should handle submissions without grades', async () => {
      const submissions = await db.getAssignmentSubmissionsByUser(testUserId);
      const ungradedSubmissions = submissions.filter(s => s.grade === null);
      
      expect(Array.isArray(ungradedSubmissions)).toBe(true);
      ungradedSubmissions.forEach(sub => {
        expect(sub.submission.status).toBe('submitted');
      });
    });

    it('should return empty array for user with no submissions', async () => {
      const nonExistentUserId = 999999;
      const submissions = await db.getAssignmentSubmissionsByUser(nonExistentUserId);
      
      expect(Array.isArray(submissions)).toBe(true);
      expect(submissions.length).toBe(0);
    });
  });
});
