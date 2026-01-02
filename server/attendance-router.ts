import { z } from "zod";
import { getDb } from "./db";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  webinarAttendance,
  webinars,
  users,
} from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const attendanceRouter = router({
  /**
   * Get all attendance records for a webinar
   */
  getWebinarAttendance: adminProcedure
    .input(z.object({ webinarId: z.number() }))
    .query(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");
      const records = await database
        .select({
          id: webinarAttendance.id,
          webinarId: webinarAttendance.webinarId,
          userId: webinarAttendance.userId,
          userName: users.name,
          userEmail: users.email,
          status: webinarAttendance.status,
          markedAt: webinarAttendance.markedAt,
          markedBy: webinarAttendance.markedBy,
          createdAt: webinarAttendance.createdAt,
        })
        .from(webinarAttendance)
        .leftJoin(users, eq(webinarAttendance.userId, users.id))
        .where(eq(webinarAttendance.webinarId, input.webinarId));

      return records ?? [];
    }),

  /**
   * Mark attendance for a student
   */
  markAttendance: adminProcedure
    .input(
      z.object({
        webinarId: z.number(),
        userId: z.number(),
        status: z.enum(["registered", "attended", "no_show", "excused"]),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");
      const existing = await database
        .select()
        .from(webinarAttendance)
        .where(
          and(
            eq(webinarAttendance.webinarId, input.webinarId),
            eq(webinarAttendance.userId, input.userId)
          )
        );

      if (existing.length > 0) {
        // Update existing record
        await database
          .update(webinarAttendance)
          .set({
            status: input.status,
            markedAt: new Date(),
            markedBy: ctx.user.id,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(webinarAttendance.webinarId, input.webinarId),
              eq(webinarAttendance.userId, input.userId)
            )
          );
      } else {
        // Create new record
        await database.insert(webinarAttendance).values({
          webinarId: input.webinarId,
          userId: input.userId,
          status: input.status,
          markedAt: new Date(),
          markedBy: ctx.user.id,
        });
      }

      return { success: true };
    }),

  /**
   * Get attendance statistics for a webinar
   */
  getAttendanceStats: adminProcedure
    .input(z.object({ webinarId: z.number() }))
    .query(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");
      const records = await database
        .select()
        .from(webinarAttendance)
        .where(eq(webinarAttendance.webinarId, input.webinarId));

      const attended = records.filter((r: any) => r.status === "attended").length;
      const registered = records.filter((r: any) => r.status === "registered").length;
      const noShow = records.filter((r: any) => r.status === "no_show").length;
      const excused = records.filter((r: any) => r.status === "excused").length;

      return {
        total: records.length,
        attended,
        registered,
        noShow,
        excused,
        attendanceRate:
          records.length > 0
            ? Math.round((attended / records.length) * 100)
            : 0,
      };
    }),

  /**
   * Export attendance as CSV
   */
  exportAttendanceCSV: adminProcedure
    .input(z.object({ webinarId: z.number() }))
    .query(async ({ input }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");
      const records = await database
        .select({
          id: webinarAttendance.id,
          userId: webinarAttendance.userId,
          userName: users.name,
          userEmail: users.email,
          status: webinarAttendance.status,
          markedAt: webinarAttendance.markedAt,
          createdAt: webinarAttendance.createdAt,
        })
        .from(webinarAttendance)
        .leftJoin(users, eq(webinarAttendance.userId, users.id))
        .where(eq(webinarAttendance.webinarId, input.webinarId));

      const webinar = await database
        .select()
        .from(webinars)
        .where(eq(webinars.id, input.webinarId));

      // Generate CSV header
      const headers = [
        "Student Name",
        "Email",
        "Status",
        "Marked At",
        "Registration Date",
      ];
      const rows = records.map((r: typeof records[0]) => [
        r.userName || "N/A",
        r.userEmail || "N/A",
        r.status,
        r.markedAt ? new Date(r.markedAt).toLocaleString() : "N/A",
        new Date(r.createdAt).toLocaleString(),
      ]);

      const csv =
        [headers as any, ...rows].map((row: any) => row.map((cell: any) => `"${cell}"`).join(",")).join("\n") +
        "\n";

      return {
        csv,
        filename: `attendance-${webinar[0]?.title?.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`,
      };
    }),

  /**
   * Bulk mark attendance
   */
  bulkMarkAttendance: adminProcedure
    .input(
      z.object({
        webinarId: z.number(),
        attendees: z.array(
          z.object({
            userId: z.number(),
            status: z.enum(["registered", "attended", "no_show", "excused"]),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");
      for (const attendee of input.attendees) {
        const existing = await database
          .select()
          .from(webinarAttendance)
          .where(
            and(
              eq(webinarAttendance.webinarId, input.webinarId),
              eq(webinarAttendance.userId, attendee.userId)
            )
          );

        if (existing.length > 0) {
          await database
            .update(webinarAttendance)
            .set({
              status: attendee.status,
              markedAt: new Date(),
              markedBy: ctx.user.id,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(webinarAttendance.webinarId, input.webinarId),
                eq(webinarAttendance.userId, attendee.userId)
              )
            );
        } else {
          await database.insert(webinarAttendance).values({
            webinarId: input.webinarId,
            userId: attendee.userId,
            status: attendee.status,
            markedAt: new Date(),
            markedBy: ctx.user.id,
          });
        }
      }

      return { success: true, count: input.attendees.length };
    }),
});
