import { eq, and, desc, inArray, sql, isNotNull } from "drizzle-orm";
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
  assignmentGrades, InsertAssignmentGrade, AssignmentGrade,
  peerReviews, InsertPeerReview, PeerReview,
  peerReviewFeedback, InsertPeerReviewFeedback, PeerReviewFeedback,
  assignmentVersions, InsertAssignmentVersion, AssignmentVersion,
  subscriptions, InsertSubscription, Subscription,
  coursePurchases, InsertCoursePurchase, CoursePurchase,
  stripeCustomers, InsertStripeCustomer, StripeCustomer,
  bridgeAcademyTopics, InsertBridgeAcademyTopic, BridgeAcademyTopic,
  bridgeAcademyQuizQuestions, InsertBridgeAcademyQuizQuestion, BridgeAcademyQuizQuestion,
  bridgeAcademyPracticeQuestions, InsertBridgeAcademyPracticeQuestion, BridgeAcademyPracticeQuestion,
  bridgeAcademyQuizSubmissions, BridgeAcademyQuizSubmission,
  bridgeAcademyPracticeAttempts, BridgeAcademyPracticeAttempt,
  bridgeAcademyStudentDifficultyProfiles, BridgeAcademyStudentDifficultyProfile,
  previewTracking, InsertPreviewTracking, PreviewTracking,
  qrCodes, InsertQrCode, QrCode,
  qrCodeScans, InsertQrCodeScan, QrCodeScan,
  emailTemplates, InsertEmailTemplate, EmailTemplate
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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
  
  // Return only theological courses, exclude GED
  return db.select().from(courses).where(eq(courses.courseType, 'theological')).orderBy(courses.displayOrder);
}

export async function getAllGedCourses(): Promise<Course[]> {
  const db = await getDb();
  if (!db) return [];
  
  // Return only GED courses
  return db.select().from(courses).where(eq(courses.courseType, 'ged')).orderBy(courses.displayOrder);
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0];
}

export async function getCourseByCode(code: string): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(courses).where(eq(courses.code, code)).limit(1);
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
  
  const [result] = await db.insert(lessons).values(lesson);
  return result.insertId;
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
  
  // Get all assignment submissions with grades
  const assignmentSubs = await db
    .select({
      submission: assignmentSubmissions,
      grade: assignmentGrades,
    })
    .from(assignmentSubmissions)
    .leftJoin(assignmentGrades, eq(assignmentSubmissions.id, assignmentGrades.submissionId))
    .where(eq(assignmentSubmissions.userId, userId));
  
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
  
  // Calculate assignment metrics
  const totalAssignments = assignmentSubs.length;
  const gradedAssignments = assignmentSubs.filter(a => a.grade !== null).length;
  const averageAssignmentGrade = gradedAssignments > 0
    ? assignmentSubs
        .filter(a => a.grade !== null)
        .reduce((sum, a) => sum + (a.grade?.grade || 0), 0) / gradedAssignments
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
    totalAssignments,
    gradedAssignments,
    averageAssignmentGrade,
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


// Peer Review functions
export async function assignPeerReviews(lessonId: number, submissionIds: number[]) {
  const db = await getDb();
  if (!db || submissionIds.length < 2) return [];

  // Get all user IDs from submissions
  const submissions = await db
    .select({ id: assignmentSubmissions.id, userId: assignmentSubmissions.userId })
    .from(assignmentSubmissions)
    .where(inArray(assignmentSubmissions.id, submissionIds));

  const assignments: InsertPeerReview[] = [];

  // Assign each student to review another student's work (circular assignment)
  for (let i = 0; i < submissions.length; i++) {
    const reviewer = submissions[i];
    const toReview = submissions[(i + 1) % submissions.length]; // Next student in circle

    // Don't assign self-review
    if (reviewer.userId !== toReview.userId) {
      assignments.push({
        submissionId: toReview.id,
        reviewerId: reviewer.userId,
        status: "pending",
      });
    }
  }

  if (assignments.length > 0) {
    await db.insert(peerReviews).values(assignments);
  }

  return assignments;
}

