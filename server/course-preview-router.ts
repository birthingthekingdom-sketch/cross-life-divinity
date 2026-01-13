import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as previewsDb from "./course-previews";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const coursePreviewRouter = router({
  // Public procedures
  getAllPreviews: publicProcedure
    .query(async () => {
      try {
        return await previewsDb.getAllCoursePreviews();
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch course previews' });
      }
    }),

  getPreviewByCourse: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      try {
        const preview = await previewsDb.getCoursePreview(input.courseId);
        if (!preview) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Preview not available for this course' });
        }
        return preview;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch course preview' });
      }
    }),

  // Protected procedures for enrolled students
  recordQuizAttempt: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      lessonId: z.number(),
      score: z.number().min(0),
      totalQuestions: z.number().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify course exists
        const course = await db.getCourseById(input.courseId);
        if (!course) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' });
        }

        // Record the attempt
        const attempt = await previewsDb.recordPreviewQuizAttempt({
          userId: ctx.user.id,
          courseId: input.courseId,
          lessonId: input.lessonId,
          score: input.score,
          totalQuestions: input.totalQuestions,
        });

        return {
          ...attempt,
          percentage: attempt ? (attempt.score / attempt.totalQuestions) * 100 : 0,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to record quiz attempt' });
      }
    }),

  getMyQuizAttempts: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const attempts = await previewsDb.getUserPreviewQuizAttempts(ctx.user.id, input.courseId);
        return attempts.map(a => ({
          ...a,
          percentage: (a.score / a.totalQuestions) * 100,
        }));
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch quiz attempts' });
      }
    }),

  getMyBestScore: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        return await previewsDb.getBestPreviewQuizScore(ctx.user.id, input.courseId);
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch best score' });
      }
    }),

  // Admin procedures
  createPreview: adminProcedure
    .input(z.object({
      courseId: z.number(),
      previewLessonId: z.number(),
      studyGuideUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Verify course exists
        const course = await db.getCourseById(input.courseId);
        if (!course) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' });
        }

        // Verify lesson exists and belongs to course
        const lesson = await db.getLessonById(input.previewLessonId);
        if (!lesson || lesson.courseId !== input.courseId) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Lesson not found in this course' });
        }

        const preview = await previewsDb.upsertCoursePreview({
          courseId: input.courseId,
          previewLessonId: input.previewLessonId,
          studyGuideUrl: input.studyGuideUrl || null,
          isActive: true,
        });

        if (!preview) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create preview' });
        }

        return preview;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create course preview' });
      }
    }),

  updateStudyGuide: adminProcedure
    .input(z.object({
      courseId: z.number(),
      studyGuideUrl: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      try {
        const preview = await previewsDb.updateCoursePreviewStudyGuide(input.courseId, input.studyGuideUrl);
        if (!preview) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Preview not found' });
        }
        return preview;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update study guide' });
      }
    }),

  deactivatePreview: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await previewsDb.deactivateCoursePreview(input.courseId);
        return { success: true };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to deactivate preview' });
      }
    }),

  getPreviewStats: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await previewsDb.getCoursePreviewStats(input.courseId);
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch preview statistics' });
      }
    }),
});
