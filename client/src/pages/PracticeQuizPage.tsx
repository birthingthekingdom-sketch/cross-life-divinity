import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, TrendingUp, Award, Zap, BarChart3, Clock, Target, Flame } from "lucide-react";

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

export function PracticeQuizPage() {
  const [location, navigate] = useLocation();
  const params = useParams();
  const topicId = parseInt(params?.topicId || "0");
  const courseId = parseInt(params?.courseId || "0");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  // Fetch practice quiz
  const generateQuizMutation = trpc.practiceQuiz.generatePracticeQuiz.useQuery(
    { topicId, courseId, questionsPerQuiz: 10 },
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
    if (!showResults && timeStarted) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - timeStarted) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showResults, timeStarted]);

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

  const handleSubmit = async () => {
    if (userAnswers.size !== quizState?.totalQuestions) {
      toast.error("Please answer all questions before submitting");
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
        difficulty: quizState!.difficulty,
        answers,
      });

      setSubmissionResult({
        ...result,
        timeSpent,
      });
      setShowResults(true);
      toast.success("Quiz submitted successfully!");
      
      // Refresh history and profile
      practiceHistoryQuery.refetch();
      studentProfileQuery.refetch();
      analyticsQuery.refetch();
    } catch (error) {
      toast.error("Failed to submit quiz");
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setShowResults(false);
    setSubmissionResult(null);
    setTimeSpent(0);
    generateQuizMutation.refetch();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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

  // History View
  if (showHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setShowHistory(false)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quiz
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Your Practice History
              </CardTitle>
              <CardDescription>
                Track your progress and improvement over time
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Student Profile Summary */}
          {studentProfile && (
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-lg">Performance Profile</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(studentProfile.averageScore)}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Best Score</p>
                    <p className="text-2xl font-bold text-green-600">
                      {studentProfile.bestScore}%
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Attempts</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {studentProfile.attemptCount}
                    </p>
                  </div>
                  <div className={`${getDifficultyColor(studentProfile.currentDifficulty)} p-4 rounded-lg`}>
                    <p className="text-xs text-muted-foreground mb-1">Current Level</p>
                    <p className="text-lg font-bold capitalize">
                      {studentProfile.currentDifficulty}
                    </p>
                  </div>
                </div>

                {studentProfile.improvementTrend !== undefined && (
                  <div className="mt-4 p-3 bg-secondary/50 rounded-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      {studentProfile.improvementTrend > 0 ? "📈" : "📉"} 
                      {" "}Improvement Trend: {studentProfile.improvementTrend > 0 ? "+" : ""}{studentProfile.improvementTrend}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Attempt History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              {attemptHistory && attemptHistory.length > 0 ? (
                <div className="space-y-3">
                  {attemptHistory.map((attempt, idx) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold">Attempt {attempt.attemptNumber}</span>
                          <Badge className={getDifficultyColor(attempt.difficulty)}>
                            {attempt.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(attempt.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={attempt.percentage} className="flex-1 h-2" />
                          <span className="text-sm font-medium min-w-fit">
                            {attempt.score}/{attempt.totalQuestions}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold">{attempt.percentage}%</p>
                        {attempt.percentage >= 80 && (
                          <Award className="w-4 h-4 text-green-500 mx-auto mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No attempts yet. Start your first quiz!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Analytics Summary */}
          {analytics && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Overall Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Attempts</p>
                    <p className="text-2xl font-bold">{analytics.totalAttempts}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                    <p className="text-2xl font-bold">{Math.round(analytics.averageScore)}%</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Best Score</p>
                    <p className="text-2xl font-bold">{analytics.bestScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Results View
  if (showResults && submissionResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="border-2 mb-6">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {submissionResult.percentage >= 80 ? (
                  <Award className="w-12 h-12 text-green-500" />
                ) : submissionResult.percentage >= 70 ? (
                  <TrendingUp className="w-12 h-12 text-blue-500" />
                ) : (
                  <Zap className="w-12 h-12 text-amber-500" />
                )}
              </div>
              <CardTitle className="text-4xl font-bold">
                {submissionResult.percentage}%
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {submissionResult.message}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {submissionResult.score}/{submissionResult.totalQuestions}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatTime(submissionResult.timeSpent)}
                  </p>
                </div>
                <div className={`${getDifficultyColor(submissionResult.nextDifficulty)} p-4 rounded-lg border`}>
                  <p className="text-sm text-muted-foreground">Next Difficulty</p>
                  <p className="text-lg font-bold capitalize">
                    {submissionResult.nextDifficulty}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-muted-foreground">Avg Time/Question</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(submissionResult.timeSpent / submissionResult.totalQuestions)}s
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                <p className="font-semibold">Answer Review:</p>
                {submissionResult.answers.map((answer: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      answer.isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p className="text-sm font-medium">
                      Q{idx + 1}: {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Your answer: {answer.userAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleRetry}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowHistory(true)}
                  className="flex-1"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View History
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  Back to Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading View
  if (isLoading || !quizState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading practice quiz...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz View
  const progress = ((currentQuestionIndex + 1) / quizState.totalQuestions) * 100;
  const isAnswered = userAnswers.has(currentQuestion?.id || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${timeSpent > QUIZ_TIME_LIMIT - 300 ? 'text-red-500' : 'text-muted-foreground'}`} />
            <span className={`font-mono text-sm ${timeSpent > QUIZ_TIME_LIMIT - 300 ? 'text-red-600 font-bold' : ''}`}>
              {formatTime(timeSpent)} / {formatTime(QUIZ_TIME_LIMIT)}
            </span>
          </div>
          <Badge variant="secondary">
            Attempt {quizState.attemptNumber}
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Practice Quiz</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-base">
                  {currentQuestionIndex + 1}/{quizState.totalQuestions}
                </Badge>
                <Badge className={getDifficultyColor(quizState.difficulty)}>
                  {quizState.difficulty.toUpperCase()}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion?.question}</CardTitle>
            <CardDescription>
              Difficulty: <Badge variant="outline" className="ml-2">{currentQuestion?.difficulty}</Badge>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {currentQuestion?.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    userAnswers.get(currentQuestion.id) === option
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        userAnswers.get(currentQuestion.id) === option
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {userAnswers.get(currentQuestion.id) === option && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-between mb-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex === quizState.totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isAnswered}
              className="px-8"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-8"
            >
              Next
            </Button>
          )}
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground mb-3">Question Progress:</p>
          <div className="flex flex-wrap gap-2">
            {quizState.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                  userAnswers.has(q.id)
                    ? "bg-green-500 text-white"
                    : idx === currentQuestionIndex
                      ? "bg-primary text-white"
                      : "bg-border text-muted-foreground hover:bg-border/80"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowHistory(true)}
          className="w-full"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Practice History
        </Button>
      </div>
    </div>
  );
}
