import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  /** Hashed password for email/password authentication */
  password: varchar("password", { length: 255 }),
  /** Token for password reset flow */
  passwordResetToken: varchar("passwordResetToken", { length: 255 }),
  /** Expiry timestamp for password reset token */
  passwordResetExpiry: timestamp("passwordResetExpiry"),
  /** Email verification status */
  emailVerified: boolean("emailVerified").default(false).notNull(),
  /** Token for email verification */
  emailVerificationToken: varchar("emailVerificationToken", { length: 255 }),
  /** Expiry timestamp for email verification token */
  emailVerificationExpiry: timestamp("emailVerificationExpiry"),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }).default("email"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Access codes for student enrollment
 */
export const accessCodes = mysqlTable("access_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AccessCode = typeof accessCodes.$inferSelect;
export type InsertAccessCode = typeof accessCodes.$inferInsert;

/**
 * Junction table linking access codes to courses (many-to-many)
 */
export const accessCodeCourses = mysqlTable("access_code_courses", {
  id: int("id").autoincrement().primaryKey(),
  accessCodeId: int("accessCodeId").notNull(),
  courseId: int("courseId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccessCodeCourse = typeof accessCodeCourses.$inferSelect;
export type InsertAccessCodeCourse = typeof accessCodeCourses.$inferInsert;

/**
 * Student course enrollments
 */
export const courseEnrollments = mysqlTable("course_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  accessCodeId: int("accessCodeId").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
});

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;

/**
 * Courses table
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  colorTheme: varchar("colorTheme", { length: 32 }).notNull(),
  totalLessons: int("totalLessons").default(0).notNull(),
  cpdHours: int("cpdHours").default(0).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  introVideoUrl: text("introVideoUrl"), // YouTube, Vimeo, or direct video URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Lessons table
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  assignment: text("assignment"), // Written assignment prompt
  assignmentDueDate: timestamp("assignmentDueDate"), // Due date for assignment submission
  lessonOrder: int("lessonOrder").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Quiz questions table
 */
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull(),
  question: text("question").notNull(),
  questionType: mysqlEnum("questionType", ["multiple_choice", "true_false", "short_answer"]).notNull(),
  options: text("options"),
  correctAnswer: text("correctAnswer").notNull(),
  questionOrder: int("questionOrder").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

/**
 * Student progress tracking
 */
export const studentProgress = mysqlTable("student_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  lessonId: int("lessonId").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = typeof studentProgress.$inferInsert;

/**
 * Quiz answers submitted by students
 */
export const quizAnswers = mysqlTable("quiz_answers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  questionId: int("questionId").notNull(),
  answer: text("answer").notNull(),
  isCorrect: boolean("isCorrect").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type InsertQuizAnswer = typeof quizAnswers.$inferInsert;

/**
 * Student enrollments (tracks which students used which access codes)
 */
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  accessCodeId: int("accessCodeId").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

/**
 * Quiz submissions (complete quiz attempts with scores)
 */
export const quizSubmissions = mysqlTable("quiz_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  passed: boolean("passed").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type QuizSubmission = typeof quizSubmissions.$inferSelect;
export type InsertQuizSubmission = typeof quizSubmissions.$inferInsert;

/**
 * Course completion certificates
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  certificateNumber: varchar("certificateNumber", { length: 50 }).notNull().unique(),
  verificationToken: varchar("verificationToken", { length: 64 }).notNull().unique(),
  cpdHours: int("cpdHours").notNull(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  completionDate: timestamp("completionDate").notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Discussion forum topics (one per course)
 */
export const forumTopics = mysqlTable("forum_topics", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isPinned: boolean("isPinned").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ForumTopic = typeof forumTopics.$inferSelect;
export type InsertForumTopic = typeof forumTopics.$inferInsert;

/**
 * Discussion forum replies
 */
export const forumReplies = mysqlTable("forum_replies", {
  id: int("id").autoincrement().primaryKey(),
  topicId: int("topicId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = typeof forumReplies.$inferInsert;

/**
 * Live webinars/online sessions
 */
export const webinars = mysqlTable("webinars", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId"), // Optional: link to specific course, null for general webinars
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  meetingUrl: text("meetingUrl").notNull(), // Zoom, Google Meet, or other meeting link
  scheduledAt: timestamp("scheduledAt").notNull(), // When the webinar is scheduled
  duration: int("duration").default(60).notNull(), // Duration in minutes
  recordingUrl: text("recordingUrl"), // Link to recording after webinar ends
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Webinar = typeof webinars.$inferSelect;
export type InsertWebinar = typeof webinars.$inferInsert;

/**
 * Student follow-ups for tracking engagement and outreach
 */
export const followUps = mysqlTable("follow_ups", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(), // User ID of the student
  adminId: int("adminId").notNull(), // User ID of the admin creating the follow-up
  title: varchar("title", { length: 255 }).notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FollowUp = typeof followUps.$inferSelect;
export type InsertFollowUp = typeof followUps.$inferInsert;

/**
 * Assignment submissions from students
 */
export const assignmentSubmissions = mysqlTable("assignment_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  fileUrl: text("fileUrl").notNull(), // URL to uploaded file (PDF/Word)
  fileName: varchar("fileName", { length: 255 }).notNull(),
  notes: text("notes"), // Optional student notes
  status: mysqlEnum("status", ["submitted", "graded", "returned"]).default("submitted").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type InsertAssignmentSubmission = typeof assignmentSubmissions.$inferInsert;

/**
 * Grades and feedback for assignment submissions
 */
export const assignmentGrades = mysqlTable("assignment_grades", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull(),
  grade: int("grade").notNull(), // 0-100
  feedback: text("feedback").notNull(), // Detailed feedback from grader
  rubricScores: text("rubricScores"), // JSON string of rubric scores
  gradedBy: int("gradedBy").notNull(), // Admin user ID who graded
  gradedAt: timestamp("gradedAt").defaultNow().notNull(),
});

export type AssignmentGrade = typeof assignmentGrades.$inferSelect;
export type InsertAssignmentGrade = typeof assignmentGrades.$inferInsert;


/**
 * Peer review assignments - tracks which student reviews which submission
 */
export const peerReviews = mysqlTable("peer_reviews", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull(), // The submission being reviewed
  reviewerId: int("reviewerId").notNull(), // Student assigned to review
  status: mysqlEnum("status", ["pending", "completed"]).default("pending").notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type PeerReview = typeof peerReviews.$inferSelect;
export type InsertPeerReview = typeof peerReviews.$inferInsert;

/**
 * Peer review feedback from students
 */
export const peerReviewFeedback = mysqlTable("peer_review_feedback", {
  id: int("id").autoincrement().primaryKey(),
  peerReviewId: int("peerReviewId").notNull(), // Links to peer_reviews table
  strengthsComment: text("strengthsComment").notNull(), // What the student did well
  improvementComment: text("improvementComment").notNull(), // Areas for improvement
  theologicalDepthRating: int("theologicalDepthRating").notNull(), // 1-5 rating
  contentQualityRating: int("contentQualityRating").notNull(), // 1-5 rating
  writingQualityRating: int("writingQualityRating").notNull(), // 1-5 rating
  overallComment: text("overallComment"), // Optional overall feedback
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PeerReviewFeedback = typeof peerReviewFeedback.$inferSelect;
export type InsertPeerReviewFeedback = typeof peerReviewFeedback.$inferInsert;


/**
 * Assignment submission versions for tracking revisions
 */
export const assignmentVersions = mysqlTable("assignment_versions", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull(), // Original submission ID
  versionNumber: int("versionNumber").notNull(), // 1, 2, 3, etc.
  fileUrl: text("fileUrl").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  notes: text("notes"), // Student notes about this revision
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssignmentVersion = typeof assignmentVersions.$inferSelect;
export type InsertAssignmentVersion = typeof assignmentVersions.$inferInsert;


/**
 * Plagiarism detection reports
 */
export const plagiarismReports = mysqlTable("plagiarism_reports", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull(),
  similarityScore: int("similarityScore").notNull(), // 0-100 percentage
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  reportData: text("reportData"), // JSON string with detailed results
  checkedAt: timestamp("checkedAt").defaultNow().notNull(),
});

export type PlagiarismReport = typeof plagiarismReports.$inferSelect;
export type InsertPlagiarismReport = typeof plagiarismReports.$inferInsert;


/**
 * User subscriptions for all-access plan
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull().unique(),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "unpaid"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Individual course purchases
 */
export const coursePurchases = mysqlTable("course_purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).unique(),
  amount: int("amount").notNull(), // Amount in cents
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  accessCodeId: int("accessCodeId"), // Generated access code for this purchase
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type CoursePurchase = typeof coursePurchases.$inferSelect;
export type InsertCoursePurchase = typeof coursePurchases.$inferInsert;

/**
 * Stripe customer mapping
 */
export const stripeCustomers = mysqlTable("stripe_customers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StripeCustomer = typeof stripeCustomers.$inferSelect;
export type InsertStripeCustomer = typeof stripeCustomers.$inferInsert;
