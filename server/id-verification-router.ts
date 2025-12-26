import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "./_core/trpc";
import * as db from "./db";
import { sql } from "drizzle-orm";
import nodemailer from "nodemailer";
import { getEmailConfig } from "./email";

export const idVerificationRouter = router({
  // Submit ID for verification
  submitId: protectedProcedure
    .input(z.object({
      fileUrl: z.string().url(),
      fileKey: z.string(),
      idType: z.enum(["driver_license", "state_id", "passport"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      try {
        // Insert ID submission
        const result = await dbConn.execute(
          sql`INSERT INTO id_submissions (userId, fileUrl, fileKey, idType, status) 
              VALUES (${ctx.user.id}, ${input.fileUrl}, ${input.fileKey}, ${input.idType}, 'pending')`
        );

        // Send notification email to admins
        const emailConfig = getEmailConfig();
        if (emailConfig) {
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
            to: process.env.ADMIN_EMAIL || "admin@crosslifeschoolofdivinity.org",
            subject: "New ID Verification Submission",
            html: `
              <h2>New ID Verification Submission</h2>
              <p><strong>Student:</strong> ${ctx.user.name || ctx.user.email}</p>
              <p><strong>Email:</strong> ${ctx.user.email}</p>
              <p><strong>ID Type:</strong> ${input.idType.replace(/_/g, " ")}</p>
              <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
              <p>Please review this submission in the admin dashboard.</p>
            `,
          });
        }

        return { success: true, message: "ID submitted for verification" };
      } catch (error) {
        console.error("Error submitting ID:", error);
        throw new Error("Failed to submit ID");
      }
    }),

  // Get current user's ID submission status
  getMyStatus: protectedProcedure.query(async ({ ctx }) => {
    const dbConn = await db.getDb();
    if (!dbConn) throw new Error("Database not available");

    try {
      const result = await dbConn.execute(
        sql`SELECT * FROM id_submissions WHERE userId = ${ctx.user.id} ORDER BY submittedAt DESC LIMIT 1`
      );

      const rows = result as any[];
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error fetching ID status:", error);
      return null;
    }
  }),

  // Get all pending ID submissions (admin only)
  getPendingSubmissions: adminProcedure.query(async () => {
    const dbConn = await db.getDb();
    if (!dbConn) throw new Error("Database not available");

    try {
      const result = await dbConn.execute(
        sql`SELECT ids.*, u.name, u.email FROM id_submissions ids
            JOIN users u ON ids.userId = u.id
            WHERE ids.status = 'pending'
            ORDER BY ids.submittedAt ASC`
      );

      return result as any[];
    } catch (error) {
      console.error("Error fetching pending submissions:", error);
      return [];
    }
  }),

  // Approve ID submission (admin only)
  approveSubmission: adminProcedure
    .input(z.object({
      submissionId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      try {
        // Get submission details
        const submission = await dbConn.execute(
          sql`SELECT * FROM id_submissions WHERE id = ${input.submissionId}`
        );

        const rows = submission as any[];
        if (rows.length === 0) throw new Error("Submission not found");

        const sub = rows[0];

        // Update submission status
        await dbConn.execute(
          sql`UPDATE id_submissions 
              SET status = 'approved', reviewedBy = ${ctx.user.id}, reviewedAt = NOW(), notes = ${input.notes || null}
              WHERE id = ${input.submissionId}`
        );

        // Get user email for notification
        const userResult = await dbConn.execute(
          sql`SELECT email, name FROM users WHERE id = ${sub.userId}`
        );

        const userRows = userResult as any[];
        const user = userRows[0];

        // Send approval email to student
        const emailConfig = getEmailConfig();
        if (emailConfig) {
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
            to: user.email,
            subject: "ID Verification Approved",
            html: `
              <h2>ID Verification Approved ✓</h2>
              <p>Hello ${user.name || "Student"},</p>
              <p>Your ID verification has been approved! You can now access all course materials.</p>
              <p><a href="${process.env.VITE_APP_URL || "http://localhost:3000"}/dashboard" style="background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a></p>
              <p>Best regards,<br>Cross Life School of Divinity</p>
            `,
          });
        }

        return { success: true, message: "ID submission approved" };
      } catch (error) {
        console.error("Error approving submission:", error);
        throw new Error("Failed to approve submission");
      }
    }),

  // Reject ID submission (admin only)
  rejectSubmission: adminProcedure
    .input(z.object({
      submissionId: z.number(),
      rejectionReason: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      try {
        // Get submission details
        const submission = await dbConn.execute(
          sql`SELECT * FROM id_submissions WHERE id = ${input.submissionId}`
        );

        const rows = submission as any[];
        if (rows.length === 0) throw new Error("Submission not found");

        const sub = rows[0];

        // Update submission status
        await dbConn.execute(
          sql`UPDATE id_submissions 
              SET status = 'rejected', rejectionReason = ${input.rejectionReason}, reviewedBy = ${ctx.user.id}, reviewedAt = NOW(), notes = ${input.notes || null}
              WHERE id = ${input.submissionId}`
        );

        // Get user email for notification
        const userResult = await dbConn.execute(
          sql`SELECT email, name FROM users WHERE id = ${sub.userId}`
        );

        const userRows = userResult as any[];
        const user = userRows[0];

        // Send rejection email to student
        const emailConfig = getEmailConfig();
        if (emailConfig) {
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
            to: user.email,
            subject: "ID Verification - Resubmission Required",
            html: `
              <h2>ID Verification - Resubmission Required</h2>
              <p>Hello ${user.name || "Student"},</p>
              <p>Unfortunately, your ID submission could not be verified. Please review the reason below and resubmit:</p>
              <p><strong>Reason:</strong> ${input.rejectionReason}</p>
              ${input.notes ? `<p><strong>Notes:</strong> ${input.notes}</p>` : ""}
              <p><a href="${process.env.VITE_APP_URL || "http://localhost:3000"}/student/id-upload" style="background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Resubmit ID</a></p>
              <p>Best regards,<br>Cross Life School of Divinity</p>
            `,
          });
        }

        return { success: true, message: "ID submission rejected" };
      } catch (error) {
        console.error("Error rejecting submission:", error);
        throw new Error("Failed to reject submission");
      }
    }),
});