export async function getPeerReviewsForStudent(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const reviews = await db
    .select({
      review: peerReviews,
      submission: assignmentSubmissions,
      lesson: lessons,
      course: courses,
      feedback: peerReviewFeedback,
    })
    .from(peerReviews)
    .innerJoin(assignmentSubmissions, eq(peerReviews.submissionId, assignmentSubmissions.id))
    .innerJoin(lessons, eq(assignmentSubmissions.lessonId, lessons.id))
    .innerJoin(courses, eq(lessons.courseId, courses.id))
    .leftJoin(peerReviewFeedback, eq(peerReviews.id, peerReviewFeedback.peerReviewId))
    .where(eq(peerReviews.reviewerId, userId))
    .orderBy(desc(peerReviews.assignedAt));

  return reviews;
}

export async function getPeerReviewsForSubmission(submissionId: number) {
  const db = await getDb();
  if (!db) return [];

  const reviews = await db
    .select({
      review: peerReviews,
      feedback: peerReviewFeedback,
    })
    .from(peerReviews)
    .leftJoin(peerReviewFeedback, eq(peerReviews.id, peerReviewFeedback.peerReviewId))
    .where(eq(peerReviews.submissionId, submissionId))
    .orderBy(desc(peerReviews.assignedAt));

  return reviews;
}

export async function submitPeerReviewFeedback(data: {
  peerReviewId: number;
  strengthsComment: string;
  improvementComment: string;
  theologicalDepthRating: number;
  contentQualityRating: number;
  writingQualityRating: number;
  overallComment?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  // Insert feedback
  await db.insert(peerReviewFeedback).values(data);

  // Update peer review status to completed
  await db
    .update(peerReviews)
    .set({ 
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(peerReviews.id, data.peerReviewId));

  return { success: true };
}


// Assignment Resubmission functions
export async function createAssignmentVersion(data: {
  submissionId: number;
  fileUrl: string;
  fileName: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  // Get current version count for this submission
  const versions = await db
    .select()
    .from(assignmentVersions)
    .where(eq(assignmentVersions.submissionId, data.submissionId));

  const versionNumber = versions.length + 1;

  // Insert new version
  const [result] = await db
    .insert(assignmentVersions)
    .values({
      submissionId: data.submissionId,
      versionNumber,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      notes: data.notes,
    });

  // Update the main submission with latest file
  await db
    .update(assignmentSubmissions)
    .set({
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      updatedAt: new Date(),
    })
    .where(eq(assignmentSubmissions.id, data.submissionId));

  return { versionId: result.insertId, versionNumber };
}

export async function getAssignmentVersions(submissionId: number) {
  const db = await getDb();
  if (!db) return [];

  const versions = await db
    .select()
    .from(assignmentVersions)
    .where(eq(assignmentVersions.submissionId, submissionId))
    .orderBy(desc(assignmentVersions.versionNumber));

  return versions;
}


export async function getAssignmentSubmissionById(submissionId: number) {
  const db = await getDb();
  if (!db) return null;

  const [submission] = await db
    .select()
    .from(assignmentSubmissions)
    .where(eq(assignmentSubmissions.id, submissionId))
    .limit(1);

  return submission;
}


export async function getCalendarAssignments(userId: number) {
  const db = await getDb();
  if (!db) return [];

  // Get all lessons with assignments and due dates for courses the user is enrolled in
  const enrollments = await db
    .select({ courseId: courseEnrollments.courseId })
    .from(courseEnrollments)
    .where(eq(courseEnrollments.userId, userId));

  const courseIds = enrollments.map(e => e.courseId);
  if (courseIds.length === 0) return [];

  // Get all lessons with assignments and due dates
  const lessonsWithAssignments = await db
    .select({
      lessonId: lessons.id,
      lessonTitle: lessons.title,
      courseId: lessons.courseId,
      dueDate: lessons.assignmentDueDate,
    })
    .from(lessons)
    .where(
      and(
        inArray(lessons.courseId, courseIds),
        isNotNull(lessons.assignment),
        isNotNull(lessons.assignmentDueDate)
      )
    );

  // Get submission status for each lesson
  const result = [];
  for (const lesson of lessonsWithAssignments) {
    const course = await getCourseById(lesson.courseId);
    const submissions = await getAssignmentSubmissionsByUser(userId, lesson.lessonId);
    
    const submissionStatus = submissions.length > 0 ? submissions[0].submission.status : null;

    result.push({
      lessonId: lesson.lessonId,
      lessonTitle: lesson.lessonTitle,
      courseTitle: course?.title || 'Unknown Course',
      dueDate: lesson.dueDate,
      submissionStatus,
    });
  }

  return result;
}

// ============================================================================
// Payment & Subscription Functions
// ============================================================================

/**
 * Get or create Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(stripeCustomers)
    .where(eq(stripeCustomers.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  await db.insert(stripeCustomers).values({
    userId,
    stripeCustomerId,
  });

  // Fetch the newly created record
  const result = await db
    .select()
    .from(stripeCustomers)
    .where(eq(stripeCustomers.userId, userId))
    .limit(1);

  return result[0];
}

/**
 * Get Stripe customer by user ID
 */
export async function getStripeCustomerByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(stripeCustomers)
    .where(eq(stripeCustomers.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create subscription record
 */
export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(subscriptions).values(data);
  
  // Return the ID by fetching the newly created record
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, data.stripeSubscriptionId))
    .limit(1);
  
  return result[0]?.id || 0;
}

/**
 * Get active subscription for user
 */
export async function getActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active")
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update subscription
 */
export async function updateSubscription(id: number, data: Partial<Subscription>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set(data)
    .where(eq(subscriptions.id, id));
}

/**
 * Create course purchase record
 */
export async function createCoursePurchase(data: InsertCoursePurchase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(coursePurchases).values(data);
  
  // Return the ID by fetching the newly created record
  const result = await db
    .select()
    .from(coursePurchases)
    .where(
      and(
        eq(coursePurchases.userId, data.userId),
        eq(coursePurchases.courseId, data.courseId)
      )
    )
    .orderBy(coursePurchases.id)
    .limit(1);
  
  return result[0]?.id || 0;
}

/**
 * Get course purchases for user
 */
export async function getCoursePurchasesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(coursePurchases)
    .where(eq(coursePurchases.userId, userId));
}

/**
 * Get completed course purchases for user (for upgrade credit calculation)
 */
export async function getCompletedCoursePurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(coursePurchases)
    .where(
      and(
        eq(coursePurchases.userId, userId),
        eq(coursePurchases.status, "completed")
      )
    );
}

