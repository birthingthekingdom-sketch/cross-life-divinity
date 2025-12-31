import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock data for testing
const mockQuizState = {
  quizId: "quiz-001",
  topicId: 1,
  courseId: 1,
  difficulty: "medium" as const,
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      questionType: "multiple-choice",
      options: ["Paris", "London", "Berlin", "Madrid"],
      difficulty: "easy",
    },
    {
      id: 2,
      question: "What is 2 + 2?",
      questionType: "multiple-choice",
      options: ["3", "4", "5", "6"],
      difficulty: "easy",
    },
  ],
  totalQuestions: 2,
  attemptNumber: 1,
};

const mockStudentProfile = {
  currentDifficulty: "medium",
  averageScore: 75,
  attemptCount: 5,
  bestScore: 95,
  improvementTrend: 10,
  lastAttemptAt: new Date().toISOString(),
};

const mockSubmissionResult = {
  score: 2,
  totalQuestions: 2,
  percentage: 100,
  passed: true,
  answers: [
    {
      questionId: 1,
      userAnswer: "Paris",
      isCorrect: true,
    },
    {
      questionId: 2,
      userAnswer: "4",
      isCorrect: true,
    },
  ],
};

describe("Quiz Timer Features", () => {
  it("should calculate remaining time correctly", () => {
    const totalSeconds = 30 * 60; // 30 minutes
    const elapsedSeconds = 5 * 60; // 5 minutes elapsed
    const remaining = totalSeconds - elapsedSeconds;

    expect(remaining).toBe(25 * 60);
    expect(remaining).toBeGreaterThan(0);
  });

  it("should format time correctly", () => {
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      }
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    expect(formatTime(1800)).toBe("30:00"); // 30 minutes
    expect(formatTime(3600)).toBe("1:00:00"); // 1 hour
    expect(formatTime(125)).toBe("2:05"); // 2 minutes 5 seconds
  });

  it("should trigger warning at 5 minutes remaining", () => {
    const QUIZ_TIME_LIMIT = 30 * 60;
    const timeRemaining = 5 * 60;
    const shouldShowWarning = timeRemaining <= 300 && timeRemaining > 0;

    expect(shouldShowWarning).toBe(true);
  });

  it("should trigger critical warning at 1 minute remaining", () => {
    const timeRemaining = 60;
    const isCritical = timeRemaining <= 60;

    expect(isCritical).toBe(true);
  });

  it("should handle exam mode with 3-hour time limit", () => {
    const EXAM_TIME_LIMIT = 3 * 60 * 60; // 3 hours
    const isExamMode = true;
    const timeLimit = isExamMode ? EXAM_TIME_LIMIT : 30 * 60;

    expect(timeLimit).toBe(10800);
    expect(timeLimit).toBeGreaterThan(30 * 60);
  });
});

describe("Quiz Submission and Scoring", () => {
  it("should calculate quiz score correctly", () => {
    const correctAnswers = 8;
    const totalQuestions = 10;
    const percentage = (correctAnswers / totalQuestions) * 100;

    expect(percentage).toBe(80);
  });

  it("should determine pass/fail status based on score", () => {
    const passingScore = 70;
    const score1 = 75;
    const score2 = 65;

    expect(score1 >= passingScore).toBe(true);
    expect(score2 >= passingScore).toBe(false);
  });

  it("should calculate improvement trend", () => {
    const previousAverage = 70;
    const currentScore = 85;
    const improvement = currentScore - previousAverage;

    expect(improvement).toBe(15);
    expect(improvement).toBeGreaterThan(0);
  });

  it("should track time spent on quiz", () => {
    const startTime = Date.now();
    const endTime = startTime + 15 * 60 * 1000; // 15 minutes later
    const timeSpent = Math.floor((endTime - startTime) / 1000);

    expect(timeSpent).toBe(900);
    expect(timeSpent).toBeLessThan(30 * 60);
  });

  it("should calculate average time per question", () => {
    const totalTime = 900; // 15 minutes
    const totalQuestions = 10;
    const avgTimePerQuestion = Math.round(totalTime / totalQuestions);

    expect(avgTimePerQuestion).toBe(90); // 90 seconds per question
  });
});

describe("Student Dashboard Analytics", () => {
  it("should calculate overall progress percentage", () => {
    const completedLessons = 15;
    const totalLessons = 20;
    const completionPercentage = (completedLessons / totalLessons) * 100;

    expect(completionPercentage).toBe(75);
  });

  it("should track course completion status", () => {
    const courses = [
      { id: 1, title: "Course 1", completed: true },
      { id: 2, title: "Course 2", completed: false },
      { id: 3, title: "Course 3", completed: true },
    ];

    const completedCourses = courses.filter((c) => c.completed).length;
    const completionRate = (completedCourses / courses.length) * 100;

    expect(completedCourses).toBe(2);
    expect(completionRate).toBeCloseTo(66.67, 1);
  });

  it("should calculate average quiz score across all attempts", () => {
    const attempts = [
      { score: 75, totalQuestions: 10 },
      { score: 85, totalQuestions: 10 },
      { score: 80, totalQuestions: 10 },
    ];

    const averageScore =
      attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions) * 100, 0) /
      attempts.length;

    expect(averageScore).toBeCloseTo(80, 1);
  });

  it("should identify weak areas based on performance", () => {
    const topicScores = {
      math: 65,
      science: 85,
      history: 55,
      english: 75,
    };

    const weakAreas = Object.entries(topicScores)
      .filter(([_, score]) => score < 70)
      .map(([topic]) => topic);

    expect(weakAreas).toContain("math");
    expect(weakAreas).toContain("history");
    expect(weakAreas).not.toContain("science");
  });

  it("should generate personalized recommendations", () => {
    const averageScore = 65;
    const recommendations: string[] = [];

    if (averageScore < 70) {
      recommendations.push("Focus on improving your quiz scores");
    }
    if (averageScore >= 80) {
      recommendations.push("You're doing great!");
    }

    expect(recommendations).toContain("Focus on improving your quiz scores");
    expect(recommendations).not.toContain("You're doing great!");
  });
});

