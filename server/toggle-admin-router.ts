import { router, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import * as db from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export const toggleAdminRouter = router({
  toggleMyRole: protectedProcedure
    .mutation(async ({ ctx }) => {
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error('Database not available');

      const currentUser = await dbInstance
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!currentUser[0]) throw new Error('User not found');

      const newRole = currentUser[0].role === 'admin' ? 'user' : 'admin';

      await dbInstance
        .update(users)
        .set({ role: newRole })
        .where(eq(users.id, ctx.user.id));

      return {
        success: true,
        newRole,
        message: `Role changed to ${newRole}`,
      };
    }),
});
