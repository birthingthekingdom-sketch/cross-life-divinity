import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { TRPCError } from "@trpc/server";
import {
  users,
  courses,
} from "../drizzle/schema";
// import { previewTracking, qrCodes, qrCodeScans, emailTemplates } from "../drizzle/schema"; // TODO: tables not yet implemented
import { eq, and } from "drizzle-orm";
import QRCode from "qrcode";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

/**
 * Student Preview Tracking - Track which students have viewed course previews
 */
const logPreviewView = protectedProcedure
  .input(
    z.object({
      courseId: z.number(),
      duration: z.number().default(0),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      // Check if preview tracking record exists
      const existing = await database
        .select()
        .from(previewTracking)
        .where(
          and(
            eq(previewTracking.userId, ctx.user.id),
            eq(previewTracking.courseId, input.courseId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update existing record
        await database
          .update(previewTracking)
          .set({
            duration: (existing[0].duration || 0) + input.duration,
            viewCount: (existing[0].viewCount || 0) + 1,
            lastViewedAt: new Date(),
          })
          .where(eq(previewTracking.id, existing[0].id));

        return { success: true, message: "Preview view updated" };
      } else {
        // Create new record
        await database.insert(previewTracking).values({
          userId: ctx.user.id,
          courseId: input.courseId,
          duration: input.duration,
          viewCount: 1,
          previewedAt: new Date(),
          lastViewedAt: new Date(),
        });

        return { success: true, message: "Preview view logged" };
      }
    } catch (error) {
      console.error("Error logging preview view:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to log preview view",
      });
    }
  });

const getPreviewAnalytics = adminProcedure
  .input(
    z.object({
      courseId: z.number().optional(),
      limit: z.number().default(50),
    })
  )
  .query(async ({ input }) => {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      let whereClause = undefined as any;
      if (input.courseId) {
        whereClause = eq(previewTracking.courseId, input.courseId);
      }

      const results = await database
        .select()
        .from(previewTracking)
        .where(whereClause)
        .limit(input.limit);

      // Enrich with user and course information
      const enriched = await Promise.all(
        results.map(async (record) => {
          const userRecord = await database
            .select()
            .from(users)
            .where(eq(users.id, record.userId))
            .limit(1);

          const courseRecord = await database
            .select()
            .from(courses)
            .where(eq(courses.id, record.courseId))
            .limit(1);

          return {
            ...record,
            userName: userRecord[0]?.name || "Unknown",
            userEmail: userRecord[0]?.email || "Unknown",
            courseName: courseRecord[0]?.title || "Unknown",
          };
        })
      );

      return enriched;
    } catch (error) {
      console.error("Error fetching preview analytics:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch preview analytics",
      });
    }
  });

/**
 * QR Code Generation and Attendance Tracking
 */
const generateQrCode = adminProcedure
  .input(
    z.object({
      courseId: z.number(),
      lessonId: z.number().optional(),
      expiresInMinutes: z.number().default(60),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const code = `QR-${input.courseId}-${Date.now()}`;
      const qrData = JSON.stringify({
        courseId: input.courseId,
        lessonId: input.lessonId,
        code,
        timestamp: Date.now(),
      });

      // Generate QR code image
      const qrImage = await QRCode.toDataURL(qrData);

      // Calculate expiry time
      const expiresAt = new Date(Date.now() + input.expiresInMinutes * 60000);

      // Save to database
      await database.insert(qrCodes).values({
        courseId: input.courseId,
        lessonId: input.lessonId || null,
        code,
        qrData,
        expiresAt,
        isActive: true,
      });

      return {
        success: true,
        qrCode: {
          id: 1,
          code,
          qrImage,
          expiresAt,
        },
      };
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate QR code",
      });
    }
  });

const scanQrCode = protectedProcedure
  .input(z.object({ qrCode: z.string() }))
  .mutation(async ({ ctx, input }) => {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      // Find QR code
      const qrRecord = await database
        .select()
        .from(qrCodes)
        .where(eq(qrCodes.code, input.qrCode))
        .limit(1);

      if (qrRecord.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "QR code not found",
        });
      }

      const qr = qrRecord[0];

      // Check if expired
      if (qr.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "QR code has expired",
        });
      }

      // Check if active
      if (!qr.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "QR code is not active",
        });
      }

      // Record the scan
      await database.insert(qrCodeScans).values({
        qrCodeId: qr.id,
        userId: ctx.user.id,
        scannedAt: new Date(),
        ipAddress: ctx.req.ip || "unknown",
        userAgent: ctx.req.headers["user-agent"] || "unknown",
      });

      return {
        success: true,
        message: "Attendance recorded",
        courseId: qr.courseId,
        lessonId: qr.lessonId,
      };
    } catch (error) {
      console.error("Error scanning QR code:", error);
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to scan QR code",
      });
    }
  });

