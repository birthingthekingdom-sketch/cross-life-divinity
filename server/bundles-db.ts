import { getDb } from "./db";
import { 
  courseBundles, bundleCourses, learningPaths, pathCourses,
  type InsertCourseBundle, type InsertBundleCourse,
  type InsertLearningPath, type InsertPathCourse
} from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

// ============ Course Bundles ============

export async function createBundle(data: InsertCourseBundle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [bundle] = await db.insert(courseBundles).values(data).$returningId();
  return bundle.id;
}

export async function getAllBundles() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(courseBundles).orderBy(desc(courseBundles.displayOrder));
}

export async function getActiveBundles() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(courseBundles)
    .where(eq(courseBundles.isActive, true))
    .orderBy(desc(courseBundles.displayOrder));
}

export async function getBundleById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [bundle] = await db.select().from(courseBundles).where(eq(courseBundles.id, id));
  return bundle;
}

export async function updateBundle(id: number, data: Partial<InsertCourseBundle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseBundles).set(data).where(eq(courseBundles.id, id));
}

export async function deleteBundle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Delete associated courses first
  await db.delete(bundleCourses).where(eq(bundleCourses.bundleId, id));
  // Then delete the bundle
  await db.delete(courseBundles).where(eq(courseBundles.id, id));
}

// ============ Bundle Courses ============

export async function addCourseToBundle(bundleId: number, courseId: number, courseOrder: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bundleCourses).values({ bundleId, courseId, courseOrder });
}

export async function getBundleCourses(bundleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(bundleCourses)
    .where(eq(bundleCourses.bundleId, bundleId))
    .orderBy(bundleCourses.courseOrder);
}

export async function removeCourseFromBundle(bundleId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bundleCourses)
    .where(and(
      eq(bundleCourses.bundleId, bundleId),
      eq(bundleCourses.courseId, courseId)
    ));
}

export async function updateBundleCourseOrder(bundleId: number, courseId: number, newOrder: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(bundleCourses)
    .set({ courseOrder: newOrder })
    .where(and(
      eq(bundleCourses.bundleId, bundleId),
      eq(bundleCourses.courseId, courseId)
    ));
}

// ============ Learning Paths ============

export async function createLearningPath(data: InsertLearningPath) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [path] = await db.insert(learningPaths).values(data).$returningId();
  return path.id;
}

export async function getAllLearningPaths() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(learningPaths).orderBy(desc(learningPaths.displayOrder));
}

export async function getActiveLearningPaths() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(learningPaths)
    .where(eq(learningPaths.isActive, true))
    .orderBy(desc(learningPaths.displayOrder));
}

export async function getLearningPathById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [path] = await db.select().from(learningPaths).where(eq(learningPaths.id, id));
  return path;
}

export async function updateLearningPath(id: number, data: Partial<InsertLearningPath>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(learningPaths).set(data).where(eq(learningPaths.id, id));
}

export async function deleteLearningPath(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Delete associated courses first
  await db.delete(pathCourses).where(eq(pathCourses.pathId, id));
  // Then delete the path
  await db.delete(learningPaths).where(eq(learningPaths.id, id));
}

// ============ Path Courses ============

export async function addCourseToPath(pathId: number, courseId: number, courseOrder: number, isRequired: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(pathCourses).values({ pathId, courseId, courseOrder, isRequired });
}

export async function getPathCourses(pathId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(pathCourses)
    .where(eq(pathCourses.pathId, pathId))
    .orderBy(pathCourses.courseOrder);
}

export async function removeCourseFromPath(pathId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pathCourses)
    .where(and(
      eq(pathCourses.pathId, pathId),
      eq(pathCourses.courseId, courseId)
    ));
}

export async function updatePathCourseOrder(pathId: number, courseId: number, newOrder: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(pathCourses)
    .set({ courseOrder: newOrder })
    .where(and(
      eq(pathCourses.pathId, pathId),
      eq(pathCourses.courseId, courseId)
    ));
}

export async function updatePathCourseRequired(pathId: number, courseId: number, isRequired: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(pathCourses)
    .set({ isRequired })
    .where(and(
      eq(pathCourses.pathId, pathId),
      eq(pathCourses.courseId, courseId)
    ));
}
