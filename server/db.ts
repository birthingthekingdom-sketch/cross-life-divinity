import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  courses, InsertCourse, Course,
  lessons, InsertLesson, Lesson,
  quizQuestions, InsertQuizQuestion, QuizQuestion,
  studentProgress, InsertStudentProgress, StudentProgress,
  quizAnswers, InsertQuizAnswer, QuizAnswer,
  accessCodes, InsertAccessCode, AccessCode,
  enrollments, InsertEnrollment, Enrollment,
  quizSubmissions, InsertQuizSubmission, QuizSubmission,
  certificates, InsertCertificate, Certificate,
  accessCodeCourses, InsertAccessCodeCourse, AccessCodeCourse,
  courseEnrollments, InsertCourseEnrollment, CourseEnrollment,
  forumTopics, InsertForumTopic, ForumTopic,
  forumReplies, InsertForumReply, ForumReply,
  webinars, InsertWebinar, Webinar,
  followUps, InsertFollowUp, FollowUp,
  assignmentSubmissions, InsertAssignmentSubmission, AssignmentSubmission,
  assignmentGrades, InsertAssignmentGrade, AssignmentGrade
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

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
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

// ============================================
// QUIZ SUBMISSION MANAGEMENT
// ============================================

export async function createQuizSubmission(submission: InsertQuizSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(quizSubmissions).values(submission);
}

export async function getQuizSubmissionByUserAndLesson(userId: number, lessonId: number): Promise<QuizSubmission | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(quizSubmissions)
    .where(and(
      eq(quizSubmissions.userId, userId),
      eq(quizSubmissions.lessonId, lessonId)
    ))
    .orderBy(desc(quizSubmissions.submittedAt))
    .limit(1);
  
  return result[0];
}

export async function getUserQuizSubmissions(userId: number): Promise<QuizSubmission[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(quizSubmissions)
    .where(eq(quizSubmissions.userId, userId))
    .orderBy(desc(quizSubmissions.submittedAt));
}

// ============================================
// CERTIFICATE MANAGEMENT
// ============================================

export async function createCertificate(certificate: InsertCertificate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(certificates).values(certificate);
}

export async function getCertificateByUserAndCourse(userId: number, courseId: number): Promise<Certificate | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(certificates)
    .where(and(
      eq(certificates.userId, userId),
      eq(certificates.courseId, courseId)
    ))
    .limit(1);
  
  return result[0];
}

export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: certificates.id,
    userId: certificates.userId,
    courseId: certificates.courseId,
    certificateNumber: certificates.certificateNumber,
    verificationToken: certificates.verificationToken,
    cpdHours: certificates.cpdHours,
    issuedAt: certificates.issuedAt,
    completionDate: certificates.completionDate,
    courseTitle: courses.title,
    courseCode: courses.code,
  })
    .from(certificates)
    .leftJoin(courses, eq(certificates.courseId, courses.id))
    .where(eq(certificates.userId, userId))
    .orderBy(desc(certificates.issuedAt));
}

export async function getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(certificates)
    .where(eq(certificates.certificateNumber, certificateNumber))
    .limit(1);
  
  return result[0];
}

// ============================================================================
// Course Enrollment Functions
// ============================================================================

export async function createAccessCodeCourse(data: InsertAccessCodeCourse): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(accessCodeCourses).values(data);
}

export async function getAccessCodeCourses(accessCodeId: number): Promise<AccessCodeCourse[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(accessCodeCourses)
    .where(eq(accessCodeCourses.accessCodeId, accessCodeId));
}

export async function deleteAccessCodeCourses(accessCodeId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(accessCodeCourses)
    .where(eq(accessCodeCourses.accessCodeId, accessCodeId));
}

export async function createCourseEnrollment(data: InsertCourseEnrollment): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(courseEnrollments).values(data);
}

export async function getUserEnrollments(userId: number): Promise<CourseEnrollment[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(courseEnrollments)
    .where(eq(courseEnrollments.userId, userId));
}

export async function isUserEnrolledInCourse(userId: number, courseId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(courseEnrollments)
    .where(and(
      eq(courseEnrollments.userId, userId),
      eq(courseEnrollments.courseId, courseId)
    ))
    .limit(1);
  
  return result.length > 0;
}