/**
 * Update course purchase
 */
export async function updateCoursePurchase(id: number, data: Partial<CoursePurchase>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(coursePurchases)
    .set(data)
    .where(eq(coursePurchases.id, id));
}

/**
 * Get subscription by Stripe subscription ID
 */
export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get course purchase by Stripe payment intent ID
 */
export async function getCoursePurchaseByPaymentIntent(stripePaymentIntentId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(coursePurchases)
    .where(eq(coursePurchases.stripePaymentIntentId, stripePaymentIntentId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all subscriptions (admin)
 */
export async function getAllSubscriptions() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
}

/**
 * Get all course purchases (admin)
 */
export async function getAllCoursePurchases() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(coursePurchases).orderBy(desc(coursePurchases.purchasedAt));
}



/**
 * Bridge Academy Functions
 */

/**
 * Get all Bridge Academy courses with their topics
 */
export async function getAllBridgeAcademyCourses() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(courses).where(sql`code LIKE 'GED-%'`).orderBy(courses.displayOrder);
}

/**
 * Get Bridge Academy topics for a course
 */
export async function getBridgeAcademyTopics(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(bridgeAcademyTopics).where(eq(bridgeAcademyTopics.courseId, courseId)).orderBy(bridgeAcademyTopics.topicOrder);
}

/**
 * Get Bridge Academy quiz questions for a topic
 */
export async function getBridgeAcademyQuizQuestions(topicId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(bridgeAcademyQuizQuestions).where(eq(bridgeAcademyQuizQuestions.topicId, topicId)).orderBy(bridgeAcademyQuizQuestions.questionOrder);
}

/**
 * Get Bridge Academy practice questions for a topic
 */
export async function getBridgeAcademyPracticeQuestions(topicId: number, limit?: number) {
  const db = await getDb();
  if (!db) return [];

  const questions = await db.select().from(bridgeAcademyPracticeQuestions).where(eq(bridgeAcademyPracticeQuestions.topicId, topicId));
  
  if (limit) {
    return questions.slice(0, limit);
  }

  return questions;
}

/**
 * Get Bridge Academy course with all topics and questions (for admin)
 */