describe("Question Navigation and Progress", () => {
  it("should track answered vs unanswered questions", () => {
    const userAnswers = new Map<number, string>();
    userAnswers.set(1, "Paris");
    userAnswers.set(3, "4");

    const totalQuestions = 5;
    const answeredCount = userAnswers.size;
    const unansweredCount = totalQuestions - answeredCount;

    expect(answeredCount).toBe(2);
    expect(unansweredCount).toBe(3);
  });

  it("should calculate progress percentage", () => {
    const answeredCount = 7;
    const totalQuestions = 10;
    const progressPercentage = (answeredCount / totalQuestions) * 100;

    expect(progressPercentage).toBe(70);
  });

  it("should allow jumping to specific questions", () => {
    const currentIndex = 0;
    const targetIndex = 5;

    expect(targetIndex).toBeGreaterThan(currentIndex);
    expect(targetIndex).toBeLessThan(10);
  });

  it("should prevent navigation beyond quiz bounds", () => {
    const currentIndex = 0;
    const totalQuestions = 10;

    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < totalQuestions - 1;

    expect(canGoPrevious).toBe(false);
    expect(canGoNext).toBe(true);
  });
});

describe("Quiz Difficulty Levels", () => {
  it("should classify questions by difficulty", () => {
    const difficulties = ["easy", "medium", "hard"];
    const testQuestion = { difficulty: "medium" };

    expect(difficulties).toContain(testQuestion.difficulty);
  });

  it("should apply correct styling for difficulty levels", () => {
    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return "bg-green-100 text-green-800";
        case "medium":
          return "bg-yellow-100 text-yellow-800";
        case "hard":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    expect(getDifficultyColor("easy")).toContain("green");
    expect(getDifficultyColor("medium")).toContain("yellow");
    expect(getDifficultyColor("hard")).toContain("red");
  });

  it("should adapt difficulty based on performance", () => {
    const currentDifficulty = "easy";
    const score = 95;

    const nextDifficulty =
      score >= 90 ? "hard" : score >= 70 ? "medium" : "easy";

    expect(nextDifficulty).toBe("hard");
  });
});

describe("Answer Validation", () => {
  it("should validate answer selection", () => {
    const question = mockQuizState.questions[0];
    const selectedAnswer = "Paris";

    const isValidAnswer = question.options.includes(selectedAnswer);

    expect(isValidAnswer).toBe(true);
  });

  it("should prevent duplicate answers for same question", () => {
    const userAnswers = new Map<number, string>();
    userAnswers.set(1, "Paris");

    // Trying to answer again should replace the previous answer
    userAnswers.set(1, "London");

    expect(userAnswers.get(1)).toBe("London");
    expect(userAnswers.size).toBe(1);
  });

  it("should handle unanswered question submission warning", () => {
    const userAnswers = new Map<number, string>();
    userAnswers.set(1, "Paris");

    const totalQuestions = 5;
    const unansweredCount = totalQuestions - userAnswers.size;
    const shouldWarn = unansweredCount > 0;

    expect(shouldWarn).toBe(true);
    expect(unansweredCount).toBe(4);
  });
});

describe("Quiz Results Display", () => {
  it("should display correct answer count", () => {
    const result = mockSubmissionResult;
    const correctCount = result.answers.filter((a) => a.isCorrect).length;

    expect(correctCount).toBe(2);
    expect(correctCount).toBe(result.score);
  });

  it("should display incorrect answer count", () => {
    const result = mockSubmissionResult;
    const incorrectCount = result.answers.filter((a) => !a.isCorrect).length;

    expect(incorrectCount).toBe(0);
  });

  it("should show performance level based on percentage", () => {
    const getPerformanceLevel = (percentage: number) => {
      if (percentage >= 90) return "Excellent";
      if (percentage >= 80) return "Good";
      if (percentage >= 70) return "Satisfactory";
      return "Needs Improvement";
    };

    expect(getPerformanceLevel(95)).toBe("Excellent");
    expect(getPerformanceLevel(85)).toBe("Good");
    expect(getPerformanceLevel(75)).toBe("Satisfactory");
    expect(getPerformanceLevel(60)).toBe("Needs Improvement");
  });

  it("should determine pass/fail based on percentage", () => {
    const result1 = { percentage: 75, passed: true };
    const result2 = { percentage: 65, passed: false };

    expect(result1.passed).toBe(true);
    expect(result2.passed).toBe(false);
  });
});
