import { z } from "zod";
import { getDb } from "./db";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  previewEvents,
  previewConversions,
  courses,
  users,
} from "../drizzle/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const previewAnalyticsRouter = router({
  /**
   * Track a preview event (view, quiz attempt, etc.)
   */
  trackPreviewEvent: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        eventType: z.enum(["view", "quiz_attempt", "lesson_view", "study_guide_download"]),
        duration: z.number().optional(),
        metadata: z.string().optional(),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      await database.insert(previewEvents).values({
        courseId: input.courseId,
        userId: ctx.user?.id || null,
        eventType: input.eventType,
        sessionId: input.sessionId || null,
        duration: input.duration || 0,
        metadata: input.metadata || null,
      });

      return { success: true };
    }),

  /**
   * Track preview to enrollment conversion
   */
  trackConversion: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        previewedAt: z.date(),
        previewDuration: z.number(),
        quizAttempts: z.number(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const conversionDays = Math.floor(
        (new Date().getTime() - input.previewedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      await database.insert(previewConversions).values({
        courseId: input.courseId,
        userId: ctx.user.id,
        previewedAt: input.previewedAt,
        enrolledAt: new Date(),
        previewDuration: input.previewDuration,
        quizAttempts: input.quizAttempts,
        conversionDays,
      });

      return { success: true };
    }),

  /**
   * Get preview analytics for a specific course
   */
  getCoursePreviewAnalytics: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      // Get all preview events for this course
      const events = await database
        .select()
        .from(previewEvents)
        .where(eq(previewEvents.courseId, input.courseId));

      // Get conversion data
      const conversions = await database
        .select()
        .from(previewConversions)
        .where(eq(previewConversions.courseId, input.courseId));

      // Calculate metrics
      const totalViews = events.filter((e: any) => e.eventType === "view").length;
      const quizAttempts = events.filter((e: any) => e.eventType === "quiz_attempt").length;
      const lessonViews = events.filter((e: any) => e.eventType === "lesson_view").length;
      const studyGuideDownloads = events.filter((e: any) => e.eventType === "study_guide_download").length;

      const totalPreviewTime = events.reduce((sum: number, e: any) => sum + (e.duration || 0), 0);
      const avgPreviewTime = totalViews > 0 ? Math.round(totalPreviewTime / totalViews) : 0;

      const conversionRate =
        totalViews > 0 ? Math.round((conversions.length / totalViews) * 100) : 0;

      const avgConversionDays =
        conversions.length > 0
          ? Math.round(
              conversions.reduce((sum: number, c: any) => sum + c.conversionDays, 0) /
                conversions.length
            )
          : 0;

      return {
        courseId: input.courseId,
        totalViews,
        quizAttempts,
        lessonViews,
        studyGuideDownloads,
        totalPreviewTime,
        avgPreviewTime,
        conversions: conversions.length,
        conversionRate,
        avgConversionDays,
        avgQuizAttemptsPerConversion:
          conversions.length > 0
            ? (
                conversions.reduce((sum: number, c: any) => sum + c.quizAttempts, 0) /
                conversions.length
              ).toFixed(1)
            : 0,
      };
    }),

  /**
   * Get preview analytics dashboard (all courses)
   */
  getPreviewAnalyticsDashboard: adminProcedure.query(async () => {
    const database = await getDb();
    if (!database) throw new Error("Database not available");

    const allEvents = await database.select().from(previewEvents);
    const allConversions = await database.select().from(previewConversions);

    // Group by course
    const courseMetrics: Record<number, any> = {};

    for (const event of allEvents) {
      if (!courseMetrics[event.courseId]) {
        courseMetrics[event.courseId] = {
          courseId: event.courseId,
          views: 0,
          quizAttempts: 0,
          lessonViews: 0,
          studyGuideDownloads: 0,
          totalTime: 0,
        };
      }

      if (event.eventType === "view") courseMetrics[event.courseId].views++;
      if (event.eventType === "quiz_attempt") courseMetrics[event.courseId].quizAttempts++;
      if (event.eventType === "lesson_view") courseMetrics[event.courseId].lessonViews++;
      if (event.eventType === "study_guide_download")
        courseMetrics[event.courseId].studyGuideDownloads++;

      courseMetrics[event.courseId].totalTime += event.duration || 0;
    }

    // Add conversion data
    for (const conversion of allConversions) {
      if (!courseMetrics[conversion.courseId]) {
        courseMetrics[conversion.courseId] = {
          courseId: conversion.courseId,
          views: 0,
          quizAttempts: 0,
          lessonViews: 0,
          studyGuideDownloads: 0,
          totalTime: 0,
        };
      }
      if (!courseMetrics[conversion.courseId].conversions) {
        courseMetrics[conversion.courseId].conversions = 0;
      }
      courseMetrics[conversion.courseId].conversions++;
    }

    // Calculate rates
    const dashboard = Object.values(courseMetrics).map((metrics: any) => ({
      ...metrics,
      avgTime: metrics.views > 0 ? Math.round(metrics.totalTime / metrics.views) : 0,
      conversionRate:
        metrics.views > 0 ? Math.round(((metrics.conversions || 0) / metrics.views) * 100) : 0,
    }));

    return {
      totalCourses: dashboard.length,
      totalPreviewEvents: allEvents.length,
      totalConversions: allConversions.length,
      overallConversionRate:
        allEvents.length > 0
          ? Math.round((allConversions.length / allEvents.length) * 100)
          : 0,
      courseMetrics: dashboard.sort((a: any, b: any) => b.views - a.views),
    };
  }),

  /**
   * Get per-lesson preview analytics
   */
  getLessonPreviewAnalytics: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const events = await database
        .select()
        .from(previewEvents)
        .where(
          and(
            eq(previewEvents.courseId, input.courseId),
            eq(previewEvents.eventType, "lesson_view")
          )
        );

      // Parse metadata to get lesson info
      const lessonMetrics: Record<string, any> = {};

      for (const event of events) {
        const metadata = event.metadata ? JSON.parse(event.metadata) : {};
        const lessonId = metadata.lessonId || "unknown";

        if (!lessonMetrics[lessonId]) {
          lessonMetrics[lessonId] = {
            lessonId,
            views: 0,
            totalTime: 0,
          };
        }

        lessonMetrics[lessonId].views++;
        lessonMetrics[lessonId].totalTime += event.duration || 0;
      }

      return Object.values(lessonMetrics)
        .map((metrics: any) => ({
          ...metrics,
          avgTime: metrics.views > 0 ? Math.round(metrics.totalTime / metrics.views) : 0,
        }))
        .sort((a: any, b: any) => b.views - a.views);
    }),

  /**
   * Get conversion funnel data
   */
  getConversionFunnel: adminProcedure.query(async () => {
    const database = await getDb();
    if (!database) throw new Error("Database not available");

    const allEvents = await database.select().from(previewEvents);
    const allConversions = await database.select().from(previewConversions);

    const uniquePreviewers = new Set(allEvents.map((e: any) => e.userId).filter((id: any) => id));
    const uniqueConverters = new Set(allConversions.map((c: any) => c.userId));

    return {
      totalPreviews: allEvents.length,
      uniquePreviews: uniquePreviewers.size,
      totalConversions: allConversions.length,
      conversionRate:
        uniquePreviewers.size > 0
          ? Math.round((uniqueConverters.size / uniquePreviewers.size) * 100)
          : 0,
      eventBreakdown: {
        views: allEvents.filter((e: any) => e.eventType === "view").length,
        quizAttempts: allEvents.filter((e: any) => e.eventType === "quiz_attempt").length,
        lessonViews: allEvents.filter((e: any) => e.eventType === "lesson_view").length,
        studyGuideDownloads: allEvents.filter((e: any) => e.eventType === "study_guide_download")
          .length,
      },
    };
  }),
});
