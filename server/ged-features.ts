import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const gedFeaturesRouter = router({
  // ========== QUIZ SUBMISSION TRACKING ==========
  
  submitQuizAnswers: protectedProcedure
    .input(
      z.object({
        lessonId: z.number(),
        answers: z.array(
          z.object({
            questionId: z.number(),
            userAnswer: z.string(),
            isCorrect: z.boolean(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const score = input.answers.filter((a) => a.isCorrect).length;
      const totalQuestions = input.answers.length;
      const passed = score >= Math.ceil(totalQuestions * 0.7) ? 1 : 0;

      // Create quiz submission
      await db.createQuizSubmission({
        userId: ctx.user.id,
        lessonId: input.lessonId,
        score,
        totalQuestions,
        passed,
      });

      return { score, totalQuestions, passed, percentage: Math.round((score / totalQuestions) * 100) };
    }),

  getQuizHistory: protectedProcedure
    .input(z.object({ lessonId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await db.getQuizSubmissionHistory(ctx.user.id, input.lessonId);
    }),

  getQuizStats: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      const submissions = await db.getUserQuizSubmissions(ctx.user.id);
      const courseSubmissions = submissions.filter((s) => {
        // Filter by course (would need lesson->course mapping)
        return true;
      });

      const totalAttempts = courseSubmissions.length;
      const averageScore =
        totalAttempts > 0
          ? Math.round(
              courseSubmissions.reduce((sum, s) => sum + s.score, 0) / totalAttempts
            )
          : 0;
      const passedCount = courseSubmissions.filter((s) => s.passed).length;

      return {
        totalAttempts,
        averageScore,
        passedCount,
        passRate: totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0,
      };
    }),

  // ========== PRACTICE TESTS ==========

  getPracticeTests: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPracticeTestsByCourseid(input.courseId);
    }),

  getPracticeTestDetails: protectedProcedure
    .input(z.object({ practiceTestId: z.number() }))
    .query(async ({ input }) => {
      const test = await db.getPracticeTestById(input.practiceTestId);
      if (!test) {
        throw new Error("Practice test not found");
      }
      return test;
    }),

  recordPracticeTestAttempt: protectedProcedure
    .input(
      z.object({
        practiceTestId: z.number(),
        score: z.number(),
        totalQuestions: z.number(),
        timeSpent: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const test = await db.getPracticeTestById(input.practiceTestId);
      if (!test) {
        throw new Error("Practice test not found");
      }

      const passed = input.score >= test.passingScore ? 1 : 0;

      // Record the attempt (would need to create a table for this)
      // For now, we'll just return the result
      return {
        score: input.score,
        totalQuestions: input.totalQuestions,
        passed,
        percentage: Math.round((input.score / input.totalQuestions) * 100),
        timeSpent: input.timeSpent,
      };
    }),

  // ========== GED CERTIFICATES ==========

  generateCertificate: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const certificateNumber = `GED-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;
      const verificationCode = Math.random().toString(36).substr(2, 20).toUpperCase();

      // Generate certificate (would need to create a table for this)
      return {
        certificateNumber,
        verificationCode,
        issuedAt: new Date(),
      };
    }),

  getUserCertificates: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserGedCertificates(ctx.user.id);
  }),

  verifyCertificate: publicProcedure
    .input(z.object({ verificationCode: z.string() }))
    .query(async ({ input }) => {
      return await db.verifyCertificate(input.verificationCode);
    }),

  downloadCertificatePdf: protectedProcedure
    .input(z.object({ certificateId: z.number() }))
    .query(async ({ ctx, input }) => {
      // This would generate a PDF certificate
      // For now, return a placeholder
      return {
        url: `/certificates/${input.certificateId}.pdf`,
        fileName: `GED-Certificate-${input.certificateId}.pdf`,
      };
    }),
});
