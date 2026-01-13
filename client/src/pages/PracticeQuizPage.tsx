import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuizTimer } from "@/components/QuizTimer";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  RotateCcw, 
  TrendingUp, 
  Award, 
  Zap, 
  BarChart3, 
  Clock, 
  Target, 
  Flame,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  questionType: string;
  options: string[];
  difficulty: string;
  variationGroup?: string;
}

interface QuizState {
  quizId: string;
  topicId: number;
  courseId: number;
  difficulty: string;
  questions: QuizQuestion[];
  totalQuestions: number;
  attemptNumber: number;
}

interface SubmissionAnswer {
  questionId: number;
  userAnswer: string;
}

interface AttemptHistory {
  id: number;
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  difficulty: string;
  submittedAt: string;
}

interface StudentProfile {
  currentDifficulty: string;
  averageScore: number;
  attemptCount: number;
  bestScore: number;
  improvementTrend: number;
  lastAttemptAt: string;
}

const QUIZ_TIME_LIMIT = 30 * 60; // 30 minutes in seconds
const EXAM_TIME_LIMIT = 3 * 60 * 60; // 3 hours for full exam

export function PracticeQuizPage() {
  const [location, navigate] = useLocation();
  const params = useParams();
  const topicId = parseInt(params?.topicId || "0");
  const courseId = parseInt(params?.courseId || "0");
  const isExamMode = params?.mode === "exam";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(true);
  const [showQuestionNav, setShowQuestionNav] = useState(false);

  const timeLimit = isExamMode ? EXAM_TIME_LIMIT : QUIZ_TIME_LIMIT;

  // Fetch practice quiz
  const generateQuizMutation = trpc.practiceQuiz.generatePracticeQuiz.useQuery(
    { topicId, courseId, questionsPerQuiz: isExamMode ? 50 : 10 },
    { enabled: topicId > 0 && courseId > 0 }
  );

  // Submit practice quiz
  const submitQuizMutation = trpc.practiceQuiz.submitPracticeQuiz.useMutation();

  // Get student profile
  const studentProfileQuery = trpc.practiceQuiz.getStudentProfile.useQuery(
    { topicId },
    { enabled: topicId > 0 }
  );

  // Get practice history
  const practiceHistoryQuery = trpc.practiceQuiz.getPracticeHistory.useQuery(
    { topicId, limit: 20 },
    { enabled: topicId > 0 }
  );

  // Get analytics
  const analyticsQuery = trpc.practiceQuiz.getPracticeAnalytics.useQuery(
    { courseId },
    { enabled: courseId > 0 }
  );

  useEffect(() => {
    if (generateQuizMutation.data) {
      setQuizState(generateQuizMutation.data);
      setTimeStarted(Date.now());
      setIsLoading(false);
    }
  }, [generateQuizMutation.data]);

  // Track time spent
  useEffect(() => {
    if (!showResults && timeStarted && isQuizActive) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - timeStarted) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showResults, timeStarted, isQuizActive]);

  const currentQuestion = quizState?.questions[currentQuestionIndex];
  const studentProfile = studentProfileQuery.data as StudentProfile | null;
  const attemptHistory = practiceHistoryQuery.data as AttemptHistory[] | null;
  const analytics = analyticsQuery.data;

  const handleAnswerSelect = (answer: string) => {
    if (currentQuestion) {
      const newAnswers = new Map(userAnswers);
      newAnswers.set(currentQuestion.id, answer);
      setUserAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quizState?.totalQuestions || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowQuestionNav(false);
  };

  const handleTimeUp = async () => {
    setIsQuizActive(false);
    toast.error("Time is up! Submitting your answers...");
    await submitAnswers();
  };

  const submitAnswers = async () => {
    if (userAnswers.size === 0) {
      toast.error("Please answer at least one question before submitting");
      return;
    }

    const answers: SubmissionAnswer[] = Array.from(userAnswers.entries()).map(
      ([questionId, userAnswer]) => ({
        questionId,
        userAnswer,
      })
    );

    try {
      const result = await submitQuizMutation.mutateAsync({
        topicId,
        courseId,
        difficulty: (quizState!.difficulty as "easy" | "medium" | "hard"),
        answers,
      });

      setSubmissionResult({
        ...result,
        timeSpent,
      });
      setShowResults(true);
      setIsQuizActive(false);
      toast.success("Quiz submitted successfully!");

      // Refresh history and profile
      practiceHistoryQuery.refetch();
      studentProfileQuery.refetch();
      analyticsQuery.refetch();
    } catch (error) {
      toast.error("Failed to submit quiz");
    }
  };

  const handleSubmit = async () => {
    if (userAnswers.size !== quizState?.totalQuestions) {
      const unanswered = (quizState?.totalQuestions || 0) - userAnswers.size;
      const confirmed = window.confirm(
        `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmed) return;
    }

    await submitAnswers();
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setShowResults(false);
    setSubmissionResult(null);
    setTimeSpent(0);
    setIsQuizActive(true);
    generateQuizMutation.refetch();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  const getQuestionStatus = (questionId: number) => {
    return userAnswers.has(questionId) ? "answered" : "unanswered";
  };

  const answeredCount = userAnswers.size;
  const unansweredCount = (quizState?.totalQuestions || 0) - answeredCount;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
              <p className="text-lg font-semibold mb-2">Loading Quiz...</p>
              <p className="text-muted-foreground text-sm">Preparing your questions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results view
  if (showResults && submissionResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className={`inline-block p-4 rounded-full mb-4 ${
              submissionResult.passed
                ? "bg-green-100"
                : "bg-orange-100"
            }`}>
              {submissionResult.passed ? (
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-orange-600" />
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {submissionResult.passed ? "Great Job!" : "Keep Practicing"}
            </h1>
            <p className="text-xl text-muted-foreground">
              You scored {submissionResult.percentage}%
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Correct Answers</p>
                  <p className="text-3xl font-bold text-green-600">
                    {submissionResult.score}/{submissionResult.totalQuestions}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Time Spent</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatTime(submissionResult.timeSpent)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                  <Badge className={getDifficultyColor(quizState?.difficulty || "easy")}>
                    {quizState?.difficulty || "easy"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Answer Review */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Answer Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissionResult.answers.map((answer: any, idx: number) => {
                  const question = quizState?.questions.find(
                    (q) => q.id === answer.questionId
                  );
                  return (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3 mb-2">
                        {answer.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold mb-2">{question?.question}</p>
                          <p className="text-sm text-muted-foreground mb-1">
                            Your answer: <span className="font-medium">{answer.userAnswer}</span>
                          </p>
                          {!answer.isCorrect && (
                            <p className="text-sm text-green-600">
                              Correct answer: <span className="font-medium">{question?.options.find(opt => opt === answer.userAnswer) ? answer.userAnswer : "See explanation"}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="flex gap-4 flex-wrap justify-center">
            <Button onClick={handleRetry} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold">
              {isExamMode ? "Full Exam Simulation" : "Practice Quiz"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quizState?.totalQuestions}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowQuestionNav(!showQuestionNav)}
            className="gap-2"
          >
            <Target className="w-4 h-4" />
            {answeredCount}/{quizState?.totalQuestions}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Quiz Area */}
          <div className="lg:col-span-3">
            {/* Timer */}
            <Card className="mb-6 border-2 border-primary/20">
              <CardContent className="pt-6">
                <QuizTimer
                  totalSeconds={timeLimit}
                  onTimeUp={handleTimeUp}
                  isActive={isQuizActive}
                />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{currentQuestion?.question}</CardTitle>
                    <CardDescription className="mt-2">
                      <Badge className={getDifficultyColor(currentQuestion?.difficulty || "easy")}>
                        {currentQuestion?.difficulty || "easy"}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion?.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                        userAnswers.get(currentQuestion.id) === option
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            userAnswers.get(currentQuestion.id) === option
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        >
                          {userAnswers.get(currentQuestion.id) === option && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-4 justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={currentQuestionIndex === (quizState?.totalQuestions || 0) - 1}
                >
                  Next →
                </Button>
                <Button onClick={handleSubmit} className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Quiz
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
                <CardDescription>
                  {answeredCount} answered, {unansweredCount} remaining
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">Completion</span>
                      <span className="text-muted-foreground">
                        {Math.round((answeredCount / (quizState?.totalQuestions || 1)) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(answeredCount / (quizState?.totalQuestions || 1)) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {quizState?.questions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleJumpToQuestion(idx)}
                        className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                          idx === currentQuestionIndex
                            ? "bg-primary text-primary-foreground ring-2 ring-primary"
                            : userAnswers.has(quizState.questions[idx].id)
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-secondary hover:bg-secondary/80"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-100 border border-green-800" />
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-secondary" />
                      <span>Unanswered</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
