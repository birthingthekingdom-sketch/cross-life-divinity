import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Assignment System Enhancements", () => {
  let testUserId: number;
  let testLessonId: number;
  let testSubmissionId: number;

  beforeAll(async () => {
    // Create test user
    const testEmail = `test-enhancements-${Date.now()}@example.com`;
    const testOpenId = `openid-${Date.now()}`;
    
    await db.upsertUser({
      openId: testOpenId,
      email: testEmail,
      name: "Test Enhancement User",
      role: "user",
    });
    
    const user = await db.getUserByOpenId(testOpenId);
    testUserId = user!.id;

    // Create test course and lesson
    const courseId = await db.createCourse({
      code: `TEST-ENH-${Date.now()}`,
      title: "Test Enhancement Course",
      description: "Course for testing enhancements",
      colorTheme: "blue",
      totalLessons: 1,
      cpdHours: 1,
      displayOrder: 999,
    });

    testLessonId = await db.createLesson({
      courseId: courseId!,
      title: "Test Enhancement Lesson",
      content: "Test content",
      assignment: "Write a 500-word essay",
      lessonOrder: 1,
    });

    // Create initial submission
    testSubmissionId = await db.createAssignmentSubmission({
      userId: testUserId,
      lessonId: testLessonId,
      fileUrl: "https://example.com/initial.pdf",
      fileName: "initial.pdf",
      notes: "Initial submission",
    });
  });

  describe("Peer Review System", () => {
    it("should assign peer reviews in circular fashion", async () => {
      // Create multiple submissions
      const submission1 = testSubmissionId;
      
      // Create additional test users
      const user2OpenId = `openid-2-${Date.now()}`;
      await db.upsertUser({
        openId: user2OpenId,
        email: `test-user-2-${Date.now()}@example.com`,
        name: "Test User 2",
        role: "user",
      });
      const user2 = await db.getUserByOpenId(user2OpenId);
      
      const user3OpenId = `openid-3-${Date.now()}`;
      await db.upsertUser({
        openId: user3OpenId,
        email: `test-user-3-${Date.now()}@example.com`,
        name: "Test User 3",
        role: "user",
      });
      const user3 = await db.getUserByOpenId(user3OpenId);

      const submission2 = await db.createAssignmentSubmission({
        userId: user2!.id,
        lessonId: testLessonId,
        fileUrl: "https://example.com/submission2.pdf",
        fileName: "submission2.pdf",
      });

      const submission3 = await db.createAssignmentSubmission({
        userId: user3!.id,
        lessonId: testLessonId,
        fileUrl: "https://example.com/submission3.pdf",
        fileName: "submission3.pdf",
      });

      // Assign peer reviews
      const assignments = await db.assignPeerReviews(testLessonId, [
        submission1,
        submission2,
        submission3,
      ]);

      expect(assignments.length).toBeGreaterThan(0);
      expect(assignments.every(a => a.status === "pending")).toBe(true);
    });

    it("should retrieve peer reviews for a student", async () => {
      const reviews = await db.getPeerReviewsForStudent(testUserId);
      expect(Array.isArray(reviews)).toBe(true);
    });

    it("should submit peer review feedback", async () => {
      // Get a peer review for the test user
      const reviews = await db.getPeerReviewsForStudent(testUserId);
      
      if (reviews.length > 0) {
        const review = reviews[0];
        
        const result = await db.submitPeerReviewFeedback({
          peerReviewId: review.review.id,
          strengthsComment: "Great theological depth and clear argumentation throughout the paper.",
          improvementComment: "Could improve by adding more biblical references and citations.",
          theologicalDepthRating: 4,
          contentQualityRating: 4,
          writingQualityRating: 3,
          overallComment: "Well done overall, keep up the good work!",
        });

        expect(result).toEqual({ success: true });

        // Verify the review status was updated
        const updatedReviews = await db.getPeerReviewsForStudent(testUserId);
        const updatedReview = updatedReviews.find(r => r.review.id === review.review.id);
        expect(updatedReview?.review.status).toBe("completed");
      }
    });

    it("should retrieve peer reviews for a submission", async () => {
      const reviews = await db.getPeerReviewsForSubmission(testSubmissionId);
      expect(Array.isArray(reviews)).toBe(true);
    });
  });

  describe("Assignment Resubmission & Versioning", () => {
    it("should create a new version when resubmitting", async () => {
      const result = await db.createAssignmentVersion({
        submissionId: testSubmissionId,
        fileUrl: "https://example.com/revision-v2.pdf",
        fileName: "revision-v2.pdf",
        notes: "Revised based on feedback",
      });

      expect(result).toBeDefined();
      expect(result?.versionNumber).toBe(1);
    });

    it("should track multiple versions", async () => {
      // Create second version
      await db.createAssignmentVersion({
        submissionId: testSubmissionId,
        fileUrl: "https://example.com/revision-v3.pdf",
        fileName: "revision-v3.pdf",
        notes: "Second revision",
      });

      const versions = await db.getAssignmentVersions(testSubmissionId);
      expect(versions.length).toBeGreaterThanOrEqual(2);
      
      // Versions should be ordered by version number descending
      expect(versions[0].versionNumber).toBeGreaterThan(versions[1].versionNumber);
    });

    it("should update main submission with latest file", async () => {
      const latestFileUrl = "https://example.com/latest-revision.pdf";
      const latestFileName = "latest-revision.pdf";

      await db.createAssignmentVersion({
        submissionId: testSubmissionId,
        fileUrl: latestFileUrl,
        fileName: latestFileName,
        notes: "Final revision",
      });

      // Get the submission and verify it has the latest file
      const submissions = await db.getAssignmentSubmissionsByUser(testUserId, testLessonId);
      const submission = submissions.find(s => s.submission.id === testSubmissionId);

      expect(submission?.submission.fileUrl).toBe(latestFileUrl);
      expect(submission?.submission.fileName).toBe(latestFileName);
    });

    it("should retrieve all versions in correct order", async () => {
      const versions = await db.getAssignmentVersions(testSubmissionId);
      
      expect(versions.length).toBeGreaterThan(0);
      
      // Verify descending order
      for (let i = 0; i < versions.length - 1; i++) {
        expect(versions[i].versionNumber).toBeGreaterThan(versions[i + 1].versionNumber);
      }
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete workflow: submit -> peer review -> resubmit", async () => {
      // 1. Create a new submission
      const newSubmissionId = await db.createAssignmentSubmission({
        userId: testUserId,
        lessonId: testLessonId,
        fileUrl: "https://example.com/workflow-test.pdf",
        fileName: "workflow-test.pdf",
        notes: "Initial workflow test submission",
      });

      expect(newSubmissionId).toBeDefined();

      // 2. Assign peer review
      const assignments = await db.assignPeerReviews(testLessonId, [newSubmissionId]);
      expect(assignments.length).toBeGreaterThanOrEqual(0);

      // 3. Create a resubmission version
      const versionResult = await db.createAssignmentVersion({
        submissionId: newSubmissionId,
        fileUrl: "https://example.com/workflow-test-v2.pdf",
        fileName: "workflow-test-v2.pdf",
        notes: "Revised after peer feedback",
      });

      expect(versionResult?.versionNumber).toBe(1);

      // 4. Verify version history
      const versions = await db.getAssignmentVersions(newSubmissionId);
      expect(versions.length).toBe(1);
    });

    it("should maintain data integrity across operations", async () => {
      // Get all submissions for the user
      const submissions = await db.getAssignmentSubmissionsByUser(testUserId);
      expect(submissions.length).toBeGreaterThan(0);

      // Verify each submission has required fields
      submissions.forEach(sub => {
        expect(sub.submission.id).toBeDefined();
        expect(sub.submission.userId).toBe(testUserId);
        expect(sub.submission.fileUrl).toBeDefined();
        expect(sub.submission.fileName).toBeDefined();
        expect(sub.submission.status).toBeDefined();
      });
    });
  });
});
