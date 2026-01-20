/**
 * Practice Test Router
 * Handles full-length GED practice tests with timed sessions and scoring
 */

import { protectedProcedure, publicProcedure, router } from "./trpc";
import { fullLengthPracticeTest, PracticeTestQuestion } from "./practice-test-data";
import { z } from "zod";

interface PracticeTestSession {
  sessionId: string;
  userId: number;
  startedAt: Date;
  timeLimit: number; // minutes
  questions: PracticeTestQuestion[];
  answers: Map<number, string>; // questionId -> userAnswer
  completed: boolean;
  score?: number;
  percentage?: number;
}

// In-memory session storage (in production, use database)
const sessions = new Map<string, PracticeTestSession>();

export const practiceTestRouter = router({
  // Start a new practice test session
  startTest: protectedProcedure.query(async ({ ctx }) => {
    const sessionId = `session_${ctx.user.id}_${Date.now()}`;
    const session: PracticeTestSession = {
      sessionId,
      userId: ctx.user.id,
      startedAt: new Date(),
      timeLimit: fullLengthPracticeTest.timeLimit,
      questions: fullLengthPracticeTest.questions,
      answers: new Map(),
      completed: false,
    };

    sessions.set(sessionId, session);

    return {
      sessionId,
      totalQuestions: fullLengthPracticeTest.totalQuestions,
      timeLimit: fullLengthPracticeTest.timeLimit,
      passingScore: fullLengthPracticeTest.passingScore,
      questions: fullLengthPracticeTest.questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
        subject: q.subject,
        difficulty: q.difficulty,
        // Don't send correct answer or explanation yet
      })),
    };
  }),

  // Submit an answer to a question
  submitAnswer: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        questionId: z.number(),
        answer: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const session = sessions.get(input.sessionId);

      if (!session || session.userId !== ctx.user.id) {
        throw new Error("Invalid session");
      }

      if (session.completed) {
        throw new Error("Test already completed");
      }

      // Store the answer
      session.answers.set(input.questionId, input.answer);

      return {
        success: true,
        questionId: input.questionId,
        answersSubmitted: session.answers.size,
        totalQuestions: session.questions.length,
      };
    }),

  // Complete the test and get results
  completeTest: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const session = sessions.get(input.sessionId);

      if (!session || session.userId !== ctx.user.id) {
        throw new Error("Invalid session");
      }

      if (session.completed) {
        throw new Error("Test already completed");
      }

      // Calculate score
      let correctAnswers = 0;
      const detailedResults = session.questions.map((question) => {
        const userAnswer = session.answers.get(question.id);
        const isCorrect =
          userAnswer &&
          userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();

        if (isCorrect) {
          correctAnswers++;
        }

        return {
          questionId: question.id,
          text: question.text,
          userAnswer: userAnswer || "Not answered",
          correctAnswer: question.correctAnswer,
          isCorrect: !!isCorrect,
          explanation: question.explanation,
          subject: question.subject,
          difficulty: question.difficulty,
        };
      });

      const percentage = Math.round(
        (correctAnswers / session.questions.length) * 100
      );
      const passed = percentage >= fullLengthPracticeTest.passingScore;

      session.score = correctAnswers;
      session.percentage = percentage;
      session.completed = true;

      const completedAt = new Date();
      const timeSpent = Math.round(
        (completedAt.getTime() - session.startedAt.getTime()) / 1000 / 60
      ); // minutes

      return {
        sessionId: input.sessionId,
        score: correctAnswers,
        totalQuestions: session.questions.length,
        percentage,
        passed,
        passingScore: fullLengthPracticeTest.passingScore,
        timeSpent,
        detailedResults,
        performanceBySubject: calculatePerformanceBySubject(detailedResults),
      };
    }),

  // Get test results (after completion)
  getTestResults: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const session = sessions.get(input.sessionId);

      if (!session || session.userId !== ctx.user.id) {
        throw new Error("Invalid session");
      }

      if (!session.completed) {
        throw new Error("Test not completed yet");
      }

      const detailedResults = session.questions.map((question) => {
        const userAnswer = session.answers.get(question.id);
        const isCorrect =
          userAnswer &&
          userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();

        return {
          questionId: question.id,
          text: question.text,
          userAnswer: userAnswer || "Not answered",
          correctAnswer: question.correctAnswer,
          isCorrect: !!isCorrect,
          explanation: question.explanation,
          subject: question.subject,
          difficulty: question.difficulty,
        };
      });

      return {
        sessionId: input.sessionId,
        score: session.score,
        totalQuestions: session.questions.length,
        percentage: session.percentage,
        passed: session.percentage! >= fullLengthPracticeTest.passingScore,
        passingScore: fullLengthPracticeTest.passingScore,
        detailedResults,
        performanceBySubject: calculatePerformanceBySubject(detailedResults),
      };
    }),

  // Get diagnostic pre-assessment (15 questions)
  startDiagnosticTest: protectedProcedure.query(async ({ ctx }) => {
    // Select 15 random questions from the full test (3 per subject)
    const diagnosticQuestions = selectDiagnosticQuestions(
      fullLengthPracticeTest.questions
    );

    const sessionId = `diagnostic_${ctx.user.id}_${Date.now()}`;
    const session: PracticeTestSession = {
      sessionId,
      userId: ctx.user.id,
      startedAt: new Date(),
      timeLimit: 45, // 45 minutes for diagnostic
      questions: diagnosticQuestions,
      answers: new Map(),
      completed: false,
    };

    sessions.set(sessionId, session);

    return {
      sessionId,
      totalQuestions: diagnosticQuestions.length,
      timeLimit: 45,
      passingScore: 70,
      questions: diagnosticQuestions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
        subject: q.subject,
        difficulty: q.difficulty,
      })),
    };
  }),

  // Get performance analytics
  getPerformanceAnalytics: protectedProcedure.query(async ({ ctx }) => {
    // Get all completed sessions for this user
    const userSessions = Array.from(sessions.values()).filter(
      (s) => s.userId === ctx.user.id && s.completed
    );

    const allResults = userSessions.flatMap((session) =>
      session.questions.map((question) => {
        const userAnswer = session.answers.get(question.id);
        const isCorrect =
          userAnswer &&
          userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();

        return {
          questionId: question.id,
          isCorrect: !!isCorrect,
          subject: question.subject,
          difficulty: question.difficulty,
        };
      })
    );

    const performanceBySubject = calculatePerformanceBySubject(
      allResults as any
    );
    const weakAreas = Object.entries(performanceBySubject)
      .filter(([_, stats]: any) => stats.percentage < 70)
      .map(([subject, stats]: any) => ({
        subject,
        percentage: stats.percentage,
        correctAnswers: stats.correctAnswers,
        totalQuestions: stats.totalQuestions,
      }));

    const overallStats = {
      totalTestsTaken: userSessions.length,
      averageScore: Math.round(
        userSessions.reduce((sum, s) => sum + (s.percentage || 0), 0) /
          userSessions.length
      ),
      bestScore: Math.max(...userSessions.map((s) => s.percentage || 0)),
      worstScore: Math.min(...userSessions.map((s) => s.percentage || 0)),
      totalQuestionsAnswered: allResults.length,
      totalCorrectAnswers: allResults.filter((r) => r.isCorrect).length,
    };

    return {
      overallStats,
      performanceBySubject,
      weakAreas,
      recommendations: generateRecommendations(weakAreas, overallStats),
    };
  }),
});

