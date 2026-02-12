import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, TrendingUp, Award, Zap } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  message: string;
  answers: Array<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
  }>;
}

const SUBJECT_DATA: Record<string, { name: string; courseId: number; topicId: number }> = {
  MATH: { name: "Mathematical Reasoning", courseId: 1, topicId: 1 },
  LANG: { name: "Reasoning Through Language Arts", courseId: 2, topicId: 2 },
  SCI: { name: "Science", courseId: 3, topicId: 3 },
  SOCIAL: { name: "Social Studies", courseId: 4, topicId: 4 },
};

export default function BridgeAcademyPracticeQuiz() {
  const [location, navigate] = useLocation();
  const params = useParams();
  const subjectCode = params?.subjectCode || "";
  const subject = SUBJECT_DATA[subjectCode];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load questions on mount
  useEffect(() => {
    if (subject) {
      loadQuestions();
    }
  }, [subject]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      // Mock questions - in production, these would come from the API
      const mockQuestions: QuizQuestion[] = [
        {
          id: 1,
          question: "What is 15% of 80?",
          options: ["12", "15", "18", "20"],
          correctAnswer: "12",
          difficulty: "easy",
          explanation: "15% of 80 = 0.15 × 80 = 12",
        },
        {
          id: 2,
          question: "Solve: 2x + 5 = 13",
          options: ["x = 4", "x = 6", "x = 8", "x = 9"],
          correctAnswer: "x = 4",
          difficulty: "medium",
          explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
        },
        {
          id: 3,
          question: "What is the area of a rectangle with length 10 and width 5?",
          options: ["15", "30", "50", "60"],
          correctAnswer: "50",
          difficulty: "easy",
          explanation: "Area = length × width = 10 × 5 = 50",
        },
        {
          id: 4,
          question: "What is the square root of 144?",
          options: ["10", "12", "14", "16"],
          correctAnswer: "12",
          difficulty: "easy",
          explanation: "√144 = 12 because 12 × 12 = 144",
        },
        {
          id: 5,
          question: "If a car travels 60 miles in 1 hour, how far will it travel in 3.5 hours?",
          options: ["180 miles", "200 miles", "210 miles", "240 miles"],
          correctAnswer: "210 miles",
          difficulty: "medium",
          explanation: "Distance = Speed × Time = 60 × 3.5 = 210 miles",
        },
      ];

      setQuestions(mockQuestions);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load practice quiz");
      setIsLoading(false);
    }
  };

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/bridge-academy/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Invalid Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">The subject you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (currentQuestion) {
      const newAnswers = new Map(userAnswers);
      newAnswers.set(currentQuestion.id, answer);
      setUserAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (userAnswers.size !== questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    // Calculate score
    let correctCount = 0;
    const answers = questions.map((q) => {
      const userAnswer = userAnswers.get(q.id);
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const result: QuizResult = {
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      message:
        percentage >= 80
          ? "Excellent! You're ready for the next level!"
          : percentage >= 70
            ? "Good job! Keep practicing to improve."
            : "Keep practicing! Review the explanations and try again.",
      answers,
    };

    setQuizResult(result);
    setShowResults(true);
    toast.success("Quiz submitted successfully!");
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setShowResults(false);
    setQuizResult(null);
    loadQuestions();
  };

  if (isLoading) {
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

  if (showResults && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/bridge-academy/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {quizResult.percentage >= 80 ? (
                  <Award className="w-12 h-12 text-green-500" />
                ) : quizResult.percentage >= 70 ? (
                  <TrendingUp className="w-12 h-12 text-blue-500" />
                ) : (
                  <Zap className="w-12 h-12 text-amber-500" />
                )}
              </div>
              <CardTitle className="text-3xl">{quizResult.percentage}%</CardTitle>
              <CardDescription className="text-lg mt-2">{quizResult.message}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {quizResult.score}/{quizResult.totalQuestions}
                  </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <Badge variant="outline" className="mt-2 text-lg py-1">
                    {subject.name}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                <p className="font-semibold">Answer Review:</p>
                {quizResult.answers.map((answer, idx) => (
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
                <Button onClick={handleRetry} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/bridge-academy/dashboard")}
                  className="flex-1"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isAnswered = userAnswers.has(currentQuestion?.id || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/bridge-academy/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Badge variant="secondary">{subject.name}</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Practice Quiz</CardTitle>
              <Badge variant="outline" className="text-base">
                {currentQuestionIndex + 1}/{questions.length}
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

          {currentQuestionIndex === questions.length - 1 ? (
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
            {questions.map((q, idx) => (
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
