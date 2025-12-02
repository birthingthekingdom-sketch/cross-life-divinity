import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
      // Admins see all courses, students see only enrolled courses
      if (ctx.user.role === 'admin') {
        return db.getAllCourses();
      }
      return db.getEnrolledCourses(ctx.user.id);
    }),
    
    listAll: adminProcedure.query(async () => {
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
      .query(async ({ input }) => {
        const course = await db.getCourseById(input.id);
        if (!course) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' });
        }
        return course;
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
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateLesson(id, updates);
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
        
        const certificateNumber = `CLSD-${course.code}-${Date.now()}-${ctx.user.id}`;
        
        await db.createCertificate({
          userId: ctx.user.id,
          courseId: input.courseId,
          certificateNumber,
          completionDate: new Date(),
        });
        
        return { certificateNumber };
      }),
    
    getMyCertificates: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserCertificates(ctx.user.id);
    }),
  }),

  admin: router({
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
});

export type AppRouter = typeof appRouter;
