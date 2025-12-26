import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import * as email from "./email";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const idSubmissionRouter = router({
  /**
   * Submit ID document for verification
   */
  submitId: protectedProcedure
    .input(z.object({
      idType: z.enum(["drivers_license", "state_id", "passport"]),
      documentUrl: z.string().url(),
      fileName: z.string(),
      fileSize: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user already has a pending submission
        const existing = await db.getLatestIdSubmissionByUserId(ctx.user.id);
        if (existing && existing.status === "pending") {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You already have a pending ID submission. Please wait for admin review.'
          });
        }

        // Create new submission
        const submission = await db.createIdSubmission({
          userId: ctx.user.id,
          idType: input.idType,
          documentUrl: input.documentUrl,
          fileName: input.fileName,
          fileSize: input.fileSize,
          status: "pending"
        });

        if (!submission) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create submission'
          });
        }

        // Get user for email
        const user = await db.getUserById(ctx.user.id);
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found'
          });
        }

        // Send notification email to admins
        try {
          await email.sendIdSubmissionNotification(user, submission);
        } catch (emailError) {
          console.error("Failed to send ID submission notification email:", emailError);
          // Don't fail the mutation if email fails
        }

        return {
          success: true,
          submission
        };
      } catch (error) {
        console.error("Error submitting ID:", error);
        throw error;
      }
    }),

  /**
   * Get latest ID submission for current user
   */
  getMyLatestSubmission: protectedProcedure.query(async ({ ctx }) => {
    return await db.getLatestIdSubmissionByUserId(ctx.user.id);
  }),

  /**
   * Get all ID submissions for current user
   */
  getMySubmissions: protectedProcedure.query(async ({ ctx }) => {
    return await db.getIdSubmissionsByUserId(ctx.user.id);
  }),

  /**
   * Get pending ID submissions (admin only)
   */
  getPendingSubmissions: adminProcedure.query(async () => {
    return await db.getPendingIdSubmissions();
  }),

  /**
   * Get all ID submissions (admin only)
   */
  getAllSubmissions: adminProcedure.query(async () => {
    return await db.getAllIdSubmissions();
  }),

  /**
   * Get ID submission by ID (admin only)
   */
  getSubmissionById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const submission = await db.getIdSubmissionById(input.id);
      if (!submission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Submission not found'
        });
      }
      return submission;
    }),

  /**
   * Approve ID submission (admin only)
   */
  approveSubmission: adminProcedure
    .input(z.object({
      id: z.number(),
      verificationNotes: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const submission = await db.getIdSubmissionById(input.id);
      if (!submission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Submission not found'
        });
      }

      const updated = await db.updateIdSubmissionStatus(
        input.id,
        "approved",
        ctx.user.id,
        input.verificationNotes
      );

      if (!updated) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to approve submission'
        });
      }

      // Send approval email to student
      try {
        const student = await db.getUserById(submission.userId);
        if (student) {
          await email.sendIdApprovalNotification(student);
        }
      } catch (emailError) {
        console.error("Failed to send approval notification:", emailError);
      }

      return { success: true, submission: updated };
    }),

  /**
   * Reject ID submission (admin only)
   */
  rejectSubmission: adminProcedure
    .input(z.object({
      id: z.number(),
      rejectionReason: z.string(),
      verificationNotes: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const submission = await db.getIdSubmissionById(input.id);
      if (!submission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Submission not found'
        });
      }

      const updated = await db.updateIdSubmissionStatus(
        input.id,
        "rejected",
        ctx.user.id,
        input.verificationNotes,
        input.rejectionReason
      );

      if (!updated) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reject submission'
        });
      }

      // Send rejection email to student
      try {
        const student = await db.getUserById(submission.userId);
        if (student) {
          await email.sendIdRejectionNotification(student, input.rejectionReason);
        }
      } catch (emailError) {
        console.error("Failed to send rejection notification:", emailError);
      }

      return { success: true, submission: updated };
    }),

  /**
   * Request resubmission (admin only)
   */
  requestResubmission: adminProcedure
    .input(z.object({
      id: z.number(),
      rejectionReason: z.string(),
      verificationNotes: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const submission = await db.getIdSubmissionById(input.id);
      if (!submission) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Submission not found'
        });
      }

      const updated = await db.updateIdSubmissionStatus(
        input.id,
        "resubmit_requested",
        ctx.user.id,
        input.verificationNotes,
        input.rejectionReason
      );

      if (!updated) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to request resubmission'
        });
      }

      // Send resubmission request email to student
      try {
        const student = await db.getUserById(submission.userId);
        if (student) {
          await email.sendIdResubmissionRequestNotification(student, input.rejectionReason);
        }
      } catch (emailError) {
        console.error("Failed to send resubmission request:", emailError);
      }

      return { success: true, submission: updated };
    })
});
