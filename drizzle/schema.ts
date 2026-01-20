import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, timestamp, index, varchar, text, mysqlEnum, json, foreignKey, decimal, datetime, date, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const accessCodeCourses = mysqlTable("access_code_courses", {
	id: int().autoincrement().notNull(),
	accessCodeId: int().notNull(),
	courseId: int().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const accessCodes = mysqlTable("access_codes", {
	id: int().autoincrement().notNull(),
	code: varchar({ length: 64 }).notNull(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("access_codes_code_unique").on(table.code),
]);

export const affiliateClicks = mysqlTable("affiliate_clicks", {
	id: int().autoincrement().notNull(),
	affiliateId: int().notNull(),
	affiliateCode: varchar({ length: 50 }).notNull(),
	ipAddress: varchar({ length: 45 }),
	userAgent: text(),
	referrerUrl: text(),
	landingPage: text(),
	clickedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const affiliateCommissions = mysqlTable("affiliate_commissions", {
	id: int().autoincrement().notNull(),
	affiliateId: int().notNull(),
	referralId: int().notNull(),
	orderId: varchar({ length: 255 }),
	amount: int().notNull(),
	type: mysqlEnum(['subscription','course','bundle']).notNull(),
	status: mysqlEnum(['pending','approved','paid','cancelled']).default('pending').notNull(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	approvedAt: timestamp({ mode: 'string' }),
	paidAt: timestamp({ mode: 'string' }),
});

export const affiliatePayouts = mysqlTable("affiliate_payouts", {
	id: int().autoincrement().notNull(),
	affiliateId: int().notNull(),
	amount: int().notNull(),
	payoutMethod: mysqlEnum(['paypal','bank_transfer','check']).notNull(),
	payoutEmail: varchar({ length: 320 }),
	status: mysqlEnum(['pending','processing','completed','failed']).default('pending').notNull(),
	transactionId: varchar({ length: 255 }),
	notes: text(),
	requestedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	processedAt: timestamp({ mode: 'string' }),
	completedAt: timestamp({ mode: 'string' }),
});

export const affiliateReferrals = mysqlTable("affiliate_referrals", {
	id: int().autoincrement().notNull(),
	affiliateId: int().notNull(),
	referredUserId: int().notNull(),
	referralCode: varchar({ length: 50 }).notNull(),
	status: mysqlEnum(['pending','converted','cancelled']).default('pending').notNull(),
	referralDate: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	conversionDate: timestamp({ mode: 'string' }),
	ipAddress: varchar({ length: 45 }),
	userAgent: text(),
});

export const affiliates = mysqlTable("affiliates", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	affiliateCode: varchar({ length: 50 }).notNull(),
	status: mysqlEnum(['pending','active','suspended','inactive']).default('pending').notNull(),
	subscriptionCommissionRate: int().default(25).notNull(),
	courseCommissionRate: int().default(35).notNull(),
	payoutEmail: varchar({ length: 320 }),
	payoutMethod: mysqlEnum(['paypal','bank_transfer','check']).default('paypal'),
	totalEarnings: int().default(0).notNull(),
	pendingEarnings: int().default(0).notNull(),
	paidEarnings: int().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	approvedAt: timestamp({ mode: 'string' }),
	organizationName: varchar({ length: 255 }),
	organizationType: mysqlEnum(['church','ministry','nonprofit','individual','other']),
	website: varchar({ length: 500 }),
	description: text(),
	expectedReferrals: varchar({ length: 255 }),
	paymentDetails: text(),
	rejectionReason: text(),
	suspensionReason: text(),
},
(table) => [
	index("affiliateCode").on(table.affiliateCode),
]);

export const assignmentGrades = mysqlTable("assignment_grades", {
	id: int().autoincrement().notNull(),
	submissionId: int().notNull(),
	grade: int().notNull(),
	feedback: text().notNull(),
	rubricScores: text(),
	gradedBy: int().notNull(),
	gradedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const assignmentSubmissions = mysqlTable("assignment_submissions", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	lessonId: int().notNull(),
	fileUrl: text().notNull(),
	fileName: varchar({ length: 255 }).notNull(),
	fileSize: int(),
	status: mysqlEnum(['submitted','graded','returned']).default('submitted').notNull(),
	submittedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	notes: text(),
});

export const assignmentVersions = mysqlTable("assignment_versions", {
	id: int().autoincrement().notNull(),
	submissionId: int().notNull(),
	versionNumber: int().notNull(),
	fileUrl: text().notNull(),
	fileName: varchar({ length: 255 }).notNull(),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const bridgeAcademyPracticeAnswers = mysqlTable("bridge_academy_practice_answers", {
	id: int().autoincrement().notNull(),
	attemptId: int().notNull(),
	questionId: int().notNull(),
	userAnswer: text().notNull(),
	isCorrect: tinyint().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const bridgeAcademyPracticeAttempts = mysqlTable("bridge_academy_practice_attempts", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	topicId: int().notNull(),
	courseId: int().notNull(),
	attemptNumber: int().notNull(),
	score: int().notNull(),
	totalQuestions: int().notNull(),
	percentage: int().notNull(),
	difficulty: mysqlEnum(['easy','medium','hard']).default('medium').notNull(),
	submittedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const bridgeAcademyPracticeQuestions = mysqlTable("bridge_academy_practice_questions", {
	id: int().autoincrement().notNull(),
	topicId: int().notNull(),
	question: text().notNull(),
	questionType: mysqlEnum(['multiple_choice','true_false','short_answer']).notNull(),
	options: json(),
	correctAnswer: text().notNull(),
	explanation: text(),
	difficulty: mysqlEnum(['easy','medium','hard']).default('medium').notNull(),
	variationGroup: varchar({ length: 64 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const bridgeAcademyQuizAnswers = mysqlTable("bridge_academy_quiz_answers", {
	id: int().autoincrement().notNull(),
	submissionId: int().notNull().references(() => bridgeAcademyQuizSubmissions.id, { onDelete: "cascade" } ),
	questionId: int().notNull().references(() => bridgeAcademyQuizQuestions.id, { onDelete: "cascade" } ),
	studentAnswer: varchar({ length: 255 }),
	isCorrect: tinyint(),
	pointsEarned: int(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const bridgeAcademyQuizQuestions = mysqlTable("bridge_academy_quiz_questions", {
	id: int().autoincrement().notNull(),
	topicId: int().notNull().references(() => bridgeAcademyTopics.id, { onDelete: "cascade" } ),
	questionNumber: int().notNull(),
	questionText: text().notNull(),
	questionType: varchar({ length: 50 }).notNull(),
	options: json(),
	correctAnswer: varchar({ length: 255 }),
	explanation: text(),
	difficultyLevel: varchar({ length: 20 }).default('medium'),
	estimatedTime: int().default(2),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const bridgeAcademyQuizSubmissions = mysqlTable("bridge_academy_quiz_submissions", {
	id: int().autoincrement().notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade" } ),
	topicId: int().notNull().references(() => bridgeAcademyTopics.id, { onDelete: "cascade" } ),
	startedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
	submittedAt: timestamp({ mode: 'string' }),
	score: int(),
	percentageScore: decimal({ precision: 5, scale: 2 }),
	timeSpent: int(),
	status: varchar({ length: 50 }).default('in_progress'),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const bridgeAcademyStudentDifficultyProfiles = mysqlTable("bridge_academy_student_difficulty_profiles", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	topicId: int().notNull(),
	courseId: int().notNull(),
	currentDifficulty: mysqlEnum(['easy','medium','hard']).default('easy').notNull(),
	averageScore: int().default(0).notNull(),
	attemptCount: int().default(0).notNull(),
	bestScore: int().default(0).notNull(),
	improvementTrend: int().default(0),
	lastAttemptAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const bridgeAcademyTopics = mysqlTable("bridge_academy_topics", {
	id: int().autoincrement().notNull(),
	subjectCode: varchar({ length: 50 }).notNull(),
	subjectName: varchar({ length: 255 }).notNull(),
	topicNumber: int().notNull(),
	topicName: varchar({ length: 255 }).notNull(),
	description: text(),
	estimatedHours: int().default(2),
	difficultyLevel: varchar({ length: 20 }).default('medium'),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("unique_topic").on(table.subjectCode, table.topicNumber),
]);

export const bundleCourses = mysqlTable("bundle_courses", {
	id: int().autoincrement().notNull(),
	bundleId: int().notNull(),
	courseId: int().notNull(),
	courseOrder: int().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const bundlePurchases = mysqlTable("bundle_purchases", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	bundleId: int().notNull(),
	stripePaymentIntentId: varchar({ length: 255 }),
	amount: int().notNull(),
	currency: varchar({ length: 10 }).default('usd'),
	status: mysqlEnum(['pending','completed','failed','refunded']).default('pending'),
	purchasedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
},
(table) => [
	index("idx_user_bundle").on(table.userId, table.bundleId),
	index("idx_stripe_payment").on(table.stripePaymentIntentId),
]);

export const certificates = mysqlTable("certificates", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	courseId: int().notNull(),
	certificateNumber: varchar({ length: 50 }).notNull(),
	issuedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	completionDate: timestamp({ mode: 'string' }).notNull(),
	verificationToken: varchar({ length: 64 }).notNull(),
	cpdHours: int().notNull(),
},
(table) => [
	index("certificates_certificateNumber_unique").on(table.certificateNumber),
	index("certificates_verificationToken_unique").on(table.verificationToken),
]);

export const chaplaincyApplications = mysqlTable("chaplaincy_applications", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	fullName: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 320 }).notNull(),
	phone: varchar({ length: 50 }).notNull(),
	address: text().notNull(),
	dateOfBirth: varchar({ length: 20 }).notNull(),
	currentMinistryRole: varchar({ length: 255 }),
	yearsInMinistry: int().notNull(),
	ordainedStatus: mysqlEnum(['ordained','licensed','not_ordained']).notNull(),
	denominationAffiliation: varchar({ length: 255 }),
	ministryExperienceDescription: text().notNull(),
	chaplaincyInterest: mysqlEnum("chaplaincy_interest", ['healthcare','military','correctional','corporate','educational','other']).notNull(),
	chaplaincyInterestOther: varchar("chaplaincy_interest_other", { length: 255 }),
	motivationStatement: text().notNull(),
	reference1Name: varchar({ length: 255 }).notNull(),
	reference1Email: varchar({ length: 320 }).notNull(),
	reference1Phone: varchar({ length: 50 }).notNull(),
	reference1Relationship: varchar({ length: 255 }).notNull(),
	reference2Name: varchar({ length: 255 }).notNull(),
	reference2Email: varchar({ length: 320 }).notNull(),
	reference2Phone: varchar({ length: 50 }).notNull(),
	reference2Relationship: varchar({ length: 255 }).notNull(),
	backgroundCheckConsent: tinyint().notNull(),
	backgroundCheckCompleted: tinyint().default(0).notNull(),
	backgroundCheckDate: timestamp({ mode: 'string' }),
	backgroundCheckStatus: mysqlEnum(['pending','clear','review_required','failed']).default('pending'),
	status: mysqlEnum(['pending','under_review','approved','rejected']).default('pending').notNull(),
	reviewedBy: int(),
	reviewNotes: text(),
	rejectionReason: text(),
	submittedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	reviewedAt: timestamp({ mode: 'string' }),
	approvedAt: timestamp({ mode: 'string' }),
});

export const chatMessages = mysqlTable("chat_messages", {
	id: int().autoincrement().notNull(),
	sessionId: int().notNull(),
	senderId: int(),
	senderType: mysqlEnum(['visitor','admin']).notNull(),
	message: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const chatSessions = mysqlTable("chat_sessions", {
	id: int().autoincrement().notNull(),
	visitorName: varchar({ length: 255 }),
	visitorEmail: varchar({ length: 320 }),
	userId: int(),
	status: mysqlEnum(['active','closed']).default('active').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const courseBundles = mysqlTable("course_bundles", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	icon: varchar({ length: 64 }).default('BookOpen'),
	colorTheme: varchar({ length: 32 }).default('blue'),
	displayOrder: int().default(0).notNull(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	price: int().default(0),
	discountPercentage: int().default(0),
	stripeProductId: varchar({ length: 255 }),
	stripePriceId: varchar({ length: 255 }),
});

export const courseEnrollments = mysqlTable("course_enrollments", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	courseId: int().notNull(),
	accessCodeId: int().notNull(),
	enrolledAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	idVerificationDeadlineAt: timestamp({ mode: 'string' }),
	idVerificationCompletedAt: timestamp({ mode: 'string' }),
	accessSuspendedAt: timestamp({ mode: 'string' }),
},
(table) => [
	index("idx_enrollments_user_course").on(table.userId, table.courseId),
]);

export const coursePrerequisites = mysqlTable("course_prerequisites", {
	id: int().autoincrement().notNull(),
	courseId: int().notNull().references(() => courses.id, { onDelete: "cascade" } ),
	prerequisiteCourseId: int().notNull().references(() => courses.id, { onDelete: "cascade" } ),
	required: tinyint().default(1),
	createdAt: datetime({ mode: 'string'}).default('CURRENT_TIMESTAMP'),
},
(table) => [
	index("unique_prerequisite").on(table.courseId, table.prerequisiteCourseId),
	index("idx_prerequisites_course").on(table.courseId),
]);

export const coursePreviews = mysqlTable("course_previews", {
	id: int().autoincrement().notNull(),
	courseId: int().notNull(),
	previewLessonId: int().notNull(),
	studyGuideUrl: text(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("course_previews_courseId_unique").on(table.courseId),
]);

export const coursePurchases = mysqlTable("course_purchases", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	courseId: int().notNull(),
	stripeCustomerId: varchar({ length: 255 }),
	stripePaymentIntentId: varchar({ length: 255 }),
	amount: int().notNull(),
	status: mysqlEnum(['pending','completed','failed','refunded']).default('pending').notNull(),
	accessCodeId: int(),
	purchasedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("stripePaymentIntentId").on(table.stripePaymentIntentId),
]);

export const courses = mysqlTable("courses", {
	id: int().autoincrement().notNull(),
	code: varchar({ length: 32 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	colorTheme: varchar({ length: 32 }).notNull(),
	totalLessons: int().default(0).notNull(),
	displayOrder: int().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	cpdHours: int().default(0).notNull(),
	introVideoUrl: text(),
	price: int().default(89).notNull(),
	requiresBackgroundCheck: tinyint().default(0).notNull(),
	backgroundCheckFee: int().default(0).notNull(),
	courseType: mysqlEnum(['theological', 'ged']).default('theological').notNull(),
},
(table) => [
	index("courses_code_unique").on(table.code),
]);

export const emailNotifications = mysqlTable("email_notifications", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	type: mysqlEnum(['enrollment','lesson_completion','certificate','assignment_deadline','progress_summary','forum_reply']).notNull(),
	subject: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	status: mysqlEnum(['pending','sent','failed']).default('pending'),
	sentAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
	metadata: json(),
},
(table) => [
	index("idx_user_status").on(table.userId, table.status),
	index("idx_type_status").on(table.type, table.status),
	index("idx_created").on(table.createdAt),
]);

export const emailPreferences = mysqlTable("email_preferences", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	enrollmentEmails: tinyint().default(1),
	lessonCompletionEmails: tinyint().default(1),
	certificateEmails: tinyint().default(1),
	assignmentDeadlineEmails: tinyint().default(1),
	progressSummaryEmails: tinyint().default(1),
	forumReplyEmails: tinyint().default(1),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("idx_user").on(table.userId),
	index("userId").on(table.userId),
]);

export const emailSettings = mysqlTable("email_settings", {
	id: int().autoincrement().notNull(),
	smtpHost: varchar({ length: 255 }).notNull(),
	smtpPort: int().notNull(),
	smtpUser: varchar({ length: 255 }).notNull(),
	smtpPassword: varchar({ length: 255 }).notNull(),
	fromEmail: varchar({ length: 320 }).notNull(),
	fromName: varchar({ length: 255 }).notNull(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const enrollments = mysqlTable("enrollments", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	accessCodeId: int().notNull(),
	enrolledAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const followUps = mysqlTable("follow_ups", {
	id: int().autoincrement().notNull(),
	studentId: int().notNull(),
	adminId: int().notNull(),
	title: varchar({ length: 255 }).notNull(),
	notes: text(),
	status: mysqlEnum(['pending','completed','cancelled']).default('pending').notNull(),
	priority: mysqlEnum(['low','medium','high']).default('medium').notNull(),
	dueDate: timestamp({ mode: 'string' }),
	completedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const forumReplies = mysqlTable("forum_replies", {
	id: int().autoincrement().notNull(),
	topicId: int().notNull(),
	userId: int().notNull(),
	content: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const forumTopics = mysqlTable("forum_topics", {
	id: int().autoincrement().notNull(),
	courseId: int().notNull(),
	userId: int().notNull(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	isPinned: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const learningPathCertificates = mysqlTable("learning_path_certificates", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	learningPathId: int().notNull(),
	certificateNumber: varchar({ length: 100 }).notNull(),
	verificationToken: varchar({ length: 255 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	completionDate: date({ mode: 'string' }).notNull(),
	issuedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
},
(table) => [
	index("idx_user_path").on(table.userId, table.learningPathId),
	index("idx_verification").on(table.verificationToken),
	index("certificateNumber").on(table.certificateNumber),
	index("verificationToken").on(table.verificationToken),
]);

export const learningPathCourses = mysqlTable("learning_path_courses", {
	id: int().autoincrement().notNull(),
	pathId: int().notNull().references(() => learningPaths.id, { onDelete: "cascade" } ),
	courseId: int().notNull().references(() => courses.id, { onDelete: "cascade" } ),
	orderIndex: int().default(0).notNull(),
	createdAt: datetime({ mode: 'string'}).default('CURRENT_TIMESTAMP'),
},
(table) => [
	index("unique_path_course").on(table.pathId, table.courseId),
]);

export const learningPathEnrollments = mysqlTable("learning_path_enrollments", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	learningPathId: int().notNull(),
	enrolledAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	completedAt: timestamp({ mode: 'string' }),
	isActive: tinyint().default(1).notNull(),
},
(table) => [
	index("learning_path_enrollments_unique").on(table.userId, table.learningPathId),
]);

export const learningPaths = mysqlTable("learning_paths", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	goal: text(),
	duration: varchar({ length: 64 }),
	level: mysqlEnum(['beginner','intermediate','advanced']).default('beginner'),
	icon: varchar({ length: 64 }).default('Map'),
	colorTheme: varchar({ length: 32 }).default('purple'),
	displayOrder: int().default(0).notNull(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

	export const lessons = mysqlTable("lessons", {
		id: int().autoincrement().notNull(),
		courseId: int().notNull(),
		title: varchar({ length: 255 }).notNull(),
		content: text().notNull(),
		scripture: text(),
		lessonOrder: int().notNull(),
		createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
		updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
		videoUrl: text(),
		readingMaterial: text(),
		assignment: text(),
		assignmentDueDate: timestamp({ mode: 'string' }),
	});

export const loginHistory = mysqlTable("login_history", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	ipAddress: varchar({ length: 45 }),
	userAgent: text(),
	loginMethod: varchar({ length: 64 }).default('email'),
	success: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const pathCourses = mysqlTable("path_courses", {
	id: int().autoincrement().notNull(),
	pathId: int().notNull(),
	courseId: int().notNull(),
	courseOrder: int().notNull(),
	isRequired: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const paymentPlanTransactions = mysqlTable("payment_plan_transactions", {
	id: int().autoincrement().notNull(),
	planId: int().notNull().references(() => paymentPlans.id, { onDelete: "cascade" } ),
	amount: int().notNull(),
	status: mysqlEnum(['pending','completed','failed']).default('pending').notNull(),
	paymentDate: datetime({ mode: 'string'}).notNull(),
	stripePaymentIntentId: varchar({ length: 255 }),
	failureReason: text(),
	createdAt: datetime({ mode: 'string'}).default('CURRENT_TIMESTAMP'),
	updatedAt: datetime({ mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => [
	index("idx_planId").on(table.planId),
	index("idx_status").on(table.status),
	index("idx_paymentDate").on(table.paymentDate),
]);

export const paymentPlans = mysqlTable("payment_plans", {
	id: int().autoincrement().notNull(),
	userId: int().notNull().references(() => users.id, { onDelete: "cascade" } ),
	bundleId: int().notNull().references(() => courseBundles.id, { onDelete: "cascade" } ),
	totalAmount: int().notNull(),
	monthlyAmount: int().notNull(),
	paymentsTotal: int().default(6).notNull(),
	paymentsCompleted: int().default(0).notNull(),
	status: mysqlEnum(['active','completed','cancelled','failed']).default('active').notNull(),
	startDate: datetime({ mode: 'string'}).notNull(),
	nextPaymentDate: datetime({ mode: 'string'}).notNull(),
	stripeCustomerId: varchar({ length: 255 }),
	stripePaymentMethodId: varchar({ length: 255 }),
	createdAt: datetime({ mode: 'string'}).default('CURRENT_TIMESTAMP'),
	updatedAt: datetime({ mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => [
	index("idx_userId").on(table.userId),
	index("idx_status").on(table.status),
	index("idx_nextPaymentDate").on(table.nextPaymentDate),
]);

export const peerReviewFeedback = mysqlTable("peer_review_feedback", {
	id: int().autoincrement().notNull(),
	peerReviewId: int().notNull(),
	strengthsComment: text().notNull(),
	improvementComment: text().notNull(),
	theologicalDepthRating: int().notNull(),
	contentQualityRating: int().notNull(),
	writingQualityRating: int().notNull(),
	overallComment: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const peerReviews = mysqlTable("peer_reviews", {
	id: int().autoincrement().notNull(),
	submissionId: int().notNull(),
	reviewerId: int().notNull(),
	status: mysqlEnum(['pending','completed']).default('pending').notNull(),
	assignedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	completedAt: timestamp({ mode: 'string' }),
});

export const pendingWrittenAnswers = mysqlTable("pending_written_answers", {
	id: int().autoincrement().notNull(),
	quizSubmissionId: int().notNull(),
	userId: int().notNull(),
	lessonId: int().notNull(),
	courseId: int().notNull(),
	questionId: int().notNull(),
	questionText: text().notNull(),
	studentAnswer: text().notNull(),
	status: mysqlEnum(['pending','graded','skipped']).default('pending').notNull(),
	adminScore: int(),
	adminFeedback: text(),
	gradedAt: timestamp({ mode: 'string' }),
	gradedBy: int(),
	submittedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const plagiarismReports = mysqlTable("plagiarism_reports", {
	id: int().autoincrement().notNull(),
	submissionId: int().notNull(),
	similarityScore: int().notNull(),
	status: mysqlEnum(['pending','completed','failed']).default('pending').notNull(),
	reportData: text(),
	checkedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const previewQuizAttempts = mysqlTable("preview_quiz_attempts", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	courseId: int().notNull(),
	lessonId: int().notNull(),
	score: int().notNull(),
	totalQuestions: int().notNull(),
	attemptedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const quizAnswers = mysqlTable("quiz_answers", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	questionId: int().notNull(),
	answer: text().notNull(),
	isCorrect: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const quizQuestions = mysqlTable("quiz_questions", {
	id: int().autoincrement().notNull(),
	lessonId: int().notNull(),
	question: text().notNull(),
	questionType: mysqlEnum(['multiple_choice','true_false','short_answer']).notNull(),
	options: text(),
	correctAnswer: text().notNull(),
	questionOrder: int().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const quizSubmissions = mysqlTable("quiz_submissions", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	lessonId: int().notNull(),
	score: int().notNull(),
	totalQuestions: int().notNull(),
	passed: tinyint().notNull(),
	submittedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const stripeCustomers = mysqlTable("stripe_customers", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	stripeCustomerId: varchar({ length: 255 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("userId").on(table.userId),
	index("stripeCustomerId").on(table.stripeCustomerId),
]);

export const studentProgress = mysqlTable("student_progress", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	courseId: int().notNull(),
	lessonId: int().notNull(),
	completed: tinyint().default(0).notNull(),
	completedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const subscriptions = mysqlTable("subscriptions", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	stripeCustomerId: varchar({ length: 255 }).notNull(),
	stripeSubscriptionId: varchar({ length: 255 }).notNull(),
	status: mysqlEnum(['active','canceled','past_due','unpaid','suspended']).default('active').notNull(),
	currentPeriodStart: timestamp({ mode: 'string' }).notNull(),
	currentPeriodEnd: timestamp({ mode: 'string' }).notNull(),
	cancelAtPeriodEnd: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	failedPaymentAttempts: int().default(0).notNull(),
	lastFailedPaymentDate: timestamp({ mode: 'string' }),
	nextRetryDate: timestamp({ mode: 'string' }),
	accessSuspendedAt: timestamp({ mode: 'string' }),
	lastPaymentFailureReason: text(),
},
(table) => [
	index("stripeSubscriptionId").on(table.stripeSubscriptionId),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	openId: varchar({ length: 64 }),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar({ length: 64 }).default('email'),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	lastSignedIn: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	password: varchar({ length: 255 }),
	passwordResetToken: varchar({ length: 255 }),
	passwordResetExpiry: timestamp({ mode: 'string' }),
	emailVerified: tinyint().default(0).notNull(),
	emailVerificationToken: varchar({ length: 255 }),
	emailVerificationExpiry: timestamp({ mode: 'string' }),
	stripeCustomerId: varchar({ length: 255 }),
},
(table) => [
	index("users_openId_unique").on(table.openId),
	index("users_email_unique").on(table.email),
]);

export const webinarRegistrations = mysqlTable("webinar_registrations", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	webinarId: int().notNull(),
	registeredAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	attended: tinyint().default(0).notNull(),
	attendedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const webinars = mysqlTable("webinars", {
	id: int().autoincrement().notNull(),
	courseId: int(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	meetingUrl: text().notNull(),
	scheduledAt: timestamp({ mode: 'string' }).notNull(),
	duration: int().default(60).notNull(),
	recordingUrl: text(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});


export const bridgeAcademyEnrollments = mysqlTable("bridge_academy_enrollments", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	enrolledAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	status: mysqlEnum(['active', 'inactive', 'cancelled']).default('active').notNull(),
},
(table) => [
	index("userId").on(table.userId),
]);
