import { router, publicProcedure, protectedProcedure, adminProcedure } from './_core/trpc.js';
import { z } from 'zod';
import { getDb } from './db.js';
import { affiliates, affiliateReferrals, affiliateCommissions, affiliatePayouts, affiliateClicks, users } from '../drizzle/schema.js';
import { eq, and, gte, desc } from 'drizzle-orm';
import crypto from 'crypto';

// Generate unique affiliate code
function generateAffiliateCode(): string {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

export const affiliateRouter = router({
  // Apply to become an affiliate
  applyForAffiliate: protectedProcedure
    .input(z.object({
      organizationName: z.string(),
      organizationType: z.enum(['church', 'ministry', 'nonprofit', 'individual', 'other']),
      website: z.string().optional(),
      description: z.string(),
      expectedReferrals: z.string(),
      paymentMethod: z.enum(['paypal', 'bank_transfer', 'check']),
      paymentDetails: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      
      // Check if user already has an affiliate account
      const existing = await db.select().from(affiliates)
        .where(eq(affiliates.userId, ctx.user.id))
        .limit(1);
      
      if (existing.length > 0) {
        throw new Error('You already have an affiliate account');
      }

      // Generate unique affiliate code
      let affiliateCode = generateAffiliateCode();
      let codeExists = true;
      
      while (codeExists) {
        const check = await db.select().from(affiliates)
          .where(eq(affiliates.affiliateCode, affiliateCode))
          .limit(1);
        
        if (check.length === 0) {
          codeExists = false;
        } else {
          affiliateCode = generateAffiliateCode();
        }
      }

      // Create affiliate account (pending approval)
      await db.insert(affiliates).values({
        userId: ctx.user.id,
        affiliateCode,
        organizationName: input.organizationName,
        organizationType: input.organizationType,
        website: input.website || null,
        description: input.description,
        expectedReferrals: input.expectedReferrals,
        paymentDetails: input.paymentDetails,
        status: 'pending',
        subscriptionCommissionRate: 25,
        courseCommissionRate: 35,
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0,
        createdAt: new Date(),
      });

      // Fetch the created affiliate
      const result = await db.select().from(affiliates)
        .where(eq(affiliates.affiliateCode, affiliateCode))
        .limit(1);

      return result[0];
    }),

  // Get current user's affiliate status
  getMyAffiliate: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      const result = await db.select().from(affiliates)
        .where(eq(affiliates.userId, ctx.user.id))
        .limit(1);
      
      return result[0] || null;
    }),

  // Get affiliate dashboard stats
  getDashboardStats: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      const affiliateResult = await db.select().from(affiliates)
        .where(eq(affiliates.userId, ctx.user.id))
        .limit(1);
      
      const affiliate = affiliateResult[0];
      if (!affiliate) {
        throw new Error('Affiliate account not found');
      }

      // Get referral stats
      const referrals = await db.select().from(affiliateReferrals)
        .where(eq(affiliateReferrals.affiliateId, affiliate.id));
      
      const totalReferrals = referrals.length;
      const activeReferrals = referrals.filter(r => r.status === 'converted').length;
      
      // Get commission stats
      const commissions = await db.select().from(affiliateCommissions)
        .where(eq(affiliateCommissions.affiliateId, affiliate.id));
      
      const totalCommissions = commissions.reduce((sum, c) => sum + Number(c.amount), 0);
      const pendingCommissions = commissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + Number(c.amount), 0);
      const paidCommissions = commissions
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + Number(c.amount), 0);

      // Get click stats (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentClicks = await db.select().from(affiliateClicks)
        .where(and(
          eq(affiliateClicks.affiliateId, affiliate.id),
          gte(affiliateClicks.clickedAt, thirtyDaysAgo)
        ));

      return {
        affiliate,
        stats: {
          totalReferrals,
          activeReferrals,
          totalClicks: recentClicks.length,
          totalEarnings: totalCommissions,
          pendingEarnings: pendingCommissions,
          paidEarnings: paidCommissions,
          conversionRate: recentClicks.length > 0 
            ? ((totalReferrals / recentClicks.length) * 100).toFixed(2) 
            : '0.00',
        },
      };
    }),

  // Get affiliate referrals
  getMyReferrals: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      const affiliateResult = await db.select().from(affiliates)
        .where(eq(affiliates.userId, ctx.user.id))
        .limit(1);
      
      const affiliate = affiliateResult[0];
      if (!affiliate) {
        throw new Error('Affiliate account not found');
      }

      const referrals = await db.select({
        id: affiliateReferrals.id,
        referredUserId: affiliateReferrals.referredUserId,
        referredUserEmail: users.email,
        referredUserName: users.name,
        status: affiliateReferrals.status,
        referralDate: affiliateReferrals.referralDate,
        conversionDate: affiliateReferrals.conversionDate,
      })
      .from(affiliateReferrals)
      .leftJoin(users, eq(affiliateReferrals.referredUserId, users.id))
      .where(eq(affiliateReferrals.affiliateId, affiliate.id))
      .orderBy(desc(affiliateReferrals.referralDate));

      return referrals;
    }),

  // Get affiliate commissions
  getMyCommissions: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      const affiliateResult = await db.select().from(affiliates)
        .where(eq(affiliates.userId, ctx.user.id))
        .limit(1);
      
      const affiliate = affiliateResult[0];
      if (!affiliate) {
        throw new Error('Affiliate account not found');
      }

      const commissions = await db.select()
        .from(affiliateCommissions)
        .where(eq(affiliateCommissions.affiliateId, affiliate.id))
        .orderBy(desc(affiliateCommissions.createdAt));

      return commissions;
    }),

  // Track affiliate click (public endpoint)
  trackClick: publicProcedure
    .input(z.object({
      affiliateCode: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      const affiliateResult = await db.select().from(affiliates)
        .where(and(
          eq(affiliates.affiliateCode, input.affiliateCode),
          eq(affiliates.status, 'active')
        ))
        .limit(1);
      
      const affiliate = affiliateResult[0];
      if (!affiliate) {
        return { success: false, message: 'Invalid affiliate code' };
      }

      // Record click
      await db.insert(affiliateClicks).values({
        affiliateId: affiliate.id,
        affiliateCode: input.affiliateCode,
        clickedAt: new Date(),
      });

      return { 
        success: true, 
        affiliateId: affiliate.id,
        organizationName: affiliate.organizationName 
      };
    }),

  // Admin: List all affiliates
  listAll: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      const allAffiliates = await db.select({
        id: affiliates.id,
        userId: affiliates.userId,
        userName: users.name,
        userEmail: users.email,
        affiliateCode: affiliates.affiliateCode,
        organizationName: affiliates.organizationName,
        organizationType: affiliates.organizationType,
        status: affiliates.status,
        subscriptionCommissionRate: affiliates.subscriptionCommissionRate,
        courseCommissionRate: affiliates.courseCommissionRate,
        totalEarnings: affiliates.totalEarnings,
        pendingEarnings: affiliates.pendingEarnings,
        paidEarnings: affiliates.paidEarnings,
        createdAt: affiliates.createdAt,
      })
      .from(affiliates)
      .leftJoin(users, eq(affiliates.userId, users.id))
      .orderBy(desc(affiliates.createdAt));

      return allAffiliates;
    }),

  // Admin: Approve affiliate
  approve: adminProcedure
    .input(z.object({
      affiliateId: z.number(),
      subscriptionCommissionRate: z.number().min(0).max(100).optional(),
      courseCommissionRate: z.number().min(0).max(100).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      const updateData: Record<string, any> = {
        status: 'active',
        approvedAt: new Date(),
      };

      if (input.subscriptionCommissionRate !== undefined) {
        updateData.subscriptionCommissionRate = input.subscriptionCommissionRate;
      }
      if (input.courseCommissionRate !== undefined) {
        updateData.courseCommissionRate = input.courseCommissionRate;
      }

      await db.update(affiliates)
        .set(updateData)
        .where(eq(affiliates.id, input.affiliateId));

      return { success: true };
    }),

  // Admin: Reject affiliate
  reject: adminProcedure
    .input(z.object({
      affiliateId: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      await db.update(affiliates)
        .set({ 
          status: 'rejected',
          rejectionReason: input.reason || null,
        })
        .where(eq(affiliates.id, input.affiliateId));

      return { success: true };
    }),

  // Admin: Suspend affiliate
  suspend: adminProcedure
    .input(z.object({
      affiliateId: z.number(),
      reason: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      await db.update(affiliates)
        .set({ 
          status: 'suspended',
          suspensionReason: input.reason,
        })
        .where(eq(affiliates.id, input.affiliateId));

      return { success: true };
    }),
});