export async function getEnrolledCourses(userId: number): Promise<Course[]> {
  const db = await getDb();
  if (!db) return [];
  
  const enrollments = await db.select().from(courseEnrollments)
    .where(eq(courseEnrollments.userId, userId));
  
  if (enrollments.length === 0) return [];
  
  const courseIds = enrollments.map(e => e.courseId);
  
  return db.select().from(courses)
    .where(inArray(courses.id, courseIds))
    .orderBy(courses.displayOrder);
}


// ============================================================================
// Forum Functions
// ============================================================================

export async function getForumTopicsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(forumTopics).where(eq(forumTopics.courseId, courseId)).orderBy(desc(forumTopics.isPinned), desc(forumTopics.createdAt));
}

export async function getForumTopicById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(forumTopics).where(eq(forumTopics.id, id)).limit(1);
  return results[0] || null;
}

export async function createForumTopic(topic: InsertForumTopic) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(forumTopics).values(topic);
}

export async function getForumRepliesByTopic(topicId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(forumReplies).where(eq(forumReplies.topicId, topicId)).orderBy(forumReplies.createdAt);
}

export async function createForumReply(reply: InsertForumReply) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(forumReplies).values(reply);
}

export async function deleteForumTopic(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Delete replies first
  await db.delete(forumReplies).where(eq(forumReplies.topicId, id));
  // Then delete topic
  await db.delete(forumTopics).where(eq(forumTopics.id, id));
}

export async function deleteForumReply(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(forumReplies).where(eq(forumReplies.id, id));
}

export async function getCertificateByVerificationToken(verificationToken: string): Promise<Certificate | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(certificates)
    .where(eq(certificates.verificationToken, verificationToken))
    .limit(1);
  
  return result[0];
}

export async function updateCourseCPDHours(courseId: number, cpdHours: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.update(courses)
    .set({ cpdHours })
    .where(eq(courses.id, courseId));
}

export async function updateCourseVideoUrl(courseId: number, introVideoUrl: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.update(courses)
    .set({ introVideoUrl })
    .where(eq(courses.id, courseId));
}

export async function getStudentProgressSummary(userId: number) {
  const db = await getDb();
  if (!db) return {
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalCPDHours: 0,
    earnedCPDHours: 0,
    averageQuizScore: 0,
    courseProgress: [],
    recentActivity: [],
  };
  
  // Get all enrolled courses
  const enrolledCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      code: courses.code,
      cpdHours: courses.cpdHours,
      totalLessons: courses.totalLessons,
    })
    .from(courseEnrollments)
    .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
    .where(eq(courseEnrollments.userId, userId));
  
  // Get all progress for this user
  const allProgress = await db
    .select()
    .from(studentProgress)
    .where(eq(studentProgress.userId, userId));
  
  // Get all quiz submissions
  const quizSubs = await db
    .select()
    .from(quizSubmissions)
    .where(eq(quizSubmissions.userId, userId));
  
  // Calculate overall stats
  const totalCourses = enrolledCourses.length;
  const totalLessons = enrolledCourses.reduce((sum, course) => sum + (course.totalLessons || 0), 0);
  const completedLessons = allProgress.filter(p => p.completed).length;
  const totalCPDHours = enrolledCourses.reduce((sum, course) => sum + (course.cpdHours || 0), 0);
  
  // Calculate course progress
  const courseProgress = enrolledCourses.map(course => {
    const courseProgressItems = allProgress.filter(p => p.courseId === course.id);
    const completedCount = courseProgressItems.filter(p => p.completed).length;
    const isCompleted = completedCount === course.totalLessons && course.totalLessons > 0;
    
    return {
      id: course.id,
      title: course.title,
      code: course.code,
      cpdHours: course.cpdHours || 0,
      totalLessons: course.totalLessons || 0,
      completedLessons: completedCount,
      isCompleted,
    };
  });
  
  const completedCourses = courseProgress.filter(c => c.isCompleted).length;
  const earnedCPDHours = courseProgress
    .filter(c => c.isCompleted)
    .reduce((sum, c) => sum + c.cpdHours, 0);
  
  // Calculate average quiz score
  const averageQuizScore = quizSubs.length > 0
    ? quizSubs.reduce((sum, q) => sum + (q.score || 0), 0) / quizSubs.length
    : 0;
  
  // Get recent activity (last 10 completed lessons)
  const recentActivity = await db
    .select({
      lessonId: studentProgress.lessonId,
      lessonTitle: lessons.title,
      courseTitle: courses.title,
      completedAt: studentProgress.completedAt,
    })
    .from(studentProgress)
    .innerJoin(lessons, eq(studentProgress.lessonId, lessons.id))
    .innerJoin(courses, eq(studentProgress.courseId, courses.id))
    .where(and(
      eq(studentProgress.userId, userId),
      eq(studentProgress.completed, true)
    ))
    .orderBy(desc(studentProgress.completedAt))
    .limit(10);
  
  return {
    totalCourses,
    completedCourses,
    totalLessons,
    completedLessons,
    totalCPDHours,
    earnedCPDHours,
    averageQuizScore,
    courseProgress,
    recentActivity,
  };
}

