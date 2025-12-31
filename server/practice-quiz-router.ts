import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, desc } from "drizzle-orm";
import mysql from "mysql2/promise";

// Database connection
let db: any = null;

async function getDb() {
  if (!db && process.env.DATABASE_URL) {
    db = drizzle(process.env.DATABASE_URL);
  }
  return db;
}

export const practiceQuizRouter = router({
  generatePracticeQuiz: protectedProcedure
    .input(
      z.object({
        topicId: z.number(),
        courseId: z.number(),
        questionsPerQuiz: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) throw new Error("Database connection failed");

        // Get or create student difficulty profile
        const profileQuery = await database.execute(
          `SELECT * FROM bridge_academy_student_difficulty_profiles 
           WHERE userId = ? AND topicId = ? AND courseId = ?`,
          [ctx.user.id, input.topicId, input.courseId]
        );

        let difficulty = "easy";
        let attemptNumber = 1;

        if (profileQuery && profileQuery.length > 0) {
          const profile = profileQuery[0];
          difficulty = profile.currentDifficulty || "easy";
          attemptNumber = (profile.attemptCount || 0) + 1;
        }

        // Fetch practice questions based on difficulty
        const questionsQuery = await database.execute(
          `SELECT * FROM bridge_academy_practice_questions 
           WHERE topicId = ? AND difficulty = ? 
           ORDER BY RAND() LIMIT ?`,
          [input.topicId, difficulty, input.questionsPerQuiz]
        );

        const questions = (questionsQuery || []).map((q: any) => ({
          id: q.id,
          question: q.question,
          questionType: q.questionType,
          options: JSON.parse(q.options || "[]"),
          difficulty: q.difficulty,
          variationGroup: q.variationGroup,
        }));

        // If not enough questions at this difficulty, get some from other difficulties
        if (questions.length < input.questionsPerQuiz) {
          const remainingNeeded = input.questionsPerQuiz - questions.length;
          const otherDifficultiesQuery = await database.execute(
            `SELECT * FROM bridge_academy_practice_questions 
             WHERE topicId = ? AND difficulty != ? 
             ORDER BY RAND() LIMIT ?`,
            [input.topicId, difficulty, remainingNeeded]
          );

          const otherQuestions = (otherDifficultiesQuery || []).map((q: any) => ({
            id: q.id,
            question: q.question,
            questionType: q.questionType,
            options: JSON.parse(q.options || "[]"),
            difficulty: q.difficulty,
            variationGroup: q.variationGroup,
          }));

          questions.push(...otherQuestions);
        }

        return {
          quizId: `quiz_${Date.now()}_${ctx.user.id}`,
          topicId: input.topicId,
          courseId: input.courseId,
          difficulty,
          questions,
          totalQuestions: questions.length,
          attemptNumber,
        };
      } catch (error) {
        console.error("Error generating practice quiz:", error);
        throw new Error("Failed to generate practice quiz");
      }
    }),

  submitPracticeQuiz: protectedProcedure
    .input(
      z.object({
        topicId: z.number(),
        courseId: z.number(),
        difficulty: z.enum(["easy", "medium", "hard"]),
        answers: z.array(
          z.object({
            questionId: z.number(),
            userAnswer: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) throw new Error("Database connection failed");

        // Get correct answers for all questions
        const questionIds = input.answers.map((a) => a.questionId);
        const questionsQuery = await database.execute(
          `SELECT id, correctAnswer FROM bridge_academy_practice_questions WHERE id IN (${questionIds.join(
            ","
          )})`
        );

        const correctAnswersMap: Record<number, string> = {};
        (questionsQuery || []).forEach((q: any) => {
          correctAnswersMap[q.id] = q.correctAnswer;
        });

        // Calculate score
        let correctCount = 0;
        const evaluatedAnswers = input.answers.map((answer) => {
          const isCorrect = answer.userAnswer === correctAnswersMap[answer.questionId];
          if (isCorrect) correctCount++;
          return {
            questionId: answer.questionId,
            userAnswer: answer.userAnswer,
            isCorrect,
          };
        });

        const percentage = Math.round((correctCount / input.answers.length) * 100);

        // Get current attempt number
        const attemptsQuery = await database.execute(
          `SELECT COUNT(*) as count FROM bridge_academy_practice_attempts 
           WHERE userId = ? AND topicId = ? AND courseId = ?`,
          [ctx.user.id, input.topicId, input.courseId]
        );

        const attemptNumber = ((attemptsQuery && attemptsQuery[0]?.count) || 0) + 1;

        // Insert attempt
        const attemptResult = await database.execute(
          `INSERT INTO bridge_academy_practice_attempts 
           (userId, topicId, courseId, attemptNumber, score, totalQuestions, percentage, difficulty) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ctx.user.id,
            input.topicId,
            input.courseId,
            attemptNumber,
            correctCount,
            input.answers.length,
            percentage,
            input.difficulty,
          ]
        );

        const attemptId = attemptResult?.insertId || 0;

        // Insert individual answers
        for (const answer of evaluatedAnswers) {
          await database.execute(
            `INSERT INTO bridge_academy_practice_answers (attemptId, questionId, userAnswer, isCorrect) 
             VALUES (?, ?, ?, ?)`,
            [attemptId, answer.questionId, answer.userAnswer, answer.isCorrect ? 1 : 0]
          );
        }

        // Update or create student difficulty profile
        const profileQuery = await database.execute(
          `SELECT * FROM bridge_academy_student_difficulty_profiles 
           WHERE userId = ? AND topicId = ? AND courseId = ?`,
          [ctx.user.id, input.topicId, input.courseId]
        );

        let nextDifficulty = input.difficulty;
        if (profileQuery && profileQuery.length > 0) {
          const profile = profileQuery[0];
          const newAverageScore = Math.round(
            ((profile.averageScore * profile.attemptCount + percentage) /
              (profile.attemptCount + 1)) *
              100
          ) / 100;
          const improvementTrend = Math.round(
            ((percentage - (profile.averageScore || 0)) / (profile.averageScore || 1)) * 100
          );

          // Determine next difficulty
          if (percentage >= 80 && input.difficulty !== "hard") {
            nextDifficulty = input.difficulty === "easy" ? "medium" : "hard";
          } else if (percentage < 60 && input.difficulty !== "easy") {
            nextDifficulty = input.difficulty === "hard" ? "medium" : "easy";
          }

          await database.execute(
            `UPDATE bridge_academy_student_difficulty_profiles 
             SET currentDifficulty = ?, averageScore = ?, attemptCount = ?, 
                 bestScore = ?, improvementTrend = ?, lastAttemptAt = NOW()
             WHERE userId = ? AND topicId = ? AND courseId = ?`,
            [
              nextDifficulty,
              newAverageScore,
              profile.attemptCount + 1,
              Math.max(profile.bestScore || 0, percentage),
              improvementTrend,
              ctx.user.id,
              input.topicId,
              input.courseId,
            ]
          );
        } else {
          // Create new profile
          await database.execute(
            `INSERT INTO bridge_academy_student_difficulty_profiles 
             (userId, topicId, courseId, currentDifficulty, averageScore, attemptCount, bestScore)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [ctx.user.id, input.topicId, input.courseId, nextDifficulty, percentage, 1, percentage]
          );
        }

        return {
          attemptId,
          score: correctCount,
          totalQuestions: input.answers.length,
          percentage,
          passed: percentage >= 70,
          answers: evaluatedAnswers,
          nextDifficulty,
          message: `Quiz submitted! You scored ${percentage}%`,
        };
      } catch (error) {
        console.error("Error submitting practice quiz:", error);
        throw new Error("Failed to submit practice quiz");
      }
    }),

  getPracticeHistory: protectedProcedure
    .input(
      z.object({
        topicId: z.number(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) throw new Error("Database connection failed");

        const attemptsQuery = await database.execute(
          `SELECT * FROM bridge_academy_practice_attempts 
           WHERE userId = ? AND topicId = ? 
           ORDER BY submittedAt DESC LIMIT ?`,
          [ctx.user.id, input.topicId, input.limit]
        );

        return (attemptsQuery || []).map((attempt: any) => ({
          id: attempt.id,
          attemptNumber: attempt.attemptNumber,
          score: attempt.score,
          totalQuestions: attempt.totalQuestions,
          percentage: attempt.percentage,
          difficulty: attempt.difficulty,
          submittedAt: attempt.submittedAt,
        }));
      } catch (error) {
        console.error("Error fetching practice history:", error);
        return [];
      }
    }),

  getStudentProfile: protectedProcedure
    .input(z.object({ topicId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) throw new Error("Database connection failed");

        const profileQuery = await database.execute(
          `SELECT * FROM bridge_academy_student_difficulty_profiles 
           WHERE userId = ? AND topicId = ?`,
          [ctx.user.id, input.topicId]
        );

        if (!profileQuery || profileQuery.length === 0) {
          return null;
        }

        const profile = profileQuery[0];
        return {
          currentDifficulty: profile.currentDifficulty,
          averageScore: profile.averageScore,
          attemptCount: profile.attemptCount,
          bestScore: profile.bestScore,
          improvementTrend: profile.improvementTrend,
          lastAttemptAt: profile.lastAttemptAt,
        };
      } catch (error) {
        console.error("Error fetching student profile:", error);
        return null;
      }
    }),

  getPracticeAnalytics: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) throw new Error("Database connection failed");

        // Get all topics for this course
        const topicsQuery = await database.execute(
          `SELECT DISTINCT topicId FROM bridge_academy_practice_attempts 
           WHERE courseId = ? AND userId = ?`,
          [input.courseId, ctx.user.id]
        );

        const topicIds = (topicsQuery || []).map((t: any) => t.topicId);

        // Get statistics
        const statsQuery = await database.execute(
          `SELECT 
             COUNT(DISTINCT topicId) as topicsWithAttempts,
             COUNT(*) as totalAttempts,
             AVG(percentage) as averageScore,
             MAX(percentage) as bestScore
           FROM bridge_academy_practice_attempts 
           WHERE courseId = ? AND userId = ?`,
          [input.courseId, ctx.user.id]
        );

        const stats = statsQuery && statsQuery[0];

        // Get all topics in course (from lessons)
        const allTopicsQuery = await database.execute(
          `SELECT DISTINCT courseId FROM lessons WHERE courseId = ?`,
          [input.courseId]
        );

        return {
          totalTopics: 1, // Assuming one topic per course for GED
          topicsWithAttempts: stats?.topicsWithAttempts || 0,
          totalAttempts: stats?.totalAttempts || 0,
          averageScore: Math.round((stats?.averageScore || 0) * 100) / 100,
          bestScore: stats?.bestScore || 0,
          topicProfiles: topicIds.map((id: number) => ({
            topicId: id,
            attempts: 0,
            averageScore: 0,
          })),
        };
      } catch (error) {
        console.error("Error fetching practice analytics:", error);
        return {
          totalTopics: 0,
          topicsWithAttempts: 0,
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          topicProfiles: [],
        };
      }
    }),

  calculatePracticeGradeContribution: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const database = await getDb();
        if (!database) throw new Error("Database connection failed");

        const statsQuery = await database.execute(
          `SELECT 
             COUNT(*) as totalAttempts,
             AVG(percentage) as averageScore
           FROM bridge_academy_practice_attempts 
           WHERE courseId = ? AND userId = ?`,
          [input.courseId, ctx.user.id]
        );

        const stats = statsQuery && statsQuery[0];
        const averageScore = stats?.averageScore || 0;
        const totalAttempts = stats?.totalAttempts || 0;

        // Practice quiz typically contributes 10-20% to final grade
        const practiceGradePercentage = 15;
        const gradeContribution = (averageScore * practiceGradePercentage) / 100;

        return {
          practiceGradePercentage,
          gradeContribution: Math.round(gradeContribution * 100) / 100,
          totalAttempts,
          averageScore: Math.round(averageScore * 100) / 100,
        };
      } catch (error) {
        console.error("Error calculating practice grade contribution:", error);
        return {
          practiceGradePercentage: 0,
          gradeContribution: 0,
          totalAttempts: 0,
          averageScore: 0,
        };
      }
    }),

  // Admin endpoint to bulk insert practice questions
  bulkInsertPracticeQuestions: protectedProcedure
    .input(
      z.object({
        questions: z.array(
          z.object({
            topicId: z.number(),
            question: z.string(),
            questionType: z.enum(['multiple_choice', 'true_false', 'short_answer']),
            options: z.array(z.string()).optional(),
            correctAnswer: z.string(),
            explanation: z.string(),
            difficulty: z.enum(['easy', 'medium', 'hard']),
            variationGroup: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only allow admin users
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      try {
        const database = await getDb();
        if (!database) throw new Error('Database connection failed');

        let inserted = 0;
        const batchSize = 50;

        for (let i = 0; i < input.questions.length; i += batchSize) {
          const batch = input.questions.slice(i, i + batchSize);

          for (const q of batch) {
            await database.execute(
              `INSERT INTO bridge_academy_practice_questions 
               (topicId, question, questionType, options, correctAnswer, explanation, difficulty, variationGroup)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                q.topicId,
                q.question,
                q.questionType,
                q.options ? JSON.stringify(q.options) : null,
                q.correctAnswer,
                q.explanation,
                q.difficulty,
                q.variationGroup || null,
              ]
            );
            inserted++;
          }
        }

        return {
          success: true,
          totalInserted: inserted,
          message: `Successfully inserted ${inserted} practice questions`,
        };
      } catch (error) {
        console.error('Error bulk inserting practice questions:', error);
        throw new Error(`Failed to insert practice questions: ${error}`);
      }
    }),
});
