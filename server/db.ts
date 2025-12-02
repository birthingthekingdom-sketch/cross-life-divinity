import { eq, and, desc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  courses, InsertCourse, Course,
  lessons, InsertLesson, Lesson,
  quizQuestions, InsertQuizQuestion, QuizQuestion,
  studentProgress, InsertStudentProgress, StudentProgress,
  quizAnswers, InsertQuizAnswer, QuizAnswer,
  accessCodes, InsertAccessCode, AccessCode,
  enrollments, InsertEnrollment, Enrollment
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// ACCESS CODE MANAGEMENT
// ============================================

export async function createAccessCode(code: InsertAccessCode) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(accessCodes).values(code);
}

export async function getAccessCodeByCode(code: string): Promise<AccessCode | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(accessCodes).where(eq(accessCodes.code, code)).limit(1);
  return result[0];
}

export async function getAllAccessCodes(): Promise<AccessCode[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(accessCodes).orderBy(desc(accessCodes.createdAt));
}

export async function updateAccessCode(id: number, isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(accessCodes).set({ isActive }).where(eq(accessCodes.id, id));
}

// ============================================
// ENROLLMENT MANAGEMENT
// ============================================

export async function createEnrollment(enrollment: InsertEnrollment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(enrollments).values(enrollment);
}

export async function getUserEnrollment(userId: number): Promise<Enrollment | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(enrollments).where(eq(enrollments.userId, userId)).limit(1);
  return result[0];
}

// ============================================
// COURSE MANAGEMENT
// ============================================

export async function createCourse(course: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(courses).values(course);
}

export async function getAllCourses(): Promise<Course[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(courses).orderBy(courses.displayOrder);
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0];
}

export async function updateCourse(id: number, updates: Partial<InsertCourse>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(courses).set(updates).where(eq(courses.id, id));
}

export async function deleteCourse(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(courses).where(eq(courses.id, id));
}

// ============================================
// LESSON MANAGEMENT
// ============================================

export async function createLesson(lesson: InsertLesson) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(lessons).values(lesson);
}

export async function getLessonsByCourseId(courseId: number): Promise<Lesson[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(lessons.lessonOrder);
}

export async function getLessonById(id: number): Promise<Lesson | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result[0];
}

export async function updateLesson(id: number, updates: Partial<InsertLesson>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(lessons).set(updates).where(eq(lessons.id, id));
}

export async function deleteLesson(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(lessons).where(eq(lessons.id, id));
}

// ============================================
// QUIZ QUESTION MANAGEMENT
// ============================================

export async function createQuizQuestion(question: InsertQuizQuestion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(quizQuestions).values(question);
}

export async function getQuizQuestionsByLessonId(lessonId: number): Promise<QuizQuestion[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(quizQuestions).where(eq(quizQuestions.lessonId, lessonId)).orderBy(quizQuestions.questionOrder);
}

export async function updateQuizQuestion(id: number, updates: Partial<InsertQuizQuestion>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(quizQuestions).set(updates).where(eq(quizQuestions.id, id));
}

export async function deleteQuizQuestion(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(quizQuestions).where(eq(quizQuestions.id, id));
}

// ============================================
// STUDENT PROGRESS MANAGEMENT
// ============================================

export async function markLessonComplete(userId: number, courseId: number, lessonId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(studentProgress)
    .where(and(
      eq(studentProgress.userId, userId),
      eq(studentProgress.lessonId, lessonId)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(studentProgress)
      .set({ completed: true, completedAt: new Date() })
      .where(eq(studentProgress.id, existing[0].id));
  } else {
    await db.insert(studentProgress).values({
      userId,
      courseId,
      lessonId,
      completed: true,
      completedAt: new Date()
    });
  }
}

export async function getUserProgress(userId: number, courseId: number): Promise<StudentProgress[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(studentProgress)
    .where(and(
      eq(studentProgress.userId, userId),
      eq(studentProgress.courseId, courseId)
    ));
}

export async function getAllUserProgress(userId: number): Promise<StudentProgress[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(studentProgress).where(eq(studentProgress.userId, userId));
}

// ============================================
// QUIZ ANSWER MANAGEMENT
// ============================================

export async function saveQuizAnswer(answer: InsertQuizAnswer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(quizAnswers).values(answer);
}

export async function getUserQuizAnswers(userId: number, questionIds: number[]): Promise<QuizAnswer[]> {
  const db = await getDb();
  if (!db || questionIds.length === 0) return [];
  
  return db.select().from(quizAnswers)
    .where(and(
      eq(quizAnswers.userId, userId),
      inArray(quizAnswers.questionId, questionIds)
    ));
}
