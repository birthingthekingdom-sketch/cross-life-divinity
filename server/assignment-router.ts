import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { sendAssignmentGradedEmail, sendPeerReviewAssignedEmail, sendPeerFeedbackReceivedEmail, sendAssignmentResubmittedEmail } from "./email-assignments";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const assignmentRouter = router({
  submit: protectedProcedure
    .input(z.object({
      lessonId: z.number(),
      fileUrl: z.string(),
      fileName: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const submissionId = await db.createAssignmentSubmission({
        userId: ctx.user.id,
        lessonId: input.lessonId,
        fileUrl: input.fileUrl,
        fileName: input.fileName,
        notes: input.notes,
      });
      return { success: true, submissionId };
    }),
  
  getMySubmissions: protectedProcedure
    .input(z.object({ lessonId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      return db.getAssignmentSubmissionsByUser(ctx.user.id, input.lessonId);
    }),
  
  getAllSubmissions: adminProcedure
    .input(z.object({
      lessonId: z.number().optional(),
      courseId: z.number().optional(),
      status: z.enum(['submitted', 'graded', 'returned']).optional(),
    }))
    .query(async ({ input }) => {
      return db.getAllAssignmentSubmissions(input);
    }),
  
  grade: adminProcedure
    .input(z.object({
      submissionId: z.number(),
      grade: z.number().min(0).max(100),
      feedback: z.string(),
      rubricScores: z.record(z.string(), z.number()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.gradeAssignment({
        submissionId: input.submissionId,
        grade: input.grade,
        feedback: input.feedback,
        rubricScores: input.rubricScores,
        gradedBy: ctx.user.id,
      });
      
      // Send email notification to student
      try {
        const submission = await db.getAssignmentSubmissionById(input.submissionId);
        if (submission) {
          const student = await db.getUserById(submission.userId);
          const lesson = await db.getLessonById(submission.lessonId);
          const course = lesson ? await db.getCourseById(lesson.courseId) : null;
          
          if (student && student.email && lesson && course) {
            await sendAssignmentGradedEmail(
              student.email,
              student.name || 'Student',
              course.title,
              lesson.title,
              input.grade,
              input.feedback
            );
          }
        }
      } catch (error) {
        console.error('[Assignment] Failed to send grade notification email:', error);
      }
      
      return { success: true };
    }),
  
  // Peer Review procedures
  assignPeerReviews: adminProcedure
    .input(z.object({
      lessonId: z.number(),
      submissionIds: z.array(z.number()),
    }))
    .mutation(async ({ input }) => {
      const assignments = await db.assignPeerReviews(input.lessonId, input.submissionIds);
      
      // Send email notifications to students assigned peer reviews
      try {
        const lesson = await db.getLessonById(input.lessonId);
        const course = lesson ? await db.getCourseById(lesson.courseId) : null;
        
        if (lesson && course) {
          for (const assignment of assignments) {
            const reviewer = await db.getUserById(assignment.reviewerId);
            if (reviewer && reviewer.email) {
              await sendPeerReviewAssignedEmail(
                reviewer.email,
                reviewer.name || 'Student',
                course.title,
                lesson.title
              );
            }
          }
        }
      } catch (error) {
        console.error('[Assignment] Failed to send peer review assignment emails:', error);
      }
      
      return { success: true, assignments };
    }),
  
  getMyPeerReviews: protectedProcedure
    .query(async ({ ctx }) => {
      return db.getPeerReviewsForStudent(ctx.user.id);
    }),
  
  getPeerReviewsForSubmission: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify the user owns this submission
      const submissions = await db.getAssignmentSubmissionsByUser(ctx.user.id);
      const ownsSubmission = submissions.some(s => s.submission.id === input.submissionId);
      
      if (!ownsSubmission) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only view reviews for your own submissions' });
      }
      
      return db.getPeerReviewsForSubmission(input.submissionId);
    }),
  
  submitPeerReview: protectedProcedure
    .input(z.object({
      peerReviewId: z.number(),
      strengthsComment: z.string().min(50),
      improvementComment: z.string().min(50),
      theologicalDepthRating: z.number().min(1).max(5),
      contentQualityRating: z.number().min(1).max(5),
      writingQualityRating: z.number().min(1).max(5),
      overallComment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify this peer review is assigned to the current user
      const reviews = await db.getPeerReviewsForStudent(ctx.user.id);
      const assignedReview = reviews.find(r => r.review.id === input.peerReviewId);
      
      if (!assignedReview) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'This peer review is not assigned to you' });
      }
      
      if (assignedReview.review.status === 'completed') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'This peer review has already been completed' });
      }
      
      await db.submitPeerReviewFeedback(input);
      
      // Send email notification to submission owner about feedback received
      try {
        const submission = await db.getAssignmentSubmissionById(assignedReview.submission.id);
        if (submission) {
          const student = await db.getUserById(submission.userId);
          const lesson = await db.getLessonById(submission.lessonId);
          const course = lesson ? await db.getCourseById(lesson.courseId) : null;
          
          // Calculate average rating
          const avgRating = (
            input.theologicalDepthRating +
            input.contentQualityRating +
            input.writingQualityRating
          ) / 3;
          
          if (student && student.email && lesson && course) {
            await sendPeerFeedbackReceivedEmail(
              student.email,
              student.name || 'Student',
              course.title,
              lesson.title,
              avgRating
            );
          }
        }
      } catch (error) {
        console.error('[Assignment] Failed to send peer feedback notification email:', error);
      }
      
      return { success: true };
    }),
  
  // Assignment Resubmission procedures
  resubmit: protectedProcedure
    .input(z.object({
      submissionId: z.number(),
      fileUrl: z.string(),
      fileName: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user owns this submission
      const submissions = await db.getAssignmentSubmissionsByUser(ctx.user.id);
      const ownsSubmission = submissions.some(s => s.submission.id === input.submissionId);
      
      if (!ownsSubmission) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only resubmit your own assignments' });
      }
      
      const result = await db.createAssignmentVersion(input);
      return { success: true, ...result };
    }),
  
  getVersions: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Verify the user owns this submission
      const submissions = await db.getAssignmentSubmissionsByUser(ctx.user.id);
      const ownsSubmission = submissions.some(s => s.submission.id === input.submissionId);
      
      if (!ownsSubmission) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only view versions of your own assignments' });
      }
      
      return db.getAssignmentVersions(input.submissionId);
    }),
  
  // Calendar view procedure
  getCalendarAssignments: protectedProcedure
    .query(async ({ ctx }) => {
      return db.getCalendarAssignments(ctx.user.id);
    }),
});
