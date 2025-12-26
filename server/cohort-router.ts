import { router, protectedProcedure, adminProcedure } from './_core/trpc';
import { z } from 'zod';
import * as db from './db';
import { sql } from 'drizzle-orm';

export const cohortRouter = router({
  // Get all active cohort groups
  getActiveCohorts: protectedProcedure
    .query(async () => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('Database not available');
      
      const result: any = await dbConn.execute(
        sql`SELECT cg.*, lp.name as pathName, lp.level as pathLevel,
            (SELECT COUNT(*) FROM cohort_members WHERE cohortId = cg.id AND isActive = true) as memberCount
            FROM cohort_groups cg
            LEFT JOIN learning_paths lp ON cg.learningPathId = lp.id
            WHERE cg.isActive = true
            ORDER BY cg.createdAt DESC`
      );
      return Array.isArray(result) ? result : result.rows || [];
    }),

  // Get user's cohort memberships
  getMyCohorts: protectedProcedure
    .query(async ({ ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('Database not available');
      
      const result: any = await dbConn.execute(
        sql`SELECT cg.*, lp.name as pathName, lp.level as pathLevel,
            cm.joinedAt,
            (SELECT COUNT(*) FROM cohort_members WHERE cohortId = cg.id AND isActive = true) as memberCount
            FROM cohort_members cm
            JOIN cohort_groups cg ON cm.cohortId = cg.id
            LEFT JOIN learning_paths lp ON cg.learningPathId = lp.id
            WHERE cm.userId = ${ctx.user.id} AND cm.isActive = true AND cg.isActive = true
            ORDER BY cm.joinedAt DESC`
      );
      return Array.isArray(result) ? result : result.rows || [];
    }),

  // Get cohort details with members
  getCohortDetails: protectedProcedure
    .input(z.object({ cohortId: z.number() }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('Database not available');
      
      const cohortResult: any = await dbConn.execute(
        sql`SELECT cg.*, lp.name as pathName
            FROM cohort_groups cg
            LEFT JOIN learning_paths lp ON cg.learningPathId = lp.id
            WHERE cg.id = ${input.cohortId}`
      );
      const cohorts = Array.isArray(cohortResult) ? cohortResult : cohortResult.rows || [];
      if (cohorts.length === 0) throw new Error('Cohort not found');
      
      const membersResult: any = await dbConn.execute(
        sql`SELECT cm.*, u.name as userName, u.email
            FROM cohort_members cm
            JOIN users u ON cm.userId = u.id
            WHERE cm.cohortId = ${input.cohortId} AND cm.isActive = true
            ORDER BY cm.joinedAt`
      );
      const members = Array.isArray(membersResult) ? membersResult : membersResult.rows || [];
      
      return {
        ...cohorts[0],
        members
      };
    }),

  // Join a cohort
  joinCohort: protectedProcedure
    .input(z.object({ cohortId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('Database not available');
      
      // Check if cohort is full
      const countResult: any = await dbConn.execute(
        sql`SELECT cg.maxMembers,
            (SELECT COUNT(*) FROM cohort_members WHERE cohortId = ${input.cohortId} AND isActive = true) as currentMembers
            FROM cohort_groups cg
            WHERE cg.id = ${input.cohortId}`
      );
      const counts = Array.isArray(countResult) ? countResult : countResult.rows || [];
      if (counts.length === 0) throw new Error('Cohort not found');
      
      if (counts[0].currentMembers >= counts[0].maxMembers) {
        throw new Error('Cohort is full');
      }
      
      await dbConn.execute(
        sql`INSERT INTO cohort_members (cohortId, userId) 
            VALUES (${input.cohortId}, ${ctx.user.id})
            ON CONFLICT(cohortId, userId) DO UPDATE SET isActive = true`
      );
      
      return { success: true };
    }),

  // Leave a cohort
  leaveCohort: protectedProcedure
    .input(z.object({ cohortId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('Database not available');
      
      await dbConn.execute(
        sql`UPDATE cohort_members 
            SET isActive = false 
            WHERE cohortId = ${input.cohortId} AND userId = ${ctx.user.id}`
      );
      
      return { success: true };
    }),

  // Get cohort messages
  getCohortMessages: protectedProcedure
    .input(z.object({ cohortId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('Database not available');
      
      const result: any = await dbConn.execute(
        sql`SELECT cm.*, u.name as userName
            FROM cohort_messages cm
            JOIN users u ON cm.userId = u.id
            WHERE cm.cohortId = ${input.cohortId}
            ORDER BY cm.createdAt DESC
            LIMIT ${input.limit}`
      );
      return Array.isArray(result) ? result : result.rows || [];
    }),

  // Post a message to cohort
  postMessage: protectedProcedure
    .input(z.object({ 
      cohortId: z.number(),
      message: z.string().min(1).max(1000)
    }))
    .mutation(async ({ input, ctx }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('Database not available');
      
      // Verify user is a member
      const memberCheck: any = await dbConn.execute(
        sql`SELECT id FROM cohort_members 
            WHERE cohortId = ${input.cohortId} AND userId = ${ctx.user.id} AND isActive = true`
      );
      const members = Array.isArray(memberCheck) ? memberCheck : memberCheck.rows || [];
      if (members.length === 0) {
        throw new Error('You must be a member to post messages');
      }
      
      await dbConn.execute(
        sql`INSERT INTO cohort_messages (cohortId, userId, message) 
            VALUES (${input.cohortId}, ${ctx.user.id}, ${input.message})`
      );
      
      return { success: true };
    }),

  // Admin: Create a cohort
  createCohort: adminProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      learningPathId: z.number().optional(),
      maxMembers: z.number().default(20)
    }))
    .mutation(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('Database not available');
      
      await dbConn.execute(
        sql`INSERT INTO cohort_groups (name, description, learningPathId, maxMembers) 
            VALUES (${input.name}, ${input.description || ''}, ${input.learningPathId || null}, ${input.maxMembers})`
      );
      
      return { success: true };
    }),

  // Admin: Update cohort
  updateCohort: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      maxMembers: z.number().optional(),
      isActive: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error('Database not available');
      
      const updates: string[] = [];
      if (input.name !== undefined) updates.push(`name = '${input.name}'`);
      if (input.description !== undefined) updates.push(`description = '${input.description}'`);
      if (input.maxMembers !== undefined) updates.push(`maxMembers = ${input.maxMembers}`);
      if (input.isActive !== undefined) updates.push(`isActive = ${input.isActive ? 1 : 0}`);
      
      if (updates.length > 0) {
        await dbConn.execute(
          sql.raw(`UPDATE cohort_groups SET ${updates.join(', ')} WHERE id = ${input.id}`)
        );
      }
      
      return { success: true };
    }),
});
