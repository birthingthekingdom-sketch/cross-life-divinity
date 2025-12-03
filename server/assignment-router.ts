import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

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
      return { success: true };
    }),
});