// Webinar functions
export async function getAllWebinars() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(webinars).orderBy(desc(webinars.scheduledAt));
}

export async function getUpcomingWebinars() {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  return db
    .select()
    .from(webinars)
    .where(and(
      eq(webinars.isActive, true),
      sql`${webinars.scheduledAt} > ${now.toISOString()}`
    ))
    .orderBy(webinars.scheduledAt);
}

export async function getWebinarById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(webinars).where(eq(webinars.id, id)).limit(1);
  return result[0] || null;
}

export async function createWebinar(data: {
  courseId?: number;
  title: string;
  description?: string;
  meetingUrl: string;
  scheduledAt: Date;
  duration?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(webinars).values({
    courseId: data.courseId || null,
    title: data.title,
    description: data.description || null,
    meetingUrl: data.meetingUrl,
    scheduledAt: data.scheduledAt,
    duration: data.duration || 60,
    isActive: true,
  });
  
  return Number(result[0].insertId);
}

export async function updateWebinar(id: number, data: Partial<{
  title: string;
  description: string;
  meetingUrl: string;
  scheduledAt: Date;
  duration: number;
  recordingUrl: string;
  isActive: boolean;
}>) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(webinars).set(data).where(eq(webinars.id, id));
}

export async function deleteWebinar(id: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(webinars).where(eq(webinars.id, id));
}

export async function getWebinarsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(webinars)
    .where(and(
      eq(webinars.courseId, courseId),
      eq(webinars.isActive, true)
    ))
    .orderBy(webinars.scheduledAt);
}

// ============================================================
// Follow-Ups
// ============================================================

export async function createFollowUp(data: {
  studentId: number;
  adminId: number;
  title: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(followUps).values(data);
  return Number(result[0].insertId);
}

export async function getFollowUpById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(followUps)
    .where(eq(followUps.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getAllFollowUps() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: followUps.id,
      studentId: followUps.studentId,
      studentName: users.name,
      studentEmail: users.email,
      adminId: followUps.adminId,
      title: followUps.title,
      notes: followUps.notes,
      status: followUps.status,
      priority: followUps.priority,
      dueDate: followUps.dueDate,
      completedAt: followUps.completedAt,
      createdAt: followUps.createdAt,
      updatedAt: followUps.updatedAt,
    })
    .from(followUps)
    .leftJoin(users, eq(followUps.studentId, users.id))
    .orderBy(desc(followUps.createdAt));
}

export async function getFollowUpsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(followUps)
    .where(eq(followUps.studentId, studentId))
    .orderBy(desc(followUps.createdAt));
}

export async function getFollowUpsByStatus(status: 'pending' | 'completed' | 'cancelled') {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: followUps.id,
      studentId: followUps.studentId,
      studentName: users.name,
      studentEmail: users.email,
      adminId: followUps.adminId,
      title: followUps.title,
      notes: followUps.notes,
      status: followUps.status,
      priority: followUps.priority,
      dueDate: followUps.dueDate,
      completedAt: followUps.completedAt,
      createdAt: followUps.createdAt,
      updatedAt: followUps.updatedAt,
    })
    .from(followUps)
    .leftJoin(users, eq(followUps.studentId, users.id))
    .where(eq(followUps.status, status))
    .orderBy(desc(followUps.createdAt));
}

export async function updateFollowUpStatus(
  id: number,
  status: 'pending' | 'completed' | 'cancelled'
) {
  const db = await getDb();
  if (!db) return;
  
  const updateData: any = { status };
  if (status === 'completed') {
    updateData.completedAt = new Date();
  }
  
  await db
    .update(followUps)
    .set(updateData)
    .where(eq(followUps.id, id));
}

