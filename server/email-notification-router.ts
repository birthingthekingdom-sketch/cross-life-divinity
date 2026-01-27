import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import * as emailNotifications from "./email-notifications";

export const emailNotificationRouter = router({
  // Get user email preferences
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    return emailNotifications.getUserEmailPreferences(ctx.user.id);
  }),

  // Update user email preferences
  updatePreferences: protectedProcedure
    .input(
      z.object({
        enrollmentEmails: z.boolean().optional(),
        lessonCompletionEmails: z.boolean().optional(),
        certificateEmails: z.boolean().optional(),
        assignmentDeadlineEmails: z.boolean().optional(),
        progressSummaryEmails: z.boolean().optional(),
        forumReplyEmails: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await emailNotifications.updateEmailPreferences(ctx.user.id, input);
      return { success: true };
    }),
});
