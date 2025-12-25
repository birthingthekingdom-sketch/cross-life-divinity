/**
 * Payment Reminder Scheduler
 * Sends payment reminders 3 days before payment due date
 */

import { sql } from 'drizzle-orm';
import * as db from './db';
import { sendPaymentReminderEmail } from './email';
import { CronJob } from 'cron';

/**
 * Schedule payment reminders to run daily at 8 AM
 * Checks for payments due in 3 days and sends reminders
 */
export function schedulePaymentReminders() {
  // Run every day at 8:00 AM
  const job = new CronJob('0 8 * * *', async () => {
    console.log('[Payment Reminders] Starting scheduled payment reminder check...');
    await sendDuePaymentReminders();
  });

  job.start();
  console.log('[Payment Reminders] Scheduler started - will run daily at 8:00 AM');
}

/**
 * Check for payments due in 3 days and send reminders
 */
async function sendDuePaymentReminders() {
  try {
    const dbConn = await db.getDb();
    if (!dbConn) {
      console.error('[Payment Reminders] Database not available');
      return;
    }

    // Calculate date range: payments due in 3 days (within 3-4 days from now)
    const today = new Date();
    const reminderDate = new Date(today);
    reminderDate.setDate(reminderDate.getDate() + 3);
    reminderDate.setHours(0, 0, 0, 0);

    const reminderDateEnd = new Date(reminderDate);
    reminderDateEnd.setDate(reminderDateEnd.getDate() + 1);

    console.log(`[Payment Reminders] Checking for payments due between ${reminderDate.toISOString()} and ${reminderDateEnd.toISOString()}`);

    // Find payment plans with payments due in 3 days
    const duePayments: any = await dbConn.execute(
      sql`SELECT 
            pp.id,
            pp.userId,
            pp.planType,
            pp.monthlyAmount,
            pp.paymentsCompleted,
            pp.paymentsTotal,
            pp.nextPaymentDate,
            u.name,
            u.email
          FROM payment_plans pp
          JOIN users u ON pp.userId = u.id
          WHERE pp.status = 'active'
            AND pp.nextPaymentDate >= ${reminderDate}
            AND pp.nextPaymentDate < ${reminderDateEnd}
            AND u.email IS NOT NULL`
    );

    const payments = Array.isArray(duePayments) ? duePayments : (duePayments.rows || []);

    console.log(`[Payment Reminders] Found ${payments.length} payments due for reminders`);

    // Send reminder emails
    for (const payment of payments) {
      try {
        const sent = await sendPaymentReminderEmail(
          payment.email,
          payment.name || 'Student',
          payment.planType,
          new Date(payment.nextPaymentDate),
          payment.monthlyAmount,
          payment.paymentsCompleted + 1,
          payment.paymentsTotal
        );

        if (sent) {
          console.log(`[Payment Reminders] Reminder sent to ${payment.email} for payment ${payment.paymentsCompleted + 1}/${payment.paymentsTotal}`);

          // Record that reminder was sent
          await dbConn.execute(
            sql`INSERT INTO payment_reminders (paymentPlanId, reminderType, sentAt)
                VALUES (${payment.id}, 'payment_due', NOW())`
          );
        } else {
          console.error(`[Payment Reminders] Failed to send reminder to ${payment.email}`);
        }
      } catch (error) {
        console.error(`[Payment Reminders] Error sending reminder for payment plan ${payment.id}:`, error);
      }
    }

    console.log('[Payment Reminders] Scheduled check completed');
  } catch (error) {
    console.error('[Payment Reminders] Error in scheduled payment reminder check:', error);
  }
}

/**
 * Send immediate payment reminder (for manual triggering)
 */
export async function sendImmediatePaymentReminder(paymentPlanId: number) {
  try {
    const dbConn = await db.getDb();
    if (!dbConn) {
      console.error('[Payment Reminders] Database not available');
      return false;
    }

    // Get payment plan details
    const paymentPlan: any = await dbConn.execute(
      sql`SELECT 
            pp.id,
            pp.userId,
            pp.planType,
            pp.monthlyAmount,
            pp.paymentsCompleted,
            pp.paymentsTotal,
            pp.nextPaymentDate,
            u.name,
            u.email
          FROM payment_plans pp
          JOIN users u ON pp.userId = u.id
          WHERE pp.id = ${paymentPlanId}`
    );

    const plans = Array.isArray(paymentPlan) ? paymentPlan : (paymentPlan.rows || []);

    if (plans.length === 0) {
      console.error(`[Payment Reminders] Payment plan ${paymentPlanId} not found`);
      return false;
    }

    const plan = plans[0];

    const sent = await sendPaymentReminderEmail(
      plan.email,
      plan.name || 'Student',
      plan.planType,
      new Date(plan.nextPaymentDate),
      plan.monthlyAmount,
      plan.paymentsCompleted + 1,
      plan.paymentsTotal
    );

    if (sent) {
      console.log(`[Payment Reminders] Immediate reminder sent to ${plan.email}`);

      // Record that reminder was sent
      await dbConn.execute(
        sql`INSERT INTO payment_reminders (paymentPlanId, reminderType, sentAt)
            VALUES (${paymentPlanId}, 'manual', NOW())`
      );

      return true;
    } else {
      console.error(`[Payment Reminders] Failed to send immediate reminder to ${plan.email}`);
      return false;
    }
  } catch (error) {
    console.error('[Payment Reminders] Error sending immediate payment reminder:', error);
    return false;
  }
}
