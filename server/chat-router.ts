import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as chat from "./chat";
import * as email from "./email";
import { TRPCError } from "@trpc/server";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const chatRouter = router({
  // Public procedures
  createSession: publicProcedure
    .input(z.object({
      visitorName: z.string().optional(),
      visitorEmail: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await chat.createChatSession({
        ...input,
        userId: ctx.user?.id,
      });
    }),

  sendMessage: publicProcedure
    .input(z.object({
      sessionId: z.number(),
      message: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await chat.createChatMessage({
        sessionId: input.sessionId,
        senderId: ctx.user?.id,
        senderType: "visitor",
        message: input.message,
      });

      // Send email notification to support
      try {
        const session = await chat.getChatSession(input.sessionId);
        await email.sendWelcomeEmail(
          'studio6817@yahoo.com',
          'Support Team',
          [
            `New chat message from ${session?.visitorName || 'Visitor'}`,
            `Message: ${input.message}`,
            `Session ID: ${input.sessionId}`,
            `View in admin dashboard: /admin/chat/${input.sessionId}`
          ]
        );
      } catch (err) {
        console.error('Failed to send chat notification email:', err);
      }

      return result;
    }),

  getMessages: publicProcedure
    .input(z.object({
      sessionId: z.number(),
    }))
    .query(async ({ input }) => {
      return await chat.getChatMessages(input.sessionId);
    }),

  // Admin procedures
  getAllSessions: adminProcedure
    .input(z.object({
      status: z.enum(['active', 'closed']).optional(),
    }).optional())
    .query(async ({ input }) => {
      return await chat.getAllChatSessions(input?.status);
    }),

  getSession: adminProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const session = await chat.getChatSession(input.id);
      if (!session) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Chat session not found' });
      }
      return session;
    }),

  sendAdminMessage: adminProcedure
    .input(z.object({
      sessionId: z.number(),
      message: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      return await chat.createChatMessage({
        sessionId: input.sessionId,
        senderId: ctx.user.id,
        senderType: "admin",
        message: input.message,
      });
    }),

  closeSession: adminProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await chat.closeChatSession(input.id);
      return { success: true };
    }),
});