const getAttendanceReport = adminProcedure
  .input(
    z.object({
      courseId: z.number().optional(),
      lessonId: z.number().optional(),
    })
  )
  .query(async ({ input }) => {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      let query = database.select().from(qrCodeScans);

      if (input.courseId || input.lessonId) {
        // Filter by course or lesson
        const whereCondition = input.courseId
          ? eq(qrCodes.courseId, input.courseId)
          : input.lessonId
            ? eq(qrCodes.lessonId, input.lessonId)
            : undefined;

        if (whereCondition) {
          const qrCodesForFilter = await database
            .select({ id: qrCodes.id })
            .from(qrCodes)
            .where(whereCondition);

          const qrIds = qrCodesForFilter.map((q) => q.id);
          if (qrIds.length > 0) {
            // Filter scans by QR code IDs
            const filteredScans = (await query).filter((scan) =>
              qrIds.includes(scan.qrCodeId)
            );
            return Promise.all(
              filteredScans.map(async (scan) => {
                const userRecord = await database
                  .select()
                  .from(users)
                  .where(eq(users.id, scan.userId))
                  .limit(1);

                return {
                  ...scan,
                  userName: userRecord[0]?.name || "Unknown",
                  userEmail: userRecord[0]?.email || "Unknown",
                };
              })
            );
          }
        }
      }

      const results = await query;

      // Enrich with user information
      const enriched = await Promise.all(
        results.map(async (scan) => {
          const userRecord = await database
            .select()
            .from(users)
            .where(eq(users.id, scan.userId))
            .limit(1);

          return {
            ...scan,
            userName: userRecord[0]?.name || "Unknown",
            userEmail: userRecord[0]?.email || "Unknown",
          };
        })
      );

      return enriched;
    } catch (error) {
      console.error("Error fetching attendance report:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch attendance report",
      });
    }
  });

/**
 * Email Template Customization
 */
const createEmailTemplate = adminProcedure
  .input(
    z.object({
      name: z.string(),
      subject: z.string(),
      body: z.string(),
      templateType: z.enum(["welcome", "reminder", "certificate", "custom"]),
      variables: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      await database.insert(emailTemplates).values({
        name: input.name,
        subject: input.subject,
        body: input.body,
        templateType: input.templateType,
        variables: input.variables ? JSON.stringify(input.variables) : null,
        isActive: true,
        createdBy: ctx.user.id,
      });

      return {
        success: true,
        templateId: 1,
        message: "Email template created",
      };
    } catch (error) {
      console.error("Error creating email template:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create email template",
      });
    }
  });

const updateEmailTemplate = adminProcedure
  .input(
    z.object({
      id: z.number(),
      subject: z.string().optional(),
      body: z.string().optional(),
      variables: z.array(z.string()).optional(),
      isActive: z.boolean().optional(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const updateData: any = {};
      if (input.subject) updateData.subject = input.subject;
      if (input.body) updateData.body = input.body;
      if (input.variables) updateData.variables = JSON.stringify(input.variables);
      if (input.isActive !== undefined) updateData.isActive = input.isActive;
      updateData.updatedAt = new Date();

      await database
        .update(emailTemplates)
        .set(updateData)
        .where(eq(emailTemplates.id, input.id));

      return {
        success: true,
        message: "Email template updated",
      };
    } catch (error) {
      console.error("Error updating email template:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update email template",
      });
    }
  });

const getEmailTemplates = adminProcedure
  .input(
    z.object({
      templateType: z.enum(["welcome", "reminder", "certificate", "custom"]).optional(),
    })
  )
  .query(async ({ input }) => {
    try {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      let whereClause = undefined as any;
      if (input.templateType) {
        whereClause = eq(emailTemplates.templateType, input.templateType);
      }

      const templates = await database
        .select()
        .from(emailTemplates)
        .where(whereClause);

      return templates.map((t: any) => ({
        ...t,
        variables: t.variables ? JSON.parse(t.variables) : [],
      }));
    } catch (error) {
      console.error("Error fetching email templates:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch email templates",
      });
    }
  });

export const advancedAnalyticsRouter = router({
  // Preview Tracking
  logPreviewView,
  getPreviewAnalytics,

  // QR Code Attendance
  generateQrCode,
  scanQrCode,
  getAttendanceReport,

  // Email Templates
  createEmailTemplate,
  updateEmailTemplate,
  getEmailTemplates,
});
