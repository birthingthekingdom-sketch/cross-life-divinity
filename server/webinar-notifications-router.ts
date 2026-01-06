import { z } from "zod";
import { getDb } from "./db";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  webinars,
  webinarRegistrations,
  users,
} from "../drizzle/schema";
// import { webinarNotifications } from "../drizzle/schema"; // TODO: webinarNotifications table not yet implemented
import { eq, and } from "drizzle-orm";
import * as email from "./email";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const webinarNotificationsRouter = router({
  /**
   * Schedule 24-hour reminder emails for a webinar
   */
  scheduleReminders: adminProcedure
    .input(z.object({ webinarId: z.number() }))
    .mutation(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      // Get webinar details
      const webinar = await database
        .select()
        .from(webinars)
        .where(eq(webinars.id, input.webinarId));

      if (!webinar || webinar.length === 0) {
        throw new Error("Webinar not found");
      }

      // Get all registrations
      const registrations = await database
        .select({
          userId: webinarRegistrations.userId,
          userEmail: users.email,
          userName: users.name,
        })
        .from(webinarRegistrations)
        .leftJoin(users, eq(webinarRegistrations.userId, users.id))
        .where(eq(webinarRegistrations.webinarId, input.webinarId));

      let successCount = 0;
      let failureCount = 0;

      for (const registration of registrations) {
        try {
          // Create notification record
          await database.insert(webinarNotifications).values({
            webinarId: input.webinarId,
            userId: registration.userId,
            notificationType: "reminder_24h",
            status: "pending",
          });

          // Send email
          if (registration.userEmail) {
            const scheduledTime = new Date(webinar[0].scheduledAt).toLocaleString();
            await email.sendEmail({
              to: registration.userEmail,
              subject: `Reminder: ${webinar[0].title} starts in 24 hours`,
              html: `
                <h2>Webinar Reminder</h2>
                <p>Hi ${registration.userName || "Student"},</p>
                <p>This is a reminder that <strong>${webinar[0].title}</strong> starts in 24 hours!</p>
                <p><strong>When:</strong> ${scheduledTime}</p>
                <p><strong>Meeting Link:</strong> <a href="${webinar[0].meetingUrl}">${webinar[0].meetingUrl}</a></p>
                <p>We look forward to seeing you there!</p>
              `,
            });

            // Update notification status
            await database
              .update(webinarNotifications)
              .set({ status: "sent", sentAt: new Date() })
              .where(
                and(
                  eq(webinarNotifications.webinarId, input.webinarId),
                  eq(webinarNotifications.userId, registration.userId),
                  eq(webinarNotifications.notificationType, "reminder_24h")
                )
              );

            successCount++;
          }
        } catch (error) {
          failureCount++;
          console.error(`Failed to send reminder to ${registration.userEmail}:`, error);

          // Update notification status
          await database
            .update(webinarNotifications)
            .set({
              status: "failed",
              failureReason: String(error),
            })
            .where(
              and(
                eq(webinarNotifications.webinarId, input.webinarId),
                eq(webinarNotifications.userId, registration.userId),
                eq(webinarNotifications.notificationType, "reminder_24h")
              )
            );
        }
      }

      return {
        success: true,
        successCount,
        failureCount,
        totalAttempts: registrations.length,
      };
    }),

  /**
   * Send recording available notifications
   */
  sendRecordingNotifications: adminProcedure
    .input(
      z.object({
        webinarId: z.number(),
        recordingUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      // Get webinar details
      const webinar = await database
        .select()
        .from(webinars)
        .where(eq(webinars.id, input.webinarId));

      if (!webinar || webinar.length === 0) {
        throw new Error("Webinar not found");
      }

      // Get all registrations
      const registrations = await database
        .select({
          userId: webinarRegistrations.userId,
          userEmail: users.email,
          userName: users.name,
        })
        .from(webinarRegistrations)
        .leftJoin(users, eq(webinarRegistrations.userId, users.id))
        .where(eq(webinarRegistrations.webinarId, input.webinarId));

      let successCount = 0;
      let failureCount = 0;

      for (const registration of registrations) {
        try {
          // Create notification record
          await database.insert(webinarNotifications).values({
            webinarId: input.webinarId,
            userId: registration.userId,
            notificationType: "recording_available",
            status: "pending",
          });

          // Send email
          if (registration.userEmail) {
            await email.sendEmail({
              to: registration.userEmail,
              subject: `Recording Available: ${webinar[0].title}`,
              html: `
                <h2>Webinar Recording Available</h2>
                <p>Hi ${registration.userName || "Student"},</p>
                <p>The recording for <strong>${webinar[0].title}</strong> is now available!</p>
                <p><strong>Watch the recording:</strong> <a href="${input.recordingUrl}">Click here to view</a></p>
                <p>You can watch this recording at your own pace. Thank you for your interest!</p>
              `,
            });

            // Update notification status
            await database
              .update(webinarNotifications)
              .set({ status: "sent", sentAt: new Date() })
              .where(
                and(
                  eq(webinarNotifications.webinarId, input.webinarId),
                  eq(webinarNotifications.userId, registration.userId),
                  eq(webinarNotifications.notificationType, "recording_available")
                )
              );

            successCount++;
          }
        } catch (error) {
          failureCount++;
          console.error(`Failed to send recording notification to ${registration.userEmail}:`, error);

          // Update notification status
          await database
            .update(webinarNotifications)
            .set({
              status: "failed",
              failureReason: String(error),
            })
            .where(
              and(
                eq(webinarNotifications.webinarId, input.webinarId),
                eq(webinarNotifications.userId, registration.userId),
                eq(webinarNotifications.notificationType, "recording_available")
              )
            );
        }
      }

      return {
        success: true,
        successCount,
        failureCount,
        totalAttempts: registrations.length,
      };
    }),

  /**
   * Get notification history for a webinar
   */
  getNotificationHistory: adminProcedure
    .input(z.object({ webinarId: z.number() }))
    .query(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const notifications = await database
        .select({
          id: webinarNotifications.id,
          userId: webinarNotifications.userId,
          userName: users.name,
          userEmail: users.email,
          notificationType: webinarNotifications.notificationType,
          status: webinarNotifications.status,
          sentAt: webinarNotifications.sentAt,
          failureReason: webinarNotifications.failureReason,
          createdAt: webinarNotifications.createdAt,
        })
        .from(webinarNotifications)
        .leftJoin(users, eq(webinarNotifications.userId, users.id))
        .where(eq(webinarNotifications.webinarId, input.webinarId));

      return notifications;
    }),

  /**
   * Get notification statistics
   */
  getNotificationStats: adminProcedure
    .input(z.object({ webinarId: z.number() }))
    .query(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const notifications = await database
        .select()
        .from(webinarNotifications)
        .where(eq(webinarNotifications.webinarId, input.webinarId));

      const sent = notifications.filter((n: any) => n.status === "sent").length;
      const failed = notifications.filter((n: any) => n.status === "failed").length;
      const pending = notifications.filter((n: any) => n.status === "pending").length;

      const byType = {
        reminder_24h: notifications.filter((n: any) => n.notificationType === "reminder_24h")
          .length,
        reminder_1h: notifications.filter((n: any) => n.notificationType === "reminder_1h")
          .length,
        recording_available: notifications.filter(
          (n: any) => n.notificationType === "recording_available"
        ).length,
      };

      return {
        total: notifications.length,
        sent,
        failed,
        pending,
        successRate: notifications.length > 0 ? Math.round((sent / notifications.length) * 100) : 0,
        byType,
      };
    }),

  /**
   * Retry failed notifications
   */
  retryFailedNotifications: adminProcedure
    .input(z.object({ webinarId: z.number() }))
    .mutation(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      // Get failed notifications
      const failedNotifications = await database
        .select()
        .from(webinarNotifications)
        .where(
          and(
            eq(webinarNotifications.webinarId, input.webinarId),
            eq(webinarNotifications.status, "failed")
          )
        );

      let successCount = 0;
      let stillFailedCount = 0;

      for (const notification of failedNotifications) {
        try {
          // Get user email
          const user = await database
            .select()
            .from(users)
            .where(eq(users.id, notification.userId));

          if (user.length === 0 || !user[0].email) {
            stillFailedCount++;
            continue;
          }

          // Get webinar details
          const webinar = await database
            .select()
            .from(webinars)
            .where(eq(webinars.id, input.webinarId));

          if (webinar.length === 0) {
            stillFailedCount++;
            continue;
          }

          // Resend email based on notification type
          if (notification.notificationType === "reminder_24h") {
            const scheduledTime = new Date(webinar[0].scheduledAt).toLocaleString();
            await email.sendEmail({
              to: user[0].email,
              subject: `Reminder: ${webinar[0].title} starts in 24 hours`,
              html: `
                <h2>Webinar Reminder</h2>
                <p>Hi ${user[0].name || "Student"},</p>
                <p>This is a reminder that <strong>${webinar[0].title}</strong> starts in 24 hours!</p>
                <p><strong>When:</strong> ${scheduledTime}</p>
                <p><strong>Meeting Link:</strong> <a href="${webinar[0].meetingUrl}">${webinar[0].meetingUrl}</a></p>
                <p>We look forward to seeing you there!</p>
              `,
            });
          }

          // Update notification status
          await database
            .update(webinarNotifications)
            .set({ status: "sent", sentAt: new Date(), failureReason: null })
            .where(eq(webinarNotifications.id, notification.id));

          successCount++;
        } catch (error) {
          stillFailedCount++;
          console.error(`Failed to retry notification ${notification.id}:`, error);
        }
      }

      return {
        success: true,
        retriedCount: failedNotifications.length,
        successCount,
        stillFailedCount,
      };
    }),
});
