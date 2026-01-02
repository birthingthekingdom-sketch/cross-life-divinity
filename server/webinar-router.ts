import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as webinarsDb from "./webinars";
import { TRPCError } from "@trpc/server";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const webinarRouter = router({
  // Public procedures
  listWebinars: publicProcedure
    .input(z.object({
      courseId: z.number().optional(),
      upcomingOnly: z.boolean().default(true),
    }).optional())
    .query(async ({ input }) => {
      try {
        return await webinarsDb.getWebinars({
          courseId: input?.courseId,
          upcomingOnly: input?.upcomingOnly ?? true,
          isActive: true,
        });
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch webinars' });
      }
    }),

  getWebinarById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const webinar = await webinarsDb.getWebinarById(input.id);
        if (!webinar) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Webinar not found' });
        }
        return webinar;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch webinar' });
      }
    }),

  // Protected procedures for enrolled students
  registerForWebinar: protectedProcedure
    .input(z.object({ webinarId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const webinar = await webinarsDb.getWebinarById(input.webinarId);
        if (!webinar) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Webinar not found' });
        }
        
        return await webinarsDb.registerForWebinar(ctx.user.id, input.webinarId);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        if (error instanceof Error && error.message.includes('Already registered')) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already registered for this webinar' });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to register for webinar' });
      }
    }),

  unregisterFromWebinar: protectedProcedure
    .input(z.object({ webinarId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await webinarsDb.unregisterFromWebinar(ctx.user.id, input.webinarId);
        return { success: true };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to unregister from webinar' });
      }
    }),

  getMyWebinars: protectedProcedure
    .input(z.object({
      upcomingOnly: z.boolean().default(true),
    }).optional())
    .query(async ({ ctx, input }) => {
      try {
        return await webinarsDb.getUserWebinars(ctx.user.id, input?.upcomingOnly ?? true);
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch your webinars' });
      }
    }),

  // Admin procedures
  createWebinar: adminProcedure
    .input(z.object({
      courseId: z.number().optional(),
      title: z.string().min(1),
      description: z.string().optional(),
      meetingUrl: z.string().url(),
      scheduledAt: z.date(),
      duration: z.number().default(60),
    }))
    .mutation(async ({ input }) => {
      try {
        return await webinarsDb.createWebinar({
          courseId: input.courseId || null,
          title: input.title,
          description: input.description || null,
          meetingUrl: input.meetingUrl,
          scheduledAt: input.scheduledAt,
          duration: input.duration,
          isActive: true,
        });
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create webinar' });
      }
    }),

  updateWebinar: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      meetingUrl: z.string().url().optional(),
      scheduledAt: z.date().optional(),
      duration: z.number().optional(),
      recordingUrl: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, ...updates } = input;
        const webinar = await webinarsDb.updateWebinar(id, updates);
        if (!webinar) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Webinar not found' });
        }
        return webinar;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update webinar' });
      }
    }),

  deleteWebinar: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await webinarsDb.deleteWebinar(input.id);
        return { success: true };
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete webinar' });
      }
    }),

  getWebinarRegistrations: adminProcedure
    .input(z.object({ webinarId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await webinarsDb.getWebinarRegistrations(input.webinarId);
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch registrations' });
      }
    }),

  markWebinarAttendance: adminProcedure
    .input(z.object({
      registrationId: z.number(),
      attended: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      try {
        const registration = await webinarsDb.markWebinarAttendance(input.registrationId, input.attended);
        if (!registration) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Registration not found' });
        }
        return registration;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to mark attendance' });
      }
    }),

  getAttendanceStats: adminProcedure
    .input(z.object({ webinarId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await webinarsDb.getWebinarAttendanceStats(input.webinarId);
      } catch (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch attendance stats' });
      }
    }),
});
