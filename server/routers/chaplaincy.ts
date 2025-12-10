import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import * as email from "../email";
import { chaplaincy_applications, users } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Admin procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const chaplaincy = router({
  /**
   * Submit a new chaplaincy application
   */
  submitApplication: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        address: z.string().min(1),
        dateOfBirth: z.string().min(1),
        currentMinistryRole: z.string().optional(),
        yearsInMinistry: z.number().min(0),
        ordainedStatus: z.enum(["ordained", "licensed", "not_ordained"]),
        denominationAffiliation: z.string().optional(),
        ministryExperienceDescription: z.string().min(1),
        chaplaincy_interest: z.enum(["healthcare", "military", "correctional", "corporate", "educational", "other"]),
        chaplaincy_interest_other: z.string().optional(),
        motivationStatement: z.string().min(1),
        reference1Name: z.string().min(1),
        reference1Email: z.string().email(),
        reference1Phone: z.string().min(1),
        reference1Relationship: z.string().min(1),
        reference2Name: z.string().min(1),
        reference2Email: z.string().email(),
        reference2Phone: z.string().min(1),
        reference2Relationship: z.string().min(1),
        backgroundCheckConsent: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.backgroundCheckConsent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Background check consent is required",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Check if user already has a pending or approved application
      const existingApplications = await db
        .select()
        .from(chaplaincy_applications)
        .where(eq(chaplaincy_applications.userId, ctx.user.id))
        .limit(1);

      if (existingApplications.length > 0) {
        const status = existingApplications[0].status;
        if (status === "pending" || status === "under_review" || status === "approved") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `You already have a ${status} application. Please wait for review.`,
          });
        }
      }

      // Insert new application
      const result = await db.insert(chaplaincy_applications).values({
        userId: ctx.user.id,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        address: input.address,
        dateOfBirth: input.dateOfBirth,
        currentMinistryRole: input.currentMinistryRole || null,
        yearsInMinistry: input.yearsInMinistry,
        ordainedStatus: input.ordainedStatus,
        denominationAffiliation: input.denominationAffiliation || null,
        ministryExperienceDescription: input.ministryExperienceDescription,
        chaplaincy_interest: input.chaplaincy_interest,
        chaplaincy_interest_other: input.chaplaincy_interest_other || null,
        motivationStatement: input.motivationStatement,
        reference1Name: input.reference1Name,
        reference1Email: input.reference1Email,
        reference1Phone: input.reference1Phone,
        reference1Relationship: input.reference1Relationship,
        reference2Name: input.reference2Name,
        reference2Email: input.reference2Email,
        reference2Phone: input.reference2Phone,
        reference2Relationship: input.reference2Relationship,
        backgroundCheckConsent: input.backgroundCheckConsent,
        backgroundCheckCompleted: false,
        status: "pending",
        submittedAt: new Date(),
      });

      // Send confirmation email
      try {
        await email.sendChaplainApplicationReceivedEmail(input.email, input.fullName);
      } catch (error) {
        console.error('[Chaplaincy] Failed to send application received email:', error);
      }

      return { success: true, message: "Application submitted successfully" };
    }),

  /**
   * Get current user's application status
   */
  getMyApplication: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const result = await db
      .select()
      .from(chaplaincy_applications)
      .where(eq(chaplaincy_applications.userId, ctx.user.id))
      .orderBy(desc(chaplaincy_applications.submittedAt))
      .limit(1);

    return result[0] || null;
  }),

  /**
   * Admin: Get all applications with optional status filter
   */
  getAllApplications: adminProcedure
    .input(
      z.object({
        status: z.enum(["pending", "under_review", "approved", "rejected", "all"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      let query = db
        .select({
          id: chaplaincy_applications.id,
          userId: chaplaincy_applications.userId,
          fullName: chaplaincy_applications.fullName,
          email: chaplaincy_applications.email,
          phone: chaplaincy_applications.phone,
          yearsInMinistry: chaplaincy_applications.yearsInMinistry,
          ordainedStatus: chaplaincy_applications.ordainedStatus,
          chaplaincy_interest: chaplaincy_applications.chaplaincy_interest,
          status: chaplaincy_applications.status,
          submittedAt: chaplaincy_applications.submittedAt,
          reviewedAt: chaplaincy_applications.reviewedAt,
          userName: users.name,
          userEmail: users.email,
        })
        .from(chaplaincy_applications)
        .leftJoin(users, eq(chaplaincy_applications.userId, users.id));

      if (input.status && input.status !== "all") {
        query = query.where(eq(chaplaincy_applications.status, input.status)) as any;
      }

      const results = await query.orderBy(desc(chaplaincy_applications.submittedAt));
      return results;
    }),

  /**
   * Admin: Get single application by ID
   */
  getApplicationById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const result = await db
        .select()
        .from(chaplaincy_applications)
        .where(eq(chaplaincy_applications.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      return result[0];
    }),

  /**
   * Admin: Update application status
   */
  updateApplicationStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "under_review", "approved", "rejected"]),
        reviewNotes: z.string().optional(),
        rejectionReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const updateData: any = {
        status: input.status,
        reviewedBy: ctx.user.id,
        reviewedAt: new Date(),
      };

      if (input.reviewNotes) {
        updateData.reviewNotes = input.reviewNotes;
      }

      if (input.rejectionReason) {
        updateData.rejectionReason = input.rejectionReason;
      }

      if (input.status === "approved") {
        updateData.approvedAt = new Date();
      }

      // Get applicant info for email
      const application = await db
        .select()
        .from(chaplaincy_applications)
        .where(eq(chaplaincy_applications.id, input.id))
        .limit(1);

      if (application.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      }

      const applicant = application[0];

      // Update status
      await db
        .update(chaplaincy_applications)
        .set(updateData)
        .where(eq(chaplaincy_applications.id, input.id));

      // Send email notification based on status
      try {
        if (input.status === "under_review") {
          await email.sendChaplainApplicationUnderReviewEmail(applicant.email, applicant.fullName);
        } else if (input.status === "approved") {
          await email.sendChaplainApplicationApprovedEmail(applicant.email, applicant.fullName, input.reviewNotes);
        } else if (input.status === "rejected" && input.rejectionReason) {
          await email.sendChaplainApplicationRejectedEmail(applicant.email, applicant.fullName, input.rejectionReason);
        }
      } catch (error) {
        console.error('[Chaplaincy] Failed to send status update email:', error);
      }

      return { success: true, message: "Application status updated" };
    }),

  /**
   * Check if user has an approved application (used for course enrollment)
   */
  hasApprovedApplication: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const result = await db
      .select()
      .from(chaplaincy_applications)
      .where(
        and(
          eq(chaplaincy_applications.userId, ctx.user.id),
          eq(chaplaincy_applications.status, "approved")
        )
      )
      .limit(1);

    return {
      hasApproved: result.length > 0,
    };
  }),
});
