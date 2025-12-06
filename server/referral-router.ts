import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db.js";
import { sql } from "drizzle-orm";

export function generateReferralCode(userId: number): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `REF${userId}${timestamp}${random}`.toUpperCase();
}

export async function getReferralCode(userId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Check if user already has a referral code
  const existing: any = await db.execute(sql`
    SELECT referral_code FROM referrals 
    WHERE referrer_user_id = ${userId} 
    LIMIT 1
  `);
  
  if (existing.length > 0) {
    return existing[0].referral_code;
  }
  
  // Generate new referral code
  const code = generateReferralCode(userId);
  await db.execute(sql`
    INSERT INTO referrals (referrer_user_id, referral_code, status)
    VALUES (${userId}, ${code}, 'active')
  `);
  
  return code;
}

export async function trackReferral(referralCode: string, referredUserId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Find the referral record
  const referral: any = await db.execute(sql`
    SELECT id, referrer_user_id FROM referrals 
    WHERE referral_code = ${referralCode} AND status = 'active'
    LIMIT 1
  `);
  
  if (referral.length === 0) {
    throw new Error("Invalid referral code");
  }
  
  const referralData: any = referral[0];
  
  // Update referral with referred user
  await db.execute(sql`
    UPDATE referrals 
    SET referred_user_id = ${referredUserId}, status = 'pending'
    WHERE id = ${referralData.id}
  `);
}

export async function completeReferral(referredUserId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Find pending referral for this user
  const referral: any = await db.execute(sql`
    SELECT id, referrer_user_id, credit_amount FROM referrals 
    WHERE referred_user_id = ${referredUserId} AND status = 'pending'
    LIMIT 1
  `);
  
  if (referral.length === 0) {
    return; // No pending referral
  }
  
  const referralData: any = referral[0];
  const creditAmount = parseFloat(referralData.credit_amount);
  
  // Mark referral as completed
  await db.execute(sql`
    UPDATE referrals 
    SET status = 'completed', completed_at = CURRENT_TIMESTAMP
    WHERE id = ${referralData.id}
  `);
  
  // Add credits to referrer
  const existingCredits: any = await db.execute(sql`
    SELECT id, total_credits, available_credits FROM user_credits 
    WHERE user_id = ${referralData.referrer_user_id}
  `);
  
  if (existingCredits.length > 0) {
    const credits: any = existingCredits[0];
    await db.execute(sql`
      UPDATE user_credits 
      SET total_credits = ${parseFloat(credits.total_credits) + creditAmount},
          available_credits = ${parseFloat(credits.available_credits) + creditAmount},
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${referralData.referrer_user_id}
    `);
  } else {
    await db.execute(sql`
      INSERT INTO user_credits (user_id, total_credits, available_credits)
      VALUES (${referralData.referrer_user_id}, ${creditAmount}, ${creditAmount})
    `);
  }
}

export async function getUserCredits(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result: any = await db.execute(sql`
    SELECT total_credits, used_credits, available_credits 
    FROM user_credits 
    WHERE user_id = ${userId}
  `);
  
  if (result.length === 0) {
    return { totalCredits: 0, usedCredits: 0, availableCredits: 0 };
  }
  
  const credits: any = result[0];
  return {
    totalCredits: parseFloat(credits.total_credits),
    usedCredits: parseFloat(credits.used_credits),
    availableCredits: parseFloat(credits.available_credits),
  };
}

export async function getUserReferrals(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.execute<{
    id: number;
    referral_code: string;
    status: string;
    credit_amount: string;
    created_at: string;
    completed_at: string | null;
    referred_user_name: string | null;
    referred_user_email: string | null;
  }>(sql`
    SELECT r.id, r.referral_code, r.status, r.credit_amount, r.created_at, r.completed_at,
           u.name as referred_user_name, u.email as referred_user_email
    FROM referrals r
    LEFT JOIN users u ON r.referred_user_id = u.id
    WHERE r.referrer_user_id = ${userId}
    ORDER BY r.created_at DESC
  `);
  
  return result.map((row: any) => ({
    id: row.id,
    referralCode: row.referral_code,
    status: row.status,
    creditAmount: parseFloat(row.credit_amount),
    createdAt: row.created_at,
    completedAt: row.completed_at,
    referredUserName: row.referred_user_name,
    referredUserEmail: row.referred_user_email,
  }));
}
