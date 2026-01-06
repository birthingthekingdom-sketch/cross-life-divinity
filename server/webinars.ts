import { getDb } from "./db";
import { 
  webinars, 
  webinarRegistrations, 
  InsertWebinar,
  InsertWebinarRegistration 
} from "../drizzle/schema";
import { eq, and, gt, desc, asc, inArray } from "drizzle-orm";

/**
 * Create a new webinar
 */
export async function createWebinar(data: InsertWebinar) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(webinars).values(data);
  // Get the most recently created webinar for this course/title
  const result = await db.select().from(webinars)
    .where(eq(webinars.title, data.title))
    .orderBy(desc(webinars.createdAt))
    .limit(1);
  return result[0] || null;
}

/**
 * Get all webinars with optional filters
 */
export async function getWebinars(filters?: {
  courseId?: number;
  upcomingOnly?: boolean;
  isActive?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = [];
  
  if (filters?.isActive !== undefined) {
    conditions.push(eq(webinars.isActive, filters.isActive));
  }
  
  if (filters?.courseId) {
    conditions.push(eq(webinars.courseId, filters.courseId));
  }
  
  if (filters?.upcomingOnly) {
    conditions.push(gt(webinars.scheduledAt, new Date()));
  }
  
  const query = db.select().from(webinars);
  
  if (conditions.length > 0) {
    return await query.where(and(...conditions)).orderBy(asc(webinars.scheduledAt));
  }
  
  return await query.orderBy(desc(webinars.scheduledAt));
}

/**
 * Get webinar by ID
 */
export async function getWebinarById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(webinars).where(eq(webinars.id, id));
  return result[0] || null;
}

/**
 * Update webinar
 */
export async function updateWebinar(id: number, data: Partial<InsertWebinar>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(webinars)
    .set(data)
    .where(eq(webinars.id, id));
  
  return await getWebinarById(id);
}

/**
 * Delete webinar
 */
export async function deleteWebinar(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(webinars).where(eq(webinars.id, id));
}

/**
 * Register user for webinar
 */
export async function registerForWebinar(userId: number, webinarId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if already registered
  const existing = await db.select().from(webinarRegistrations)
    .where(and(
      eq(webinarRegistrations.userId, userId),
      eq(webinarRegistrations.webinarId, webinarId)
    ));
  
  if (existing.length > 0) {
    throw new Error("Already registered for this webinar");
  }
  
  const result = await db.insert(webinarRegistrations).values({
    userId,
    webinarId,
  });
  
  return await db.select().from(webinarRegistrations)
    .where(and(
      eq(webinarRegistrations.userId, userId),
      eq(webinarRegistrations.webinarId, webinarId)
    ))
    .then(r => r[0]);
}

/**
 * Unregister user from webinar
 */
export async function unregisterFromWebinar(userId: number, webinarId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(webinarRegistrations)
    .where(and(
      eq(webinarRegistrations.userId, userId),
      eq(webinarRegistrations.webinarId, webinarId)
    ));
}

/**
 * Get user's registered webinars
 */
export async function getUserWebinars(userId: number, upcomingOnly: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const registrations = await db.select().from(webinarRegistrations)
    .where(eq(webinarRegistrations.userId, userId));
  
  if (registrations.length === 0) return [];
  
  const webinarIds = registrations.map(r => r.webinarId);
  
  if (webinarIds.length === 0) return [];
  
  const conditions = [inArray(webinars.id, webinarIds)];
  
  if (upcomingOnly) {
    conditions.push(gt(webinars.scheduledAt, new Date()));
  }
  
  return await db.select().from(webinars)
    .where(and(...conditions))
    .orderBy(asc(webinars.scheduledAt));
}

/**
 * Get webinar registrations
 */
export async function getWebinarRegistrations(webinarId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(webinarRegistrations)
    .where(eq(webinarRegistrations.webinarId, webinarId));
}

/**
 * Mark attendance
 */
export async function markWebinarAttendance(registrationId: number, attended: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {
    attended,
    attendedAt: attended ? new Date() : null,
  };
  await db.update(webinarRegistrations)
    .set(updateData)
    .where(eq(webinarRegistrations.id, registrationId));
  
  return await db.select().from(webinarRegistrations)
    .where(eq(webinarRegistrations.id, registrationId))
    .then(r => r[0] || null);
}

/**
 * Get webinar attendance stats
 */
export async function getWebinarAttendanceStats(webinarId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const registrations = await db.select().from(webinarRegistrations)
    .where(eq(webinarRegistrations.webinarId, webinarId));
  
  const attended = registrations.filter(r => r.attended).length;
  
  return {
    total: registrations.length,
    attended,
    noShow: registrations.length - attended,
    attendanceRate: registrations.length > 0 ? (attended / registrations.length) * 100 : 0,
  };
}
