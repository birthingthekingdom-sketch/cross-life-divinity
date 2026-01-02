import { getDb } from "./db";
import * as email from "./email";
import { webinars, webinarRegistrations, users, webinarNotifications } from "../drizzle/schema";
import { eq, and, lt, gte, lte } from "drizzle-orm";

/**
 * Schedule 24-hour reminder emails for upcoming webinars
 * This should run daily
 */
export async function sendWebinarReminders() {
  const database = await getDb();
  if (!database) {
    console.log("[Webinar Scheduler] Database not available");
    return;
  }

  try {
    // Find webinars scheduled for 24 hours from now (with 1-hour tolerance)
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const upcomingWebinars = await database
      .select()
      .from(webinars)
      .where(
        and(
          gte(webinars.scheduledAt, in24Hours),
          lte(webinars.scheduledAt, in25Hours),
          eq(webinars.isActive, true)
        )
      );

    console.log(`[Webinar Scheduler] Found ${upcomingWebinars.length} webinars for 24-hour reminders`);

    for (const webinar of upcomingWebinars) {
      // Get all registrations for this webinar
      const registrations = await database
        .select({
          userId: webinarRegistrations.userId,
          userEmail: users.email,
          userName: users.name,
        })
        .from(webinarRegistrations)
        .leftJoin(users, eq(webinarRegistrations.userId, users.id))
        .where(eq(webinarRegistrations.webinarId, webinar.id));

      console.log(
        `[Webinar Scheduler] Sending reminders for webinar "${webinar.title}" to ${registrations.length} students`
      );

      for (const registration of registrations) {
        try {
          // Check if reminder already sent
          const existingReminder = await database
            .select()
            .from(webinarNotifications)
            .where(
              and(
                eq(webinarNotifications.webinarId, webinar.id),
                eq(webinarNotifications.userId, registration.userId),
                eq(webinarNotifications.notificationType, "reminder_24h")
              )
            );

          if (existingReminder.length > 0) {
            console.log(
              `[Webinar Scheduler] Reminder already sent for user ${registration.userId} and webinar ${webinar.id}`
            );
            continue;
          }

          // Create notification record
          await database.insert(webinarNotifications).values({
            webinarId: webinar.id,
            userId: registration.userId,
            notificationType: "reminder_24h",
            status: "pending",
          });

          // Send email
          if (registration.userEmail) {
            const scheduledTime = new Date(webinar.scheduledAt).toLocaleString();
            const success = await email.sendEmail({
              to: registration.userEmail,
              subject: `Reminder: ${webinar.title} starts in 24 hours`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #1e40af;">Webinar Reminder</h2>
                  <p>Hi ${registration.userName || "Student"},</p>
                  <p>This is a reminder that <strong>${webinar.title}</strong> starts in 24 hours!</p>
                  
                  <div style="background-color: #f0f9ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>When:</strong> ${scheduledTime}</p>
                    <p><strong>Duration:</strong> ${webinar.duration} minutes</p>
                    ${webinar.description ? `<p><strong>Description:</strong> ${webinar.description}</p>` : ""}
                  </div>
                  
                  <p>
                    <a href="${webinar.meetingUrl}" 
                       style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      Join Webinar
                    </a>
                  </p>
                  
                  <p style="margin-top: 30px; color: #666; font-size: 14px;">
                    We look forward to seeing you there!<br>
                    Cross Life School of Divinity Team
                  </p>
                </div>
              `,
            });

            if (success) {
              // Update notification status
              await database
                .update(webinarNotifications)
                .set({ status: "sent", sentAt: new Date() })
                .where(
                  and(
                    eq(webinarNotifications.webinarId, webinar.id),
                    eq(webinarNotifications.userId, registration.userId),
                    eq(webinarNotifications.notificationType, "reminder_24h")
                  )
                );

              console.log(
                `[Webinar Scheduler] Reminder sent to ${registration.userEmail} for webinar "${webinar.title}"`
              );
            } else {
              // Mark as failed
              await database
                .update(webinarNotifications)
                .set({
                  status: "failed",
                  failureReason: "Email send failed",
                })
                .where(
                  and(
                    eq(webinarNotifications.webinarId, webinar.id),
                    eq(webinarNotifications.userId, registration.userId),
                    eq(webinarNotifications.notificationType, "reminder_24h")
                  )
                );

              console.error(
                `[Webinar Scheduler] Failed to send reminder to ${registration.userEmail}`
              );
            }
          }
        } catch (error) {
          console.error(
            `[Webinar Scheduler] Error processing registration for user ${registration.userId}:`,
            error
          );
        }
      }
    }

    console.log("[Webinar Scheduler] 24-hour reminder job completed");
  } catch (error) {
    console.error("[Webinar Scheduler] Error in sendWebinarReminders:", error);
  }
}

/**
 * Send recording available notifications for completed webinars
 * This should run periodically (e.g., every hour)
 */
export async function sendRecordingNotifications() {
  const database = await getDb();
  if (!database) {
    console.log("[Webinar Scheduler] Database not available");
    return;
  }

  try {
    // Find webinars that have ended and have a recording URL but haven't sent notifications yet
    const now = new Date();

    const completedWebinars = await database
      .select()
      .from(webinars)
      .where(
        and(
          lt(webinars.scheduledAt, now), // Webinar has started
          // recordingUrl is not null - check in application code since SQL can't easily check this
          eq(webinars.isActive, true)
        )
      );

    console.log(
      `[Webinar Scheduler] Found ${completedWebinars.length} completed webinars to check for recordings`
    );

    for (const webinar of completedWebinars) {
      if (!webinar.recordingUrl) continue; // Skip if no recording

      // Get all registrations for this webinar
      const registrations = await database
        .select({
          userId: webinarRegistrations.userId,
          userEmail: users.email,
          userName: users.name,
        })
        .from(webinarRegistrations)
        .leftJoin(users, eq(webinarRegistrations.userId, users.id))
        .where(eq(webinarRegistrations.webinarId, webinar.id));

      console.log(
        `[Webinar Scheduler] Sending recording notifications for webinar "${webinar.title}" to ${registrations.length} students`
      );

      for (const registration of registrations) {
        try {
          // Check if notification already sent
          const existingNotification = await database
            .select()
            .from(webinarNotifications)
            .where(
              and(
                eq(webinarNotifications.webinarId, webinar.id),
                eq(webinarNotifications.userId, registration.userId),
                eq(webinarNotifications.notificationType, "recording_available")
              )
            );

          if (existingNotification.length > 0) {
            continue;
          }

          // Create notification record
          await database.insert(webinarNotifications).values({
            webinarId: webinar.id,
            userId: registration.userId,
            notificationType: "recording_available",
            status: "pending",
          });

          // Send email
          if (registration.userEmail) {
            const success = await email.sendEmail({
              to: registration.userEmail,
              subject: `Recording Available: ${webinar.title}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #1e40af;">Webinar Recording Available</h2>
                  <p>Hi ${registration.userName || "Student"},</p>
                  <p>The recording for <strong>${webinar.title}</strong> is now available!</p>
                  
                  <p>You can watch this recording at your own pace. Click the link below to access it:</p>
                  
                  <p>
                    <a href="${webinar.recordingUrl}" 
                       style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      Watch Recording
                    </a>
                  </p>
                  
                  <p style="margin-top: 30px; color: #666; font-size: 14px;">
                    Thank you for your interest!<br>
                    Cross Life School of Divinity Team
                  </p>
                </div>
              `,
            });

            if (success) {
              // Update notification status
              await database
                .update(webinarNotifications)
                .set({ status: "sent", sentAt: new Date() })
                .where(
                  and(
                    eq(webinarNotifications.webinarId, webinar.id),
                    eq(webinarNotifications.userId, registration.userId),
                    eq(webinarNotifications.notificationType, "recording_available")
                  )
                );

              console.log(
                `[Webinar Scheduler] Recording notification sent to ${registration.userEmail}`
              );
            } else {
              // Mark as failed
              await database
                .update(webinarNotifications)
                .set({
                  status: "failed",
                  failureReason: "Email send failed",
                })
                .where(
                  and(
                    eq(webinarNotifications.webinarId, webinar.id),
                    eq(webinarNotifications.userId, registration.userId),
                    eq(webinarNotifications.notificationType, "recording_available")
                  )
                );

              console.error(
                `[Webinar Scheduler] Failed to send recording notification to ${registration.userEmail}`
              );
            }
          }
        } catch (error) {
          console.error(
            `[Webinar Scheduler] Error processing registration for user ${registration.userId}:`,
            error
          );
        }
      }
    }

    console.log("[Webinar Scheduler] Recording notification job completed");
  } catch (error) {
    console.error("[Webinar Scheduler] Error in sendRecordingNotifications:", error);
  }
}