export async function getBridgeAcademyCourseWithTopics(courseId: number) {
  const db = await getDb();
  if (!db) return null;

  const courseData = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!courseData || courseData.length === 0) return null;

  const topics = await db.select().from(bridgeAcademyTopics).where(eq(bridgeAcademyTopics.courseId, courseId)).orderBy(bridgeAcademyTopics.topicOrder);

  const topicsWithQuestions = await Promise.all(
    topics.map(async (topic) => {
      const quizQuestions = await db.select().from(bridgeAcademyQuizQuestions).where(eq(bridgeAcademyQuizQuestions.topicId, topic.id));
      const practiceQuestions = await db.select().from(bridgeAcademyPracticeQuestions).where(eq(bridgeAcademyPracticeQuestions.topicId, topic.id));
      
      return {
        ...topic,
        quizQuestions: quizQuestions.length,
        practiceQuestions: practiceQuestions.length,
      };
    })
  );

  return {
    ...courseData[0],
    topics: topicsWithQuestions,
  };
}

/**
 * Get all Bridge Academy courses with topics for admin dashboard
 */
export async function getAllBridgeAcademyCoursesWithTopics() {
  const db = await getDb();
  if (!db) return [];

  const coursesList = await db.select().from(courses).where(sql`code LIKE 'GED-%'`).orderBy(courses.displayOrder);

  return Promise.all(
    coursesList.map(async (course) => {
      const topics = await db.select().from(bridgeAcademyTopics).where(eq(bridgeAcademyTopics.courseId, course.id));
      
      const topicsWithStats = await Promise.all(
        topics.map(async (topic) => {
          const quizQuestions = await db.select().from(bridgeAcademyQuizQuestions).where(eq(bridgeAcademyQuizQuestions.topicId, topic.id));
          const practiceQuestions = await db.select().from(bridgeAcademyPracticeQuestions).where(eq(bridgeAcademyPracticeQuestions.topicId, topic.id));
          
          return {
            id: topic.id,
            title: topic.title,
            topicOrder: topic.topicOrder,
            quizQuestions: quizQuestions.length,
            practiceQuestions: practiceQuestions.length,
            totalQuestions: quizQuestions.length + practiceQuestions.length,
          };
        })
      );

      return {
        id: course.id,
        code: course.code,
        title: course.title,
        description: course.description,
        colorTheme: course.colorTheme,
        totalLessons: topics.length,
        topics: topicsWithStats,
        totalQuizQuestions: topicsWithStats.reduce((sum, t) => sum + t.quizQuestions, 0),
        totalPracticeQuestions: topicsWithStats.reduce((sum, t) => sum + t.practiceQuestions, 0),
      };
    })
  );
}


/**
 * Get student's Bridge Academy enrollment status
 */
export async function getStudentBridgeAcademyEnrollment(userId: number) {
  // TODO: bridgeAcademyEnrollments table not yet implemented
  return null;
}

/**
 * Get all available Bridge Academy courses for student
 */
export async function getAvailableBridgeAcademyCourses() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(courses)
    .where(sql`code LIKE 'GED-%'`)
    .orderBy(courses.displayOrder);
}

/**
 * Get student's progress for all Bridge Academy courses
 */
export async function getStudentBridgeAcademyProgress(userId: number) {
  // TODO: bridgeAcademyProgress table not yet implemented
  return [];
}

/**
 * Get student's progress for a specific course
 */
export async function getStudentCourseProgress(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Get course info
  const courseData = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId));
  
  if (!courseData.length) return null;
  
  const course = courseData[0];
  
  // Get all lessons in the course
  const courseLessons = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.displayOrder));
  
  // Get student progress for each lesson
  const progressData = await Promise.all(
    courseLessons.map(async (lesson) => {
      const progress = await db
        .select()
        .from(studentProgress)
        .where(
          and(
            eq(studentProgress.userId, userId),
            eq(studentProgress.lessonId, lesson.id)
          )
        );
      
      return {
        lesson,
        completed: progress.length > 0 && progress[0].completed === 1,
        completedAt: progress.length > 0 ? progress[0].completedAt : null,
      };
    })
  );
  
  const completedLessons = progressData.filter(p => p.completed).length;
  const totalLessons = courseLessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  return {
    course,
    totalLessons,
    completedLessons,
    progressPercentage,
    lessons: progressData,
  };
}

/**
 * Get student's quiz submissions for a course
 */
export async function getStudentCourseQuizSubmissions(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(bridgeAcademyQuizSubmissions)
    .where(and(
      eq(bridgeAcademyQuizSubmissions.userId, userId),
      eq(bridgeAcademyQuizSubmissions.courseId, courseId)
    ))
    .orderBy(desc(bridgeAcademyQuizSubmissions.submittedAt));
}

/**
 * Get student's quiz submissions for a specific topic
 */
