import { protectedProcedure, router } from './_core/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import * as db from './db';
import { idSubmissions } from '../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getDb } from './db';

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const idVerificationRouter = router({
  /**
   * Student submits ID document
   */
  submitId: protectedProcedure
    .input(
      z.object({
        fileUrl: z.string().url('Invalid file URL'),
        fileName: z.string().min(1, 'File name is required'),
        fileSize: z.number().positive('File size must be positive'),
        mimeType: z.string().min(1, 'MIME type is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        // Check if user already has a pending submission
        const existingSubmission = await database
          .select()
          .from(idSubmissions)
          .where(
            and(
              eq(idSubmissions.userId, ctx.user.id),
              eq(idSubmissions.status, 'pending')
            )
          )
          .limit(1);

        if (existingSubmission.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You already have a pending ID submission. Please wait for review.',
          });
        }

        // Create new ID submission
        const result = await database.insert(idSubmissions).values({
          userId: ctx.user.id,
          fileUrl: input.fileUrl,
          fileName: input.fileName,
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          status: 'pending',
        });

        return {
          success: true,
          message: 'ID submitted successfully. Our team will review it shortly.',
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('ID submission error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to submit ID',
        });
      }
    }),

  /**
   * Get current user's ID submission status
   */
  getMyStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const database = await getDb();
      if (!database) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      const submission = await database
        .select()
        .from(idSubmissions)
        .where(eq(idSubmissions.userId, ctx.user.id))
        .orderBy(desc(idSubmissions.submittedAt))
        .limit(1);

      if (submission.length === 0) {
        return {
          status: 'not_submitted',
          submission: null,
        };
      }

      const sub = submission[0];
      return {
        status: sub.status,
        submission: {
          id: sub.id,
          status: sub.status,
          fileName: sub.fileName,
          submittedAt: sub.submittedAt,
          reviewedAt: sub.reviewedAt,
          reviewNotes: sub.reviewNotes,
        },
      };
    } catch (error) {
      console.error('Get status error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch submission status',
      });
    }
  }),

  /**
   * Admin: Get all pending ID submissions
   */
  getPendingSubmissions: adminProcedure.query(async ({ ctx }) => {
    try {
      const database = await getDb();
      if (!database) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      const submissions = await database
        .select({
          id: idSubmissions.id,
          userId: idSubmissions.userId,
          fileUrl: idSubmissions.fileUrl,
          fileName: idSubmissions.fileName,
          fileSize: idSubmissions.fileSize,
          mimeType: idSubmissions.mimeType,
          status: idSubmissions.status,
          submittedAt: idSubmissions.submittedAt,
          reviewedAt: idSubmissions.reviewedAt,
        })
        .from(idSubmissions)
        .where(eq(idSubmissions.status, 'pending'))
        .orderBy(idSubmissions.submittedAt);

      // Get user info for each submission
      const submissionsWithUsers = await Promise.all(
        submissions.map(async (sub) => {
          const user = await db.getUserById(sub.userId);
          return {
            ...sub,
            user: {
              id: user?.id,
              name: user?.name,
              email: user?.email,
            },
          };
        })
      );

      return submissionsWithUsers;
    } catch (error) {
      console.error('Get pending submissions error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch pending submissions',
      });
    }
  }),

  /**
   * Admin: Get all ID submissions (with filters)
   */
  getAllSubmissions: adminProcedure
    .input(
      z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        let submissions;

        if (input.status && input.userId) {
          submissions = await database
            .select()
            .from(idSubmissions)
            .where(
              and(
                eq(idSubmissions.status, input.status),
                eq(idSubmissions.userId, input.userId)
              )
            )
            .orderBy(idSubmissions.submittedAt);
        } else if (input.status) {
          submissions = await database
            .select()
            .from(idSubmissions)
            .where(eq(idSubmissions.status, input.status))
            .orderBy(idSubmissions.submittedAt);
        } else if (input.userId) {
          submissions = await database
            .select()
            .from(idSubmissions)
            .where(eq(idSubmissions.userId, input.userId))
            .orderBy(idSubmissions.submittedAt);
        } else {
          submissions = await database
            .select()
            .from(idSubmissions)
            .orderBy(idSubmissions.submittedAt);
        }

        // Get user info for each submission
        const submissionsWithUsers = await Promise.all(
          submissions.map(async (sub) => {
            const user = await db.getUserById(sub.userId);
            return {
              ...sub,
              user: {
                id: user?.id,
                name: user?.name,
                email: user?.email,
              },
            };
          })
        );

        return submissionsWithUsers;
      } catch (error) {
        console.error('Get all submissions error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch submissions',
        });
      }
    }),

  /**
   * Admin: Approve ID submission
   */
  approveSubmission: adminProcedure
    .input(
      z.object({
        submissionId: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        await database
          .update(idSubmissions)
          .set({
            status: 'approved',
            reviewedBy: ctx.user.id,
            reviewNotes: input.notes || null,
            reviewedAt: new Date(),
          })
          .where(eq(idSubmissions.id, input.submissionId));

        // Get the submission to get user info
        const submission = await database
          .select()
          .from(idSubmissions)
          .where(eq(idSubmissions.id, input.submissionId))
          .limit(1);

        if (submission.length > 0) {
          // Send approval email
          const emailNotifications = await import('./email-notifications');
          try {
            await emailNotifications.sendIdApprovalEmail(submission[0].userId);
          } catch (error) {
            console.error('Failed to send approval email:', error);
          }
        }

        return { success: true, message: 'ID submission approved' };
      } catch (error) {
        console.error('Approve submission error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to approve submission',
        });
      }
    }),

  /**
   * Admin: Reject ID submission
   */
  rejectSubmission: adminProcedure
    .input(
      z.object({
        submissionId: z.number(),
        notes: z.string().min(1, 'Rejection reason is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        await database
          .update(idSubmissions)
          .set({
            status: 'rejected',
            reviewedBy: ctx.user.id,
            reviewNotes: input.notes,
            reviewedAt: new Date(),
          })
          .where(eq(idSubmissions.id, input.submissionId));

        // Get the submission to get user info
        const submission = await database
          .select()
          .from(idSubmissions)
          .where(eq(idSubmissions.id, input.submissionId))
          .limit(1);

        if (submission.length > 0) {
          // Send rejection email
          const emailNotifications = await import('./email-notifications');
          try {
            await emailNotifications.sendIdRejectionEmail(
              submission[0].userId,
              input.notes
            );
          } catch (error) {
            console.error('Failed to send rejection email:', error);
            // Don't throw - email failure shouldn't fail the rejection
          }
        }

        return { success: true, message: 'ID submission rejected' };
      } catch (error) {
        console.error('Reject submission error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reject submission',
        });
      }
    }),

  /**
   * Admin: Get submission details
   */
  getSubmissionDetails: adminProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        const submission = await database
          .select()
          .from(idSubmissions)
          .where(eq(idSubmissions.id, input.submissionId))
          .limit(1);

        if (submission.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Submission not found',
          });
        }

        const sub = submission[0];
        const user = await db.getUserById(sub.userId);

        return {
          ...sub,
          user: {
            id: user?.id,
            name: user?.name,
            email: user?.email,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Get submission details error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch submission details',
        });
      }
    }),
});
