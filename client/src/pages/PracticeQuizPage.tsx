import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, TrendingUp, Award, Zap } from "lucide-react";

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

  useEffect(() => {
    if (generateQuizMutation.data) {
      setQuizState(generateQuizMutation.data);
      setIsLoading(false);
    }
  }, [generateQuizMutation.data]);

  const currentQuestion = quizState?.questions[currentQuestionIndex];

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

      setSubmissionResult(result);
      setShowResults(true);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit quiz");
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setShowResults(false);
    setSubmissionResult(null);
    generateQuizMutation.refetch();
  };

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

          <Card className="border-2">
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
              <CardTitle className="text-3xl">
                {submissionResult.percentage}%
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {submissionResult.message}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {submissionResult.score}/{submissionResult.totalQuestions}
                  </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Difficulty Level</p>
                  <Badge variant="outline" className="mt-2 text-lg py-1">
                    {submissionResult.nextDifficulty?.toUpperCase()}
                  </Badge>
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
                        Correct answer: {answer.correctAnswer}
                      </p>
                    )}
                    {answer.explanation && (
                      <p className="text-xs mt-2 text-muted-foreground italic">
                        {answer.explanation}
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
          <Badge variant="secondary">
            Attempt {quizState.attemptNumber}
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Practice Quiz</CardTitle>
              <Badge variant="outline" className="text-base">
                {currentQuestionIndex + 1}/{quizState.totalQuestions}
              </Badge>
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

        <div className="flex gap-3 justify-between">
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

        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
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
      </div>
    </div>
  );
}
