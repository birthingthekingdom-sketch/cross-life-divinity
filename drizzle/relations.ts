import { relations } from "drizzle-orm/relations";
import { bridgeAcademyQuizSubmissions, bridgeAcademyQuizAnswers, bridgeAcademyQuizQuestions, bridgeAcademyTopics, users, courses, coursePrerequisites, learningPaths, learningPathCourses, paymentPlans, paymentPlanTransactions, courseBundles } from "./schema";

export const bridgeAcademyQuizAnswersRelations = relations(bridgeAcademyQuizAnswers, ({one}) => ({
	bridgeAcademyQuizSubmission: one(bridgeAcademyQuizSubmissions, {
		fields: [bridgeAcademyQuizAnswers.submissionId],
		references: [bridgeAcademyQuizSubmissions.id]
	}),
	bridgeAcademyQuizQuestion: one(bridgeAcademyQuizQuestions, {
		fields: [bridgeAcademyQuizAnswers.questionId],
		references: [bridgeAcademyQuizQuestions.id]
	}),
}));

export const bridgeAcademyQuizSubmissionsRelations = relations(bridgeAcademyQuizSubmissions, ({one, many}) => ({
	bridgeAcademyQuizAnswers: many(bridgeAcademyQuizAnswers),
	user: one(users, {
		fields: [bridgeAcademyQuizSubmissions.userId],
		references: [users.id]
	}),
	bridgeAcademyTopic: one(bridgeAcademyTopics, {
		fields: [bridgeAcademyQuizSubmissions.topicId],
		references: [bridgeAcademyTopics.id]
	}),
}));

export const bridgeAcademyQuizQuestionsRelations = relations(bridgeAcademyQuizQuestions, ({one, many}) => ({
	bridgeAcademyQuizAnswers: many(bridgeAcademyQuizAnswers),
	bridgeAcademyTopic: one(bridgeAcademyTopics, {
		fields: [bridgeAcademyQuizQuestions.topicId],
		references: [bridgeAcademyTopics.id]
	}),
}));

export const bridgeAcademyTopicsRelations = relations(bridgeAcademyTopics, ({many}) => ({
	bridgeAcademyQuizQuestions: many(bridgeAcademyQuizQuestions),
	bridgeAcademyQuizSubmissions: many(bridgeAcademyQuizSubmissions),
}));

export const usersRelations = relations(users, ({many}) => ({
	bridgeAcademyQuizSubmissions: many(bridgeAcademyQuizSubmissions),
	paymentPlans: many(paymentPlans),
}));

export const coursePrerequisitesRelations = relations(coursePrerequisites, ({one}) => ({
	course_courseId: one(courses, {
		fields: [coursePrerequisites.courseId],
		references: [courses.id],
		relationName: "coursePrerequisites_courseId_courses_id"
	}),
	course_prerequisiteCourseId: one(courses, {
		fields: [coursePrerequisites.prerequisiteCourseId],
		references: [courses.id],
		relationName: "coursePrerequisites_prerequisiteCourseId_courses_id"
	}),
}));

export const coursesRelations = relations(courses, ({many}) => ({
	coursePrerequisites_courseId: many(coursePrerequisites, {
		relationName: "coursePrerequisites_courseId_courses_id"
	}),
	coursePrerequisites_prerequisiteCourseId: many(coursePrerequisites, {
		relationName: "coursePrerequisites_prerequisiteCourseId_courses_id"
	}),
	learningPathCourses: many(learningPathCourses),
}));

export const learningPathCoursesRelations = relations(learningPathCourses, ({one}) => ({
	learningPath: one(learningPaths, {
		fields: [learningPathCourses.pathId],
		references: [learningPaths.id]
	}),
	course: one(courses, {
		fields: [learningPathCourses.courseId],
		references: [courses.id]
	}),
}));

export const learningPathsRelations = relations(learningPaths, ({many}) => ({
	learningPathCourses: many(learningPathCourses),
}));

export const paymentPlanTransactionsRelations = relations(paymentPlanTransactions, ({one}) => ({
	paymentPlan: one(paymentPlans, {
		fields: [paymentPlanTransactions.planId],
		references: [paymentPlans.id]
	}),
}));

export const paymentPlansRelations = relations(paymentPlans, ({one, many}) => ({
	paymentPlanTransactions: many(paymentPlanTransactions),
	user: one(users, {
		fields: [paymentPlans.userId],
		references: [users.id]
	}),
	courseBundle: one(courseBundles, {
		fields: [paymentPlans.bundleId],
		references: [courseBundles.id]
	}),
}));

export const courseBundlesRelations = relations(courseBundles, ({many}) => ({
	paymentPlans: many(paymentPlans),
}));