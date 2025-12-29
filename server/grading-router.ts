import { z } from "zod";
import { router, adminProcedure } from "./_core/trpc";
import * as db from "./db";
import * as emailService from "./email";

export const gradingRouter = router({
  getPendingWrittenAnswers: adminProcedure.query(async () => {
    return db.getPendingWrittenAnswers();
  }),
  
  getPendingWrittenAnswersCount: adminProcedure.query(async () => {
    return db.getPendingWrittenAnswersCount();
  }),
  
  getPendingWrittenAnswersByCourse: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return db.getPendingWrittenAnswersByCourse(input.courseId);
    }),
  
  getPendingWrittenAnswersByStudent: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return db.getPendingWrittenAnswersByStudent(input.userId);
    }),
  
  getWrittenAnswerById: adminProcedure
    .input(z.object({ answerId: z.number() }))
    .query(async ({ input }) => {
      return db.getPendingWrittenAnswerById(input.answerId);
    }),
  
  gradeWrittenAnswer: adminProcedure
    .input(z.object({
      answerId: z.number(),
      score: z.number().min(0).max(100),
      feedback: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const answer = await db.getPendingWrittenAnswerById(input.answerId);
      if (!answer) throw new Error("Answer not found");
      
      // Grade the answer
      await db.gradeWrittenAnswer(
        input.answerId,
        input.score,
        input.feedback,
        ctx.user.id
      );
      
      // Get student info for email notification
      const student = await db.getUserById(answer.userId);
      const course = await db.getCourseById(answer.courseId);
      const lesson = await db.getLessonById(answer.lessonId);
      
      if (student?.email && course && lesson) {
        // Send email notification to student
        await emailService.sendWrittenAnswerGradedNotification(
          student.email,
          student.name || "Student",
          course.title,
          lesson.title,
          input.score,
          input.feedback
        );
      }
      
      return { success: true };
    }),
  
  getGradedAnswersByStudent: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return db.getGradedWrittenAnswersByStudent(input.userId);
    }),
});