// Helper functions
function calculatePerformanceBySubject(results: any[]) {
  const subjects = [
    "reading",
    "writing",
    "math",
    "science",
    "social_studies",
  ];
  const performance: any = {};

  for (const subject of subjects) {
    const subjectResults = results.filter((r) => r.subject === subject);
    const correctAnswers = subjectResults.filter((r) => r.isCorrect).length;

    performance[subject] = {
      correctAnswers,
      totalQuestions: subjectResults.length,
      percentage:
        subjectResults.length > 0
          ? Math.round((correctAnswers / subjectResults.length) * 100)
          : 0,
    };
  }

  return performance;
}

function selectDiagnosticQuestions(allQuestions: PracticeTestQuestion[]) {
  const subjects = [
    "reading",
    "writing",
    "math",
    "science",
    "social_studies",
  ];
  const selected: PracticeTestQuestion[] = [];

  for (const subject of subjects) {
    const subjectQuestions = allQuestions.filter((q) => q.subject === subject);
    // Select 3 random questions per subject (15 total)
    for (let i = 0; i < 3 && subjectQuestions.length > 0; i++) {
      const randomIndex = Math.floor(
        Math.random() * subjectQuestions.length
      );
      selected.push(subjectQuestions[randomIndex]);
      subjectQuestions.splice(randomIndex, 1);
    }
  }

  return selected;
}

function generateRecommendations(weakAreas: any[], overallStats: any) {
  const recommendations = [];

  if (overallStats.averageScore >= 90) {
    recommendations.push(
      "🌟 Outstanding performance! You're ready for the GED exam."
    );
  } else if (overallStats.averageScore >= 80) {
    recommendations.push(
      "🎯 Great progress! Focus on your weak areas to improve further."
    );
  } else if (overallStats.averageScore >= 70) {
    recommendations.push(
      "💪 Good effort! Keep practicing to build stronger skills."
    );
  } else {
    recommendations.push(
      "🚀 You're getting started! Review the fundamentals and practice more."
    );
  }

  for (const area of weakAreas) {
    recommendations.push(
      `📚 Focus on ${area.subject.replace("_", " ")} (${area.percentage}% - needs improvement)`
    );
  }

  if (weakAreas.length === 0) {
    recommendations.push("✅ All subjects are strong! Take full-length tests.");
  }

  return recommendations;
}
