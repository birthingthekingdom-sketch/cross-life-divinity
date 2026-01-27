import { getDb } from "./db";
import { 
  coursePreviews, 
  previewQuizAttempts,
  InsertCoursePreview,
  InsertPreviewQuizAttempt
} from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Create or update course preview
 */
export async function upsertCoursePreview(data: InsertCoursePreview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if preview already exists
  const existing = await db.select().from(coursePreviews)
    .where(eq(coursePreviews.courseId, data.courseId));
  
  if (existing.length > 0) {
    // Update existing
    await db.update(coursePreviews)
      .set(data)
      .where(eq(coursePreviews.courseId, data.courseId));
    // Fetch and return updated record
    const updated = await db.select().from(coursePreviews)
      .where(eq(coursePreviews.courseId, data.courseId));
    return updated[0] || null;
  }
  
  // Create new
  await db.insert(coursePreviews).values(data);
  
  const result = await db.select().from(coursePreviews)
    .where(eq(coursePreviews.courseId, data.courseId));
  
  return result[0] || null;
}

/**
 * Get course preview by course ID
 */
export async function getCoursePreview(courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(coursePreviews)
    .where(eq(coursePreviews.courseId, courseId));
  
  return result[0] || null;
}

/**
 * Get all active course previews
 */
export async function getAllCoursePreviews() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(coursePreviews)
    .where(eq(coursePreviews.isActive, true));
}

/**
 * Record preview quiz attempt
 */
export async function recordPreviewQuizAttempt(data: InsertPreviewQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(previewQuizAttempts).values(data);
  
  const result = await db.select().from(previewQuizAttempts)
    .where(and(
      eq(previewQuizAttempts.userId, data.userId),
      eq(previewQuizAttempts.courseId, data.courseId),
      eq(previewQuizAttempts.lessonId, data.lessonId)
    ))
    .orderBy((t) => t.attemptedAt)
    .limit(1);
  
  return result[0] || null;
}

/**
 * Get user's preview quiz attempts for a course
 */
export async function getUserPreviewQuizAttempts(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(previewQuizAttempts)
    .where(and(
      eq(previewQuizAttempts.userId, userId),
      eq(previewQuizAttempts.courseId, courseId)
    ));
}

/**
 * Get best preview quiz score for a user in a course
 */
export async function getBestPreviewQuizScore(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const attempts = await db.select().from(previewQuizAttempts)
    .where(and(
      eq(previewQuizAttempts.userId, userId),
      eq(previewQuizAttempts.courseId, courseId)
    ));
  
  if (attempts.length === 0) return null;
  
  const best = attempts.reduce((max, current) => {
    const currentScore = (current.score / current.totalQuestions) * 100;
    const maxScore = (max.score / max.totalQuestions) * 100;
    return currentScore > maxScore ? current : max;
  });
  
  return {
    score: best.score,
    totalQuestions: best.totalQuestions,
    percentage: (best.score / best.totalQuestions) * 100,
    attemptedAt: best.attemptedAt,
  };
}

/**
 * Update course preview study guide URL
 */
export async function updateCoursePreviewStudyGuide(courseId: number, studyGuideUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(coursePreviews)
    .set({ studyGuideUrl })
    .where(eq(coursePreviews.courseId, courseId));
  
  return await getCoursePreview(courseId);
}

/**
 * Deactivate course preview
 */
export async function deactivateCoursePreview(courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(coursePreviews)
    .set({ isActive: false })
    .where(eq(coursePreviews.courseId, courseId));
}

/**
 * Get preview statistics for a course
 */
export async function getCoursePreviewStats(courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const attempts = await db.select().from(previewQuizAttempts)
    .where(eq(previewQuizAttempts.courseId, courseId));
  
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      uniqueUsers: 0,
      averageScore: 0,
      passRate: 0,
    };
  }
  
  const uniqueUsers = new Set(attempts.map(a => a.userId)).size;
  const averageScore = attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / attempts.length;
  const passedAttempts = attempts.filter(a => (a.score / a.totalQuestions) * 100 >= 70).length;
  const passRate = (passedAttempts / attempts.length) * 100;
  
  return {
    totalAttempts: attempts.length,
    uniqueUsers,
    averageScore: Math.round(averageScore * 100) / 100,
    passRate: Math.round(passRate * 100) / 100,
  };
}
