import { getDb } from './db';
import { courseEnrollments, users, idSubmissions } from '../drizzle/schema';
import { eq, and, isNull, lte } from 'drizzle-orm';
import * as emailNotifications from './email-notifications';

/**
 * VERIFICATION DISABLED: This function is no longer used
 * ID verification reminders are not sent as verification is not required
 */
export async function sendPendingVerificationReminders() {
  // Verification disabled - function disabled
  return;
}

/**
 * NOTE: The new workflow does NOT enforce deadlines or suspend access
 * Students have immediate access to courses upon enrollment
 * Admin has 72 hours to review ID verification, but no automatic penalties apply
 * If admin finds issues, they contact the student directly via email
 */
