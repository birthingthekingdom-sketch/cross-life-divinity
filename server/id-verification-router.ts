import { protectedProcedure, router } from './_core/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import * as db from './db';
import { idSubmissions, courseEnrollments } from '../drizzle/schema';
import { eq, and, desc, lte, isNull } from 'drizzle-orm';
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
          // Mark verification as completed for all enrollments
          const middleware = await import('./id-verification-middleware');
          try {
            await middleware.restoreAccessOnVerification(submission[0].userId);
          } catch (error) {
            console.error('Failed to restore access on verification:', error);
          }

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

  /**
   * Check if user has passed the 7-day verification deadline
   * Returns deadline info and whether access should be restricted
   */
  checkVerificationDeadline: protectedProcedure
    .input(z.object({ courseId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        // Get user's enrollments
        let enrollments;
        if (input.courseId) {
          enrollments = await database
            .select()
            .from(courseEnrollments)
            .where(
              and(
                eq(courseEnrollments.userId, ctx.user.id),
                eq(courseEnrollments.courseId, input.courseId)
              )
            );
        } else {
          enrollments = await database
            .select()
            .from(courseEnrollments)
            .where(eq(courseEnrollments.userId, ctx.user.id));
        }

        if (enrollments.length === 0) {
          return {
            hasEnrollments: false,
            enrollments: [],
          };
        }

        const now = new Date();
        const enrollmentStatus = enrollments.map((enrollment) => {
          const enrolledAt = new Date(enrollment.enrolledAt);
          const sevenDaysLater = new Date(enrolledAt.getTime() + 7 * 24 * 60 * 60 * 1000);
          const isPastDeadline = now > sevenDaysLater;
          const isVerified = enrollment.idVerificationCompletedAt !== null;
          const isAccessSuspended = enrollment.accessSuspendedAt !== null;

          return {
            enrollmentId: enrollment.id,
            courseId: enrollment.courseId,
            enrolledAt,
            deadlineAt: sevenDaysLater,
            isPastDeadline,
            isVerified,
            isAccessSuspended,
            daysRemaining: Math.max(0, Math.ceil((sevenDaysLater.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))),
          };
        });

        return {
          hasEnrollments: true,
          enrollments: enrollmentStatus,
        };
      } catch (error) {
        console.error('Check verification deadline error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check verification deadline',
        });
      }
    }),

  /**
   * Mark ID verification as completed for all enrollments
   * Called when admin approves ID submission
   */
  markVerificationCompleted: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const database = await getDb();
      if (!database) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      // Update all enrollments for this user to mark verification as completed
      await database
        .update(courseEnrollments)
        .set({
          idVerificationCompletedAt: new Date(),
        })
        .where(
          and(
            eq(courseEnrollments.userId, ctx.user.id),
            isNull(courseEnrollments.idVerificationCompletedAt)
          )
        );

      return { success: true, message: 'Verification marked as completed' };
    } catch (error) {
      console.error('Mark verification completed error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to mark verification as completed',
      });
    }
  }),

  /**
   * Get enrollment verification status for a specific course
   */
  getEnrollmentVerificationStatus: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Database not available',
          });
        }

        const enrollment = await database
          .select()
          .from(courseEnrollments)
          .where(
            and(
              eq(courseEnrollments.userId, ctx.user.id),
              eq(courseEnrollments.courseId, input.courseId)
            )
          )
          .limit(1);

        if (enrollment.length === 0) {
          return {
            isEnrolled: false,
            verificationStatus: null,
          };
        }

        const enrollmentRecord = enrollment[0];
        const enrolledAt = new Date(enrollmentRecord.enrolledAt);
        const sevenDaysLater = new Date(enrolledAt.getTime() + 7 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const isPastDeadline = now > sevenDaysLater;
        const isVerified = enrollmentRecord.idVerificationCompletedAt !== null;
        const isAccessSuspended = enrollmentRecord.accessSuspendedAt !== null;

        return {
          isEnrolled: true,
          verificationStatus: {
            enrollmentId: enrollmentRecord.id,
            enrolledAt,
            deadlineAt: sevenDaysLater,
            isPastDeadline,
            isVerified,
            isAccessSuspended,
            daysRemaining: Math.max(0, Math.ceil((sevenDaysLater.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))),
          },
        };
      } catch (error) {
        console.error('Get enrollment verification status error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get enrollment verification status',
        });
      }
    }),
});
