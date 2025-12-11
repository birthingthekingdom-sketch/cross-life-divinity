import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { sql } from "drizzle-orm";
import * as email from "./email";
import * as scheduler from "./scheduler";
import * as analytics from "./analytics";
import * as csvExport from "./csv-export";
import * as prerequisites from "./prerequisites";
import * as courseRecommendations from "./course-recommendations";
import { authRouter } from "./auth-router";
import { assignmentRouter } from "./assignment-router";
import { paymentRouter } from './payment-router';
import { toggleAdminRouter } from './toggle-admin-router';
import { bundlesRouter } from './bundles-router';
import { cohortRouter } from './cohort-router';
import { bundlePurchaseRouter } from './bundle-purchase-router';
import { emailNotificationRouter } from './email-notification-router';
import { adminEmailRouter } from './admin-email-router';
import * as referralSystem from './referral-router.js';
import { blogRouter } from './blog-router';
import { chatRouter } from './chat-router';
import { affiliateRouter } from './affiliate-router';
import { chaplaincyRouter } from './chaplaincy-router';
import { TRPCError } from "@trpc/server";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  bundles: bundlesRouter,
  cohorts: cohortRouter,
  bundlePurchase: bundlePurchaseRouter,
  emailNotifications: emailNotificationRouter,
  blog: blogRouter,
  chat: chatRouter,
  affiliate: affiliateRouter,
  chaplaincy: chaplaincyRouter,

  // Merge custom auth router with existing auth endpoints
  auth: router({
    ...authRouter._def.procedures,
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    
    enroll: protectedProcedure
      .input(z.object({ accessCode: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const code = await db.getAccessCodeByCode(input.accessCode);
        
        if (!code || !code.isActive) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid or inactive access code' });
        }
        
        // Get courses linked to this access code
        const accessCodeCourses = await db.getAccessCodeCourses(code.id);
        
        if (accessCodeCourses.length === 0) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'This access code is not linked to any courses' });
        }
        
        // Enroll user in all courses linked to this access code
        let newEnrollments = 0;
        for (const acc of accessCodeCourses) {
          const alreadyEnrolled = await db.isUserEnrolledInCourse(ctx.user.id, acc.courseId);
          if (!alreadyEnrolled) {
            await db.createCourseEnrollment({
              userId: ctx.user.id,
              courseId: acc.courseId,
              accessCodeId: code.id
            });
            newEnrollments++;
          }
        }
        
        // Also create legacy enrollment record for compatibility
        const existing = await db.getUserEnrollment(ctx.user.id);
        if (!existing) {
          await db.createEnrollment({
            userId: ctx.user.id,
            accessCodeId: code.id
          });
        }
        
        // Send enrollment emails for new enrollments
        const emailNotifications = await import('./email-notifications');
        for (const acc of accessCodeCourses) {
          const course = await db.getCourseById(acc.courseId);
          if (course) {
            try {
              await emailNotifications.sendEnrollmentEmail(ctx.user.id, course.title, course.id);
            } catch (error) {
              console.error(`Failed to send enrollment email for course ${course.id}:`, error);
            }
          }
        }
        
        return { 
          success: true, 
          coursesEnrolled: accessCodeCourses.length,
          newEnrollments
        };
      }),
    
    checkEnrollment: protectedProcedure.query(async ({ ctx }) => {
      const enrollment = await db.getUserEnrollment(ctx.user.id);
      return { enrolled: !!enrollment };
    }),
  }),

  courses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      // Return all courses with enrollment status
      const allCourses = await db.getAllCourses();
      
      if (ctx.user.role === 'admin') {
        return allCourses.map(course => ({ ...course, isEnrolled: true }));
      }
      
      // For students, check enrollment status for each course
      const coursesWithEnrollment = await Promise.all(
        allCourses.map(async (course) => {
          const isEnrolled = await db.isUserEnrolledInCourse(ctx.user.id, course.id);
          return { ...course, isEnrolled };
        })
      );
      
      return coursesWithEnrollment;
    }),
    
    listAll: publicProcedure.query(async () => {
      return db.getAllCourses();
    }),
    
    checkEnrollment: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role === 'admin') {
          return { enrolled: true };
        }
        const enrolled = await db.isUserEnrolledInCourse(ctx.user.id, input.courseId);
        return { enrolled };
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const course = await db.getCourseById(input.id);
        if (!course) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' });
        }
        
        // Get prerequisites for this course
        const coursePrerequisites = await prerequisites.getCoursePrerequisites(input.id);
        
        // Check if user can enroll (has completed prerequisites)
        const prerequisiteCheck = await prerequisites.checkPrerequisites(ctx.user.id, input.id);
        
        return {
          ...course,
          prerequisites: coursePrerequisites,
          canEnroll: prerequisiteCheck.canEnroll,
          missingPrerequisites: prerequisiteCheck.missingPrerequisites
        };
      }),
    
    checkPrerequisites: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input, ctx }) => {
        return prerequisites.checkPrerequisites(ctx.user.id, input.courseId);
      }),
    
    getRecommendations: protectedProcedure
      .query(async ({ ctx }) => {
        return courseRecommendations.getCourseRecommendations(ctx.user.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        code: z.string(),
        title: z.string(),
        description: z.string().optional(),
        colorTheme: z.string(),
        totalLessons: z.number().default(0),
        displayOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await db.createCourse(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        colorTheme: z.string().optional(),
        totalLessons: z.number().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateCourse(id, updates);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCourse(input.id);
        return { success: true };
      }),
  }),

  lessons: router({
    getByCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return db.getLessonsByCourseId(input.courseId);
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const lesson = await db.getLessonById(input.id);
        if (!lesson) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Lesson not found' });
        }
        return lesson;
      }),
    
    create: adminProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string(),
        content: z.string(),
        lessonOrder: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.createLesson(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        lessonOrder: z.number().optional(),
        assignment: z.string().optional(),
        assignmentDueDate: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, assignmentDueDate, ...updates } = input;
        const updateData: any = { ...updates };
        if (assignmentDueDate !== undefined) {
          updateData.assignmentDueDate = assignmentDueDate ? new Date(assignmentDueDate) : null;
        }
        await db.updateLesson(id, updateData);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteLesson(input.id);
        return { success: true };
      }),
  }),

  quizzes: router({
    getByLesson: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input }) => {
        return db.getQuizQuestionsByLessonId(input.lessonId);
      }),
    
    submitQuiz: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        courseId: z.number(),
        answers: z.array(z.object({
          questionId: z.number(),
          answer: z.string(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const questions = await db.getQuizQuestionsByLessonId(input.lessonId);
        
        let correctCount = 0;
        const results = [];
        
        for (const answer of input.answers) {
          const question = questions.find(q => q.id === answer.questionId);
          if (!question) continue;
          
          const isCorrect = answer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          if (isCorrect) correctCount++;
          
          await db.saveQuizAnswer({
            userId: ctx.user.id,
            questionId: answer.questionId,
            answer: answer.answer,
            isCorrect,
          });
          
          results.push({
            questionId: answer.questionId,
            isCorrect,
            correctAnswer: question.correctAnswer,
          });
        }
        
        const score = correctCount;
        const totalQuestions = questions.length;
        const passed = (score / totalQuestions) >= 0.7; // 70% passing grade
        
        await db.createQuizSubmission({
          userId: ctx.user.id,
          lessonId: input.lessonId,
          score,
          totalQuestions,
          passed,
        });
        
        if (passed) {
          await db.markLessonComplete(ctx.user.id, input.courseId, input.lessonId);
        }
        
        return {
          score,
          totalQuestions,
          passed,
          results,
        };
      }),
    
    getSubmission: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getQuizSubmissionByUserAndLesson(ctx.user.id, input.lessonId);
      }),
    
    submitAnswer: protectedProcedure
      .input(z.object({
        questionId: z.number(),
        answer: z.string(),
        isCorrect: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.saveQuizAnswer({
          userId: ctx.user.id,
          questionId: input.questionId,
          answer: input.answer,
          isCorrect: input.isCorrect,
        });
        return { success: true };
      }),
    
    create: adminProcedure
      .input(z.object({
        lessonId: z.number(),
        question: z.string(),
        questionType: z.enum(['multiple_choice', 'true_false', 'short_answer']),
        options: z.string().optional(),
        correctAnswer: z.string(),
        questionOrder: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.createQuizQuestion(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        question: z.string().optional(),
        questionType: z.enum(['multiple_choice', 'true_false', 'short_answer']).optional(),
        options: z.string().optional(),
        correctAnswer: z.string().optional(),
        questionOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateQuizQuestion(id, updates);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteQuizQuestion(input.id);
        return { success: true };
      }),
  }),

  progress: router({
    getByCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getUserProgress(ctx.user.id, input.courseId);
      }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getAllUserProgress(ctx.user.id);
    }),
    
    markComplete: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        lessonId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.markLessonComplete(ctx.user.id, input.courseId, input.lessonId);
        return { success: true };
      }),
    
    getStudentProgress: protectedProcedure.query(async ({ ctx }) => {
      return db.getStudentProgressSummary(ctx.user.id);
    }),
  }),

  certificates: router({
    checkEligibility: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const existing = await db.getCertificateByUserAndCourse(ctx.user.id, input.courseId);
        if (existing) {
          return { eligible: true, certificate: existing };
        }
        
        const course = await db.getCourseById(input.courseId);
        if (!course) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' });
        }
        
        const lessons = await db.getLessonsByCourseId(input.courseId);
        const progress = await db.getUserProgress(ctx.user.id, input.courseId);
        
        const completedLessons = progress.filter(p => p.completed).length;
        const eligible = completedLessons === lessons.length && lessons.length > 0;
        
        return { eligible, certificate: null };
      }),
    
    generate: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getCertificateByUserAndCourse(ctx.user.id, input.courseId);
        if (existing) {
          return { certificateNumber: existing.certificateNumber };
        }
        
        const course = await db.getCourseById(input.courseId);
        if (!course) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' });
        }
        
        const lessons = await db.getLessonsByCourseId(input.courseId);
        const progress = await db.getUserProgress(ctx.user.id, input.courseId);
        const completedLessons = progress.filter(p => p.completed).length;
        
        if (completedLessons !== lessons.length || lessons.length === 0) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Course not completed' });
        }
        
        // Generate CPD-format certificate number
        const timestamp = Date.now();
        const certificateNumber = `CPD-CLSD-${new Date().getFullYear()}-${course.code}-${timestamp.toString().slice(-5)}`;
        
        // Generate unique verification token
        const verificationToken = `${timestamp}-${ctx.user.id}-${input.courseId}-${Math.random().toString(36).substring(2, 15)}`;
        
        await db.createCertificate({
          userId: ctx.user.id,
          courseId: input.courseId,
          certificateNumber,
          verificationToken,
          cpdHours: course.cpdHours || 0,
          completionDate: new Date(),
        });
        
        return { certificateNumber };
      }),
    
    getMyCertificates: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserCertificates(ctx.user.id);
    }),
    
    verify: publicProcedure
      .input(z.object({ verificationToken: z.string() }))
      .query(async ({ input }) => {
        const cert = await db.getCertificateByVerificationToken(input.verificationToken);
        if (!cert) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Certificate not found' });
        }
        
        const user = await db.getUserById(cert.userId);
        const course = await db.getCourseById(cert.courseId);
        
        return {
          certificateNumber: cert.certificateNumber,
          studentName: user?.name || user?.email || 'Student',
          courseTitle: course?.title || 'Unknown Course',
          courseCode: course?.code || 'N/A',
          cpdHours: cert.cpdHours,
          issuedAt: cert.issuedAt,
          completionDate: cert.completionDate,
        };
      }),
  }),

  admin: router({
    getAllUsers: adminProcedure.query(async () => {
      return db.getAllUsers();
    }),
    
    getAccessCodes: adminProcedure.query(async () => {
      return db.getAllAccessCodes();
    }),
    
    createAccessCode: adminProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ input }) => {
        await db.createAccessCode({ code: input.code, isActive: true });
        return { success: true };
      }),
    
    toggleAccessCode: adminProcedure
      .input(z.object({ id: z.number(), isActive: z.boolean() }))
      .mutation(async ({ input }) => {
        await db.updateAccessCode(input.id, input.isActive);
        return { success: true };
      }),
    
    getAccessCodeCourses: adminProcedure
      .input(z.object({ accessCodeId: z.number() }))
      .query(async ({ input }) => {
        return db.getAccessCodeCourses(input.accessCodeId);
      }),
    
    assignCoursesToAccessCode: adminProcedure
      .input(z.object({ 
        accessCodeId: z.number(), 
        courseIds: z.array(z.number()) 
      }))
      .mutation(async ({ input }) => {
        // Delete existing assignments
        await db.deleteAccessCodeCourses(input.accessCodeId);
        
        // Create new assignments
        for (const courseId of input.courseIds) {
          await db.createAccessCodeCourse({
            accessCodeId: input.accessCodeId,
            courseId
          });
        }
        
        return { success: true };
      }),
    
    updateCourseCPDHours: adminProcedure
      .input(z.object({ courseId: z.number(), cpdHours: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateCourseCPDHours(input.courseId, input.cpdHours);
        return { success: true };
      }),
    
    updateCourseVideo: adminProcedure
      .input(z.object({ courseId: z.number(), introVideoUrl: z.string() }))
      .mutation(async ({ input }) => {
        await db.updateCourseVideoUrl(input.courseId, input.introVideoUrl);
        return { success: true };
      }),
    
    bulkImportLessons: adminProcedure
      .input(z.object({
        courseId: z.number(),
        lessons: z.array(z.object({
          title: z.string(),
          content: z.string(),
          order: z.number()
        }))
      }))
      .mutation(async ({ input }) => {
        let successCount = 0;
        const errors: string[] = [];
        
        for (const lessonData of input.lessons) {
          try {
            await db.createLesson({
              courseId: input.courseId,
              title: lessonData.title,
              content: lessonData.content,
              lessonOrder: lessonData.order
            });
            successCount++;
          } catch (error) {
            errors.push(`Failed to import "${lessonData.title}": ${error}`);
          }
        }
        
        // Update course total lessons count
        const allLessons = await db.getLessonsByCourseId(input.courseId);
        await db.updateCourse(input.courseId, { totalLessons: allLessons.length });
        
        return { 
          success: errors.length === 0,
          imported: successCount,
          errors
          };
      }),
    
    setEmailConfig: adminProcedure
      .input(z.object({
        host: z.string(),
        port: z.number(),
        secure: z.boolean(),
        user: z.string(),
        pass: z.string()
      }))
      .mutation(async ({ input }) => {
        const { setEmailConfig } = await import('./email');
        setEmailConfig(input);
        return { success: true };
      }),
    
    getEmailConfig: adminProcedure
      .query(async () => {
        const { getEmailConfig } = await import('./email');
        const config = getEmailConfig();
        if (!config) return null;
        // Don't send password to client
        return {
          host: config.host,
          port: config.port,
          secure: config.secure,
          user: config.user,
          configured: true
        };
      }),
    
    testEmail: adminProcedure
      .input(z.object({ to: z.string().email() }))
      .mutation(async ({ input }) => {
        const { sendWelcomeEmail } = await import('./email');
        const success = await sendWelcomeEmail(input.to, 'Test User', ['Test Course']);
        if (!success) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to send test email. Check your email configuration.' });
        }
        return { success: true };
      }),
    
    // Webinar management
    getAllWebinars: adminProcedure.query(async () => {
      return db.getAllWebinars();
    }),
    
    createWebinar: adminProcedure
      .input(z.object({
        courseId: z.number().optional(),
        title: z.string(),
        description: z.string().optional(),
        meetingUrl: z.string().url(),
        scheduledAt: z.string(),
        duration: z.number().optional()
      }))
      .mutation(async ({ input }) => {
        const id = await db.createWebinar({
          ...input,
          scheduledAt: new Date(input.scheduledAt)
        });
        return { success: true, id };
      }),
    
    updateWebinar: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        meetingUrl: z.string().url().optional(),
        scheduledAt: z.string().optional(),
        duration: z.number().optional(),
        recordingUrl: z.string().url().optional(),
        isActive: z.boolean().optional()
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.scheduledAt) {
          updateData.scheduledAt = new Date(data.scheduledAt);
        }
        await db.updateWebinar(id, updateData);
        return { success: true };
      }),
    
    deleteWebinar: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteWebinar(input.id);
        return { success: true };
      }),
    
    // Follow-Up Management
    createFollowUp: adminProcedure
      .input(z.object({
        studentId: z.number(),
        title: z.string(),
        notes: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        dueDate: z.string().optional()
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createFollowUp({
          ...input,
          adminId: ctx.user.id,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined
        });
        
        // Send email notification
        const student = await db.getUserById(input.studentId);
        if (student && ctx.user.email) {
          await email.sendFollowUpCreatedEmail(
            ctx.user.email,
            ctx.user.name || 'Admin',
            student.name || student.email || 'Student',
            input.title,
            input.dueDate ? new Date(input.dueDate) : undefined
          );
        }
        
        return { success: true, id };
      }),
    
    getAllFollowUps: adminProcedure.query(async () => {
      return db.getAllFollowUps();
    }),
    
    getFollowUpsByStatus: adminProcedure
      .input(z.object({ status: z.enum(['pending', 'completed', 'cancelled']) }))
      .query(async ({ input }) => {
        return db.getFollowUpsByStatus(input.status);
      }),
    
    getFollowUpsByStudent: adminProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ input }) => {
        return db.getFollowUpsByStudent(input.studentId);
      }),
    
    updateFollowUpStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'completed', 'cancelled'])
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateFollowUpStatus(input.id, input.status);
        
        // Send email notification when completed
        if (input.status === 'completed') {
          const followUp = await db.getFollowUpById(input.id);
          if (followUp && ctx.user.email) {
            const student = await db.getUserById(followUp.studentId);
            if (student) {
              await email.sendFollowUpCompletedEmail(
                ctx.user.email,
                ctx.user.name || 'Admin',
                student.name || student.email || 'Student',
                followUp.title
              );
            }
          }
        }
        
        return { success: true };
      }),
    
    updateFollowUp: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        notes: z.string().optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        dueDate: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const { id, dueDate, ...rest } = input;
        await db.updateFollowUp(id, {
          ...rest,
          dueDate: dueDate ? new Date(dueDate) : undefined
        });
        return { success: true };
      }),
    
    deleteFollowUp: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteFollowUp(input.id);
        return { success: true };
      }),
    
    triggerFollowUpReminders: adminProcedure
      .mutation(async () => {
        const result = await scheduler.triggerFollowUpReminders();
        return result;
      }),
    
    getActivityMetrics: adminProcedure.query(async () => {
      return analytics.getStudentActivityMetrics();
    }),
    
    getStudentEngagement: adminProcedure.query(async () => {
      return analytics.getStudentEngagementData();
    }),
    
    getCourseCompletionTrends: adminProcedure.query(async () => {
      return analytics.getCourseCompletionTrends();
    }),
    
    exportStudentEngagementCSV: adminProcedure.query(async () => {
      const csv = await csvExport.exportStudentEngagementCSV();
      return { csv };
    }),
    
    exportCourseCompletionCSV: adminProcedure.query(async () => {
      const csv = await csvExport.exportCourseCompletionCSV();
      return { csv };
    }),
    
    exportActivityMetricsCSV: adminProcedure.query(async () => {
      const csv = await csvExport.exportActivityMetricsCSV();
      return { csv };
    }),
    
    exportComprehensiveAnalyticsCSV: adminProcedure.query(async () => {
      const csv = await csvExport.exportComprehensiveAnalyticsCSV();
      return { csv };
    }),
    
    // Payment & Subscription Management
    getAllSubscriptions: adminProcedure.query(async () => {
      return db.getAllSubscriptions();
    }),
    
    getAllPurchases: adminProcedure.query(async () => {
      return db.getAllCoursePurchases();
    }),
    
    // Email Notification Management
    getEmailStats: adminProcedure.query(async () => {
      const dbConn = await db.getDb();
      if (!dbConn) throw new Error("Database not available");

      const result: any = await dbConn.execute(
        sql`SELECT 
              status,
              COUNT(*) as count
            FROM email_notifications
            GROUP BY status`
      );

      const rows = Array.isArray(result) ? result : result.rows || [];
      const stats = {
        sent: 0,
        pending: 0,
        failed: 0,
      };

      rows.forEach((row: any) => {
        if (row.status === 'sent') stats.sent = Number(row.count);
        if (row.status === 'pending') stats.pending = Number(row.count);
        if (row.status === 'failed') stats.failed = Number(row.count);
      });

      return stats;
    }),
    
    getEmailNotifications: adminProcedure
      .input(
        z.object({
          status: z.enum(['sent', 'pending', 'failed']).optional(),
          limit: z.number().default(50),
        })
      )
      .query(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) throw new Error("Database not available");

        let query = `SELECT 
            en.*,
            u.email as userEmail,
            u.name as userName
          FROM email_notifications en
          LEFT JOIN users u ON en.userId = u.id`;
        
        if (input.status) {
          query += ` WHERE en.status = '${input.status}'`;
        }
        
        query += ` ORDER BY en.createdAt DESC LIMIT ${input.limit}`;

        const result: any = await dbConn.execute(sql.raw(query));

        return Array.isArray(result) ? result : result.rows || [];
      }),
    
    retryFailedEmail: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) throw new Error("Database not available");

        // Get the notification
        const result: any = await dbConn.execute(
          sql`SELECT en.*, u.email as userEmail
              FROM email_notifications en
              LEFT JOIN users u ON en.userId = u.id
              WHERE en.id = ${input.id} AND en.status = 'failed'`
        );

        const notification = Array.isArray(result) ? result[0] : result.rows?.[0];

        if (!notification) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed email not found' });
        }

        // Try to send the email
        try {
          const { getEmailConfig } = await import('./email');
          const nodemailer = await import('nodemailer');
          const emailConfig = getEmailConfig();
          if (!emailConfig) {
            throw new Error("Email not configured");
          }

          const transporter = nodemailer.default.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: {
              user: emailConfig.user,
              pass: emailConfig.pass,
            },
          });

          await transporter.sendMail({
            from: emailConfig.user,
            to: notification.userEmail,
            subject: notification.subject,
            html: notification.content,
          });

          // Mark as sent
          await dbConn.execute(
            sql`UPDATE email_notifications 
                SET status = 'sent', sentAt = NOW() 
                WHERE id = ${input.id}`
          );

          return { success: true };
        } catch (error: any) {
          console.error("Failed to retry email:", error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
      }),
    
    // Student Email Export
    getStudentEmails: adminProcedure
      .input(z.object({
        filterType: z.string(),
        courseId: z.number().optional()
      }))
      .query(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) return [];
        
        let query;
        
        if (input.filterType === 'all') {
          // Get all enrolled students
          query = sql`
            SELECT DISTINCT
              u.id,
              u.name,
              u.email,
              MIN(ce.enrolledAt) as enrolledAt,
              COUNT(DISTINCT ce.courseId) as courseCount
            FROM users u
            INNER JOIN course_enrollments ce ON u.id = ce.userId
            WHERE u.role = 'student'
            GROUP BY u.id, u.name, u.email
            ORDER BY u.name
          `;
        } else if (input.filterType === 'course' && input.courseId) {
          // Get students enrolled in specific course
          query = sql`
            SELECT DISTINCT
              u.id,
              u.name,
              u.email,
              ce.enrolledAt,
              COUNT(DISTINCT ce2.courseId) as courseCount
            FROM users u
            INNER JOIN course_enrollments ce ON u.id = ce.userId
            LEFT JOIN course_enrollments ce2 ON u.id = ce2.userId
            WHERE u.role = 'student' AND ce.courseId = ${input.courseId}
            GROUP BY u.id, u.name, u.email, ce.enrolledAt
            ORDER BY u.name
          `;
        } else {
          // Active students (logged in within last 30 days)
          query = sql`
            SELECT DISTINCT
              u.id,
              u.name,
              u.email,
              MIN(ce.enrolledAt) as enrolledAt,
              COUNT(DISTINCT ce.courseId) as courseCount
            FROM users u
            INNER JOIN course_enrollments ce ON u.id = ce.userId
            WHERE u.role = 'student' 
              AND u.lastSignedIn >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY u.id, u.name, u.email
            ORDER BY u.name
          `;
        }
        
        const result: any = await dbConn.execute(query);
        return Array.isArray(result) ? result : result.rows || [];
      }),
  }),
  
  webinars: router({
    getAll: protectedProcedure.query(async () => {
      return db.getAllWebinars();
    }),
    
    getUpcoming: protectedProcedure.query(async () => {
      return db.getUpcomingWebinars();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getWebinarById(input.id);
      }),
    
    getByCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return db.getWebinarsByCourse(input.courseId);
      }),
  }),

  forum: router({
    getTopicsByCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input, ctx }) => {
        // Check if user is enrolled in the course
        const isEnrolled = await db.isUserEnrolledInCourse(ctx.user.id, input.courseId);
        if (!isEnrolled) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You must be enrolled in this course to view discussions' });
        }
        
        const topics = await db.getForumTopicsByCourse(input.courseId);
        
        // Fetch user info for each topic
        const topicsWithUsers = await Promise.all(
          topics.map(async (topic) => {
            const user = await db.getUserById(topic.userId);
            return {
              ...topic,
              author: user ? { name: user.name, email: user.email } : null
            };
          })
        );
        
        return topicsWithUsers;
      }),
    
    getTopic: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const topic = await db.getForumTopicById(input.id);
        if (!topic) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Topic not found' });
        }
        
        // Check if user is enrolled
        const isEnrolled = await db.isUserEnrolledInCourse(ctx.user.id, topic.courseId);
        if (!isEnrolled) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        const author = await db.getUserById(topic.userId);
        const replies = await db.getForumRepliesByTopic(input.id);
        
        // Fetch user info for each reply
        const repliesWithUsers = await Promise.all(
          replies.map(async (reply) => {
            const user = await db.getUserById(reply.userId);
            return {
              ...reply,
              author: user ? { name: user.name, email: user.email } : null
            };
          })
        );
        
        return {
          ...topic,
          author: author ? { name: author.name, email: author.email } : null,
          replies: repliesWithUsers
        };
      }),
    
    createTopic: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        title: z.string().min(1),
        content: z.string().min(1)
      }))
      .mutation(async ({ input, ctx }) => {
        // Check if user is enrolled
        const isEnrolled = await db.isUserEnrolledInCourse(ctx.user.id, input.courseId);
        if (!isEnrolled) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You must be enrolled to create topics' });
        }
        
        await db.createForumTopic({
          courseId: input.courseId,
          userId: ctx.user.id,
          title: input.title,
          content: input.content
        });
        
        return { success: true };
      }),
    
    createReply: protectedProcedure
      .input(z.object({
        topicId: z.number(),
        content: z.string().min(1)
      }))
      .mutation(async ({ input, ctx }) => {
        const topic = await db.getForumTopicById(input.topicId);
        if (!topic) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Topic not found' });
        }
        
        // Check if user is enrolled
        const isEnrolled = await db.isUserEnrolledInCourse(ctx.user.id, topic.courseId);
        if (!isEnrolled) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        await db.createForumReply({
          topicId: input.topicId,
          userId: ctx.user.id,
          content: input.content
        });
        
        return { success: true };
      }),
    
    deleteTopic: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const topic = await db.getForumTopicById(input.id);
        if (!topic) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Topic not found' });
        }
        
        // Only author or admin can delete
        if (topic.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
        
        await db.deleteForumTopic(input.id);
        return { success: true };
      }),
    
    deleteReply: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // For simplicity, only admins can delete replies
        // You could extend this to allow users to delete their own replies
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        
        await db.deleteForumReply(input.id);
        return { success: true };
      }),
  }),

  // Assignment submission and grading
  assignments: assignmentRouter,

  // Payment and subscription management
   payment: paymentRouter,
  toggleAdmin: toggleAdminRouter,

  // Referral System
  referrals: router({
    getMyReferralCode: protectedProcedure.query(async ({ ctx }) => {
      const code = await referralSystem.getReferralCode(ctx.user.id);
      const baseUrl = process.env.VITE_FRONTEND_URL || 'http://localhost:3000';
      return { code, referralUrl: `${baseUrl}/register?ref=${code}` };
    }),

    getMyCredits: protectedProcedure.query(async ({ ctx }) => {
      return await referralSystem.getUserCredits(ctx.user.id);
    }),

    getMyReferrals: protectedProcedure.query(async ({ ctx }) => {
      return await referralSystem.getUserReferrals(ctx.user.id);
    }),

    trackReferral: protectedProcedure
      .input(z.object({ referralCode: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await referralSystem.trackReferral(input.referralCode, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
