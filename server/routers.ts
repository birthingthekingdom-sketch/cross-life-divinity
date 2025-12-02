import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    
    enroll: protectedProcedure
      .input(z.object({ accessCode: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const code = await db.getAccessCodeByCode(input.accessCode);
        
        if (!code || !code.isActive) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid or inactive access code' });
        }
        
        const existing = await db.getUserEnrollment(ctx.user.id);
        if (existing) {
          return { success: true, alreadyEnrolled: true };
        }
        
        await db.createEnrollment({
          userId: ctx.user.id,
          accessCodeId: code.id
        });
        
        return { success: true, alreadyEnrolled: false };
      }),
    
    checkEnrollment: protectedProcedure.query(async ({ ctx }) => {
      const enrollment = await db.getUserEnrollment(ctx.user.id);
      return { enrolled: !!enrollment };
    }),
  }),

  courses: router({
    list: protectedProcedure.query(async () => {
      return db.getAllCourses();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const course = await db.getCourseById(input.id);
        if (!course) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' });
        }
        return course;
      }),
    
    create: adminProcedure
      .input(z.object({
        code: z.string(),
        title: z.string(),
        description: z.string().optional(),
        colorTheme: z.string(),
        totalLessons: z.number().default(0),
        displayOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await db.createCourse(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        colorTheme: z.string().optional(),
        totalLessons: z.number().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateCourse(id, updates);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCourse(input.id);
        return { success: true };
      }),
  }),

  lessons: router({
    getByCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return db.getLessonsByCourseId(input.courseId);
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const lesson = await db.getLessonById(input.id);
        if (!lesson) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Lesson not found' });
        }
        return lesson;
      }),
    
    create: adminProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string(),
        content: z.string(),
        lessonOrder: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.createLesson(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        lessonOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateLesson(id, updates);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteLesson(input.id);
        return { success: true };
      }),
  }),

  quizzes: router({
    getByLesson: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input }) => {
        return db.getQuizQuestionsByLessonId(input.lessonId);
      }),
    
    submitAnswer: protectedProcedure
      .input(z.object({
        questionId: z.number(),
        answer: z.string(),
        isCorrect: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.saveQuizAnswer({
          userId: ctx.user.id,
          questionId: input.questionId,
          answer: input.answer,
          isCorrect: input.isCorrect,
        });
        return { success: true };
      }),
    
    create: adminProcedure
      .input(z.object({
        lessonId: z.number(),
        question: z.string(),
        questionType: z.enum(['multiple_choice', 'true_false', 'short_answer']),
        options: z.string().optional(),
        correctAnswer: z.string(),
        questionOrder: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.createQuizQuestion(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        question: z.string().optional(),
        questionType: z.enum(['multiple_choice', 'true_false', 'short_answer']).optional(),
        options: z.string().optional(),
        correctAnswer: z.string().optional(),
        questionOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateQuizQuestion(id, updates);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteQuizQuestion(input.id);
        return { success: true };
      }),
  }),

  progress: router({
    getByCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getUserProgress(ctx.user.id, input.courseId);
      }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getAllUserProgress(ctx.user.id);
    }),
    
    markComplete: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        lessonId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.markLessonComplete(ctx.user.id, input.courseId, input.lessonId);
        return { success: true };
      }),
  }),

  admin: router({
    getAccessCodes: adminProcedure.query(async () => {
      return db.getAllAccessCodes();
    }),
    
    createAccessCode: adminProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ input }) => {
        await db.createAccessCode({ code: input.code, isActive: true });
        return { success: true };
      }),
    
    toggleAccessCode: adminProcedure
      .input(z.object({ id: z.number(), isActive: z.boolean() }))
      .mutation(async ({ input }) => {
        await db.updateAccessCode(input.id, input.isActive);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
