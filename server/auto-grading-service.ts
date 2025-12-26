import * as db from "./db";

/**
 * Auto-grading service for multiple choice and true/false questions
 * Handles instant grading without admin intervention
 */

export interface QuestionAnswer {
  questionId: number;
  answer: string;
}

export interface GradingResult {
  questionId: number;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
  questionType: string;
}

export interface QuizGradingResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  results: GradingResult[];
  autoGraded: boolean;
  hasManualQuestions: boolean;
}

/**
 * Grade a quiz submission with auto-grading for MC/True-False
 * Manual questions (short_answer) are marked for admin review
 */
export async function gradeQuizSubmission(
  lessonId: number,
  answers: QuestionAnswer[]
): Promise<QuizGradingResult> {
  const questions = await db.getQuizQuestionsByLessonId(lessonId);
  
  let autoGradedCount = 0;
  let manualCount = 0;
  const results: GradingResult[] = [];
  
  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) continue;
    
    let isCorrect = false;
    let isAutoGraded = false;
    
    // Auto-grade multiple choice and true/false questions
    if (question.questionType === "multiple_choice" || question.questionType === "true_false") {
      isCorrect = normalizeAnswer(answer.answer) === normalizeAnswer(question.correctAnswer);
      isAutoGraded = true;
      autoGradedCount++;
    } else if (question.questionType === "short_answer") {
      // Short answer questions require manual grading
      manualCount++;
    }
    
    results.push({
      questionId: question.id,
      answer: answer.answer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      questionType: question.questionType,
    });
  }
  
  // Calculate score based on auto-graded questions only
  const autoGradedResults = results.filter(r => 
    r.questionType === "multiple_choice" || r.questionType === "true_false"
  );
  
  const correctCount = autoGradedResults.filter(r => r.isCorrect).length;
  const score = autoGradedCount > 0 ? correctCount : 0;
  const percentage = autoGradedCount > 0 ? Math.round((correctCount / autoGradedCount) * 100) : 0;
  
  // Passing grade is 70% on auto-graded questions
  const passed = percentage >= 70;
  
  return {
    score,
    totalQuestions: autoGradedCount,
    percentage,
    passed,
    results,
    autoGraded: autoGradedCount > 0,
    hasManualQuestions: manualCount > 0,
  };
}

/**
 * Normalize answer for comparison (case-insensitive, trimmed)
 */
function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim();
}

/**
 * Check if a question type is auto-gradable
 */
export function isAutoGradable(questionType: string): boolean {
  return questionType === "multiple_choice" || questionType === "true_false";
}

/**
 * Get summary of auto-gradable vs manual questions in a lesson
 */
export async function getGradingSummary(lessonId: number) {
  const questions = await db.getQuizQuestionsByLessonId(lessonId);
  
  const autoGradable = questions.filter(q => isAutoGradable(q.questionType)).length;
  const manual = questions.filter(q => !isAutoGradable(q.questionType)).length;
  
  return {
    total: questions.length,
    autoGradable,
    manual,
    autoGradablePercentage: Math.round((autoGradable / questions.length) * 100),
  };
}

/**
 * Validate answer format for a question
 */
export function validateAnswer(questionType: string, answer: string): boolean {
  if (!answer || answer.trim() === "") {
    return false;
  }
  
  if (questionType === "true_false") {
    return answer.toLowerCase() === "true" || answer.toLowerCase() === "false";
  }
  
  return true;
}

/**
 * Get detailed grading feedback for a quiz result
 */
export function getGradingFeedback(result: QuizGradingResult): string {
  if (!result.autoGraded) {
    return "This quiz contains manual grading questions. An instructor will review your submission.";
  }
  
  if (result.passed) {
    return `Great job! You scored ${result.score}/${result.totalQuestions} (${result.percentage}%). You've passed this quiz.`;
  } else {
    return `You scored ${result.score}/${result.totalQuestions} (${result.percentage}%). You need 70% to pass. Please review the material and try again.`;
  }
}