export async function getStudentTopicQuizSubmissions(userId: number, topicId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(bridgeAcademyQuizSubmissions)
    .where(and(
      eq(bridgeAcademyQuizSubmissions.userId, userId),
      eq(bridgeAcademyQuizSubmissions.topicId, topicId)
    ))
    .orderBy(desc(bridgeAcademyQuizSubmissions.submittedAt));
}

/**
 * Get student's practice attempts for a course
 */
export async function getStudentCoursePracticeAttempts(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(bridgeAcademyPracticeAttempts)
    .where(and(
      eq(bridgeAcademyPracticeAttempts.userId, userId),
      eq(bridgeAcademyPracticeAttempts.courseId, courseId)
    ))
    .orderBy(desc(bridgeAcademyPracticeAttempts.submittedAt));
}

/**
 * Get student's practice attempts for a specific topic
 */
export async function getStudentTopicPracticeAttempts(userId: number, topicId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(bridgeAcademyPracticeAttempts)
    .where(and(
      eq(bridgeAcademyPracticeAttempts.userId, userId),
      eq(bridgeAcademyPracticeAttempts.topicId, topicId)
    ))
    .orderBy(desc(bridgeAcademyPracticeAttempts.submittedAt));
}

/**
 * Get student's difficulty profile for a topic
 */
export async function getStudentTopicDifficultyProfile(userId: number, topicId: number) {
  const db = await getDb();
  if (!db) return null;

  return db.select().from(bridgeAcademyStudentDifficultyProfiles)
    .where(and(
      eq(bridgeAcademyStudentDifficultyProfiles.userId, userId),
      eq(bridgeAcademyStudentDifficultyProfiles.topicId, topicId)
    ))
    .limit(1)
    .then(results => results[0] || null);
}

/**
 * Get student's certificates
 */
export async function getStudentBridgeAcademyCertificates(userId: number) {
  // TODO: bridgeAcademyCertificates table not yet implemented
  return [];
}

/**
 * Get comprehensive student dashboard data
 */
export async function getStudentBridgeAcademyDashboard(userId: number) {
  const db = await getDb();
  if (!db) return null;

  // Get enrollment status - TODO: bridgeAcademyEnrollments table not yet implemented
  const enrollment = null;

  // Get all courses
  const allCourses = await db.select().from(courses)
    .where(sql`code LIKE 'GED-%'`)
    .orderBy(courses.displayOrder);

  // Get progress for each course
  const coursesWithProgress = await Promise.all(
    allCourses.map(async (course) => {
      // TODO: bridgeAcademyProgress table not yet implemented
      const progress = null;

      // Get latest quiz submission
      const latestQuiz = await db.select().from(bridgeAcademyQuizSubmissions)
        .where(and(
          eq(bridgeAcademyQuizSubmissions.userId, userId),
          eq(bridgeAcademyQuizSubmissions.courseId, course.id)
        ))
        .orderBy(desc(bridgeAcademyQuizSubmissions.submittedAt))
        .limit(1)
        .then(results => results[0] || null);

      // Get topics for this course
      const topics = await db.select().from(bridgeAcademyTopics)
        .where(eq(bridgeAcademyTopics.courseId, course.id))
        .orderBy(bridgeAcademyTopics.topicOrder);

      return {
        course,
        progress,
        latestQuiz,
        topicCount: topics.length,
      };
    })
  );

  // Get recent quiz submissions
  const recentQuizzes = await db.select().from(bridgeAcademyQuizSubmissions)
    .where(eq(bridgeAcademyQuizSubmissions.userId, userId))
    .orderBy(desc(bridgeAcademyQuizSubmissions.submittedAt))
    .limit(10);

  // Get recent practice attempts
  const recentPractice = await db.select().from(bridgeAcademyPracticeAttempts)
    .where(eq(bridgeAcademyPracticeAttempts.userId, userId))
    .orderBy(desc(bridgeAcademyPracticeAttempts.submittedAt))
    .limit(10);

  // Get certificates - TODO: bridgeAcademyCertificates table not yet implemented
  const certificates: any[] = [];

  return {
    enrollment,
    coursesWithProgress,
    recentQuizzes,
    recentPractice,
    certificates,
  };
}


// ===== STUDENT MONITORING & ENROLLMENT TRACKING =====
// These functions are already implemented above:
// - getEnrolledStudents() at line 1940
// - getStudentEnrollments() at line 1976
// - getStudentCourseProgress() at line 1729 (updated implementation)
// - getStudentQuizProgress() - use getStudentCourseQuizSubmissions() instead
