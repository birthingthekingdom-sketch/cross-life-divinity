import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { sql } from "drizzle-orm";
import nodemailer from 'nodemailer';
import { getEmailConfig } from "./email";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const adminEmailRouter = router({
  // Get email notification statistics
  getEmailStats: adminProcedure.query(async () => {
    const dbConn = await db.getDb();
    if (!dbConn) throw new Error("Database not available");

    const result: any = await dbConn.execute(
      sql`SELECT 
            status,
            COUNT(*) as count
          FROM email_notifications
          GROUP BY status`
    );

    const rows = Array.isArray(result) ? result : result.rows || [];
    const stats = {
      sent: 0,
      pending: 0,
      failed: 0,
    };

    rows.forEach((row: any) => {
      if (row.status === 'sent') stats.sent = Number(row.count);
      if (row.status === 'pending') stats.pending = Number(row.count);
      if (row.status === 'failed') stats.failed = Number(row.count);
    });

    return stats;
  }),

  // Get email notifications with optional status filter
  getEmailNotifications: adminProcedure
    .input(
      z.object({
        status: z.enum(['sent', 'pending', 'failed']).optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      let query = `SELECT 
          en.*,
          u.email as userEmail,
          u.name as userName
        FROM email_notifications en
        LEFT JOIN users u ON en.userId = u.id`;
      
      if (input.status) {
        query += ` WHERE en.status = '${input.status}'`;
      }
      
      query += ` ORDER BY en.createdAt DESC LIMIT ${input.limit}`;

      const result: any = await dbConn.execute(sql.raw(query));

      return Array.isArray(result) ? result : result.rows || [];
    }),

  // Retry failed email
  retryFailedEmail: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      // Get the notification
      const result: any = await dbConn.execute(
        sql`SELECT en.*, u.email as userEmail
            FROM email_notifications en
            LEFT JOIN users u ON en.userId = u.id
            WHERE en.id = ${input.id} AND en.status = 'failed'`
      );

      const notification = Array.isArray(result) ? result[0] : result.rows?.[0];

      if (!notification) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed email not found' });
      }

      // Try to send the email
      try {
        const emailConfig = getEmailConfig();
        if (!emailConfig) {
          throw new Error("Email not configured");
        }

        const transporter = nodemailer.createTransport({
          host: emailConfig.host,
          port: emailConfig.port,
          secure: emailConfig.secure,
          auth: {
            user: emailConfig.user,
            pass: emailConfig.pass,
          },
        });

        await transporter.sendMail({
          from: emailConfig.user,
          to: notification.userEmail,
          subject: notification.subject,
          html: notification.content,
        });

        // Mark as sent
        await dbConn.execute(
          sql`UPDATE email_notifications 
              SET status = 'sent', sentAt = NOW() 
              WHERE id = ${input.id}`
        );

        return { success: true };
      } catch (error: any) {
        console.error("Failed to retry email:", error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }
    }),
});
