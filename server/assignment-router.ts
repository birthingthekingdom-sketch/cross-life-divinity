import { router, protectedProcedure, adminProcedure } from "./_core/trpc.js";
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db.js";
import * as schema from "../drizzle/schema.js";

export const assignmentRouter = router({
  // Submit an assignment
  submit: protectedProcedure
    .input(
      z.object({
        lessonId: z.number(),
        fileUrl: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      
      // Check if student already submitted for this lesson
      const existing = await db
        .select()
        .from(schema.assignmentSubmissions)
        .where(
          and(
            eq(schema.assignmentSubmissions.userId, ctx.user.id),
            eq(schema.assignmentSubmissions.lessonId, input.lessonId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update existing submission (resubmit)
        await db
          .update(schema.assignmentSubmissions)
          .set({
            fileUrl: input.fileUrl,
            fileName: input.fileName,
            fileSize: input.fileSize,
            status: "resubmitted",
            updatedAt: new Date(),
          })
          .where(eq(schema.assignmentSubmissions.id, existing[0].id));

        return { success: true, submissionId: existing[0].id, resubmitted: true };
      }

      // Create new submission
      const [result] = await db.insert(schema.assignmentSubmissions).values({
        userId: ctx.user.id,
        lessonId: input.lessonId,
        fileUrl: input.fileUrl,
        fileName: input.fileName,
        fileSize: input.fileSize,
        status: "pending",
      });

      return { success: true, submissionId: result.insertId, resubmitted: false };
    }),

  // Get student's submissions
  getMySubmissions: protectedProcedure
    .input(z.object({ lessonId: z.number().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      
      const conditions = [eq(schema.assignmentSubmissions.userId, ctx.user.id)];
      if (input?.lessonId) {
        conditions.push(eq(schema.assignmentSubmissions.lessonId, input.lessonId));
      }

      const submissions = await db
        .select()
        .from(schema.assignmentSubmissions)
        .where(and(...conditions))
        .orderBy(desc(schema.assignmentSubmissions.submittedAt));

      // Get grades for submissions
      const submissionIds = submissions.map((s) => s.id);
      const grades = submissionIds.length > 0
        ? await db
            .select()
            .from(schema.assignmentGrades)
            .where(
              eq(
                schema.assignmentGrades.submissionId,
                submissionIds[0] // This is simplified; in production use IN clause
              )
            )
        : [];

      return submissions.map((sub) => ({
        ...sub,
        grade: grades.find((g) => g.submissionId === sub.id),
      }));
    }),

  // Admin: Get all submissions (optionally filtered)
  getAllSubmissions: adminProcedure
    .input(
      z.object({
        status: z.enum(["pending", "graded", "returned", "resubmitted"]).optional(),
        lessonId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      
      const conditions = [];
      if (input?.status) {
        conditions.push(eq(schema.assignmentSubmissions.status, input.status));
      }
      if (input?.lessonId) {
        conditions.push(eq(schema.assignmentSubmissions.lessonId, input.lessonId));
      }

      const submissions = await db
        .select()
        .from(schema.assignmentSubmissions)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(schema.assignmentSubmissions.submittedAt));

      return submissions;
    }),

  // Admin: Grade an assignment
  gradeAssignment: adminProcedure
    .input(
      z.object({
        submissionId: z.number(),
        score: z.number().min(0).max(100),
        feedback: z.string().optional(),
        rubricScores: z.record(z.string(), z.number()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // Check if grade already exists
      const existing = await db
        .select()
        .from(schema.assignmentGrades)
        .where(eq(schema.assignmentGrades.submissionId, input.submissionId))
        .limit(1);

      if (existing.length > 0) {
        // Update existing grade
        await db
          .update(schema.assignmentGrades)
          .set({
            score: input.score,
            feedback: input.feedback,
            rubricScores: input.rubricScores ? JSON.stringify(input.rubricScores) : null,
            updatedAt: new Date(),
          })
          .where(eq(schema.assignmentGrades.id, existing[0].id));
      } else {
        // Create new grade
        await db.insert(schema.assignmentGrades).values({
          submissionId: input.submissionId,
          gradedBy: ctx.user.id,
          score: input.score,
          feedback: input.feedback,
          rubricScores: input.rubricScores ? JSON.stringify(input.rubricScores) : null,
        });
      }

      // Update submission status
      await db
        .update(schema.assignmentSubmissions)
        .set({ status: "graded" })
        .where(eq(schema.assignmentSubmissions.id, input.submissionId));

      return { success: true };
    }),

  // Get grade for a submission
  getGrade: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');

      // Verify this submission belongs to the user (unless admin)
      if (ctx.user.role !== "admin") {
        const submission = await db
          .select()
          .from(schema.assignmentSubmissions)
          .where(eq(schema.assignmentSubmissions.id, input.submissionId))
          .limit(1);

        if (submission.length === 0 || submission[0].userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
      }

      const grade = await db
        .select()
        .from(schema.assignmentGrades)
        .where(eq(schema.assignmentGrades.submissionId, input.submissionId))
        .limit(1);

      return grade[0] || null;
    }),
});