export async function updateFollowUp(
  id: number,
  data: {
    title?: string;
    notes?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }
) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(followUps)
    .set(data)
    .where(eq(followUps.id, id));
}

export async function deleteFollowUp(id: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(followUps).where(eq(followUps.id, id));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(users).orderBy(desc(users.createdAt));
}


// Assignment Submissions
export async function createAssignmentSubmission(data: {
  userId: number;
  lessonId: number;
  fileUrl: string;
  fileName: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db
    .insert(assignmentSubmissions)
    .values({
      ...data,
      status: 'submitted',
      submittedAt: new Date(),
    });
  
  return result.insertId;
}

export async function getAssignmentSubmissionsByUser(userId: number, lessonId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(assignmentSubmissions.userId, userId)];
  if (lessonId) {
    conditions.push(eq(assignmentSubmissions.lessonId, lessonId));
  }
  
  return db
    .select({
      submission: assignmentSubmissions,
      lesson: lessons,
      course: courses,
      grade: assignmentGrades,
    })
    .from(assignmentSubmissions)
    .leftJoin(lessons, eq(assignmentSubmissions.lessonId, lessons.id))
    .leftJoin(courses, eq(lessons.courseId, courses.id))
    .leftJoin(assignmentGrades, eq(assignmentSubmissions.id, assignmentGrades.submissionId))
    .where(and(...conditions))
    .orderBy(desc(assignmentSubmissions.submittedAt));
}

export async function getAllAssignmentSubmissions(filters?: {
  lessonId?: number;
  courseId?: number;
  status?: 'submitted' | 'graded' | 'returned';
}) {
  const db = await getDb();
  if (!db) return [];
  
  const baseQuery = db
    .select({
      submission: assignmentSubmissions,
      student: users,
      lesson: lessons,
      course: courses,
      grade: assignmentGrades,
    })
    .from(assignmentSubmissions)
    .leftJoin(users, eq(assignmentSubmissions.userId, users.id))
    .leftJoin(lessons, eq(assignmentSubmissions.lessonId, lessons.id))
    .leftJoin(courses, eq(lessons.courseId, courses.id))
    .leftJoin(assignmentGrades, eq(assignmentSubmissions.id, assignmentGrades.submissionId));
  
  // Apply filters if provided
  const conditions = [];
  if (filters?.lessonId) conditions.push(eq(assignmentSubmissions.lessonId, filters.lessonId));
  if (filters?.courseId) conditions.push(eq(courses.id, filters.courseId));
  if (filters?.status) conditions.push(eq(assignmentSubmissions.status, filters.status));
  
  const finalQuery = conditions.length > 0 
    ? baseQuery.where(and(...conditions))
    : baseQuery;
  
  return finalQuery.orderBy(desc(assignmentSubmissions.submittedAt));
}

export async function gradeAssignment(data: {
  submissionId: number;
  grade: number;
  feedback: string;
  rubricScores?: Record<string, number>;
  gradedBy: number;
}) {
  const db = await getDb();
  if (!db) return;
  
  // Check if grade exists
  const existing = await db
    .select()
    .from(assignmentGrades)
    .where(eq(assignmentGrades.submissionId, data.submissionId))
    .limit(1);
  
  if (existing.length > 0) {
    // Update existing grade
    await db
      .update(assignmentGrades)
      .set({
        grade: data.grade,
        feedback: data.feedback,
        rubricScores: data.rubricScores ? JSON.stringify(data.rubricScores) : null,
        gradedBy: data.gradedBy,
        gradedAt: new Date(),
      })
      .where(eq(assignmentGrades.submissionId, data.submissionId));
  } else {
    // Insert new grade
    await db.insert(assignmentGrades).values({
      submissionId: data.submissionId,
      grade: data.grade,
      feedback: data.feedback,
      rubricScores: data.rubricScores ? JSON.stringify(data.rubricScores) : null,
      gradedBy: data.gradedBy,
      gradedAt: new Date(),
    });
  }
  
  // Update submission status
  await db
    .update(assignmentSubmissions)
    .set({ status: 'graded' })
    .where(eq(assignmentSubmissions.id, data.submissionId));
}
