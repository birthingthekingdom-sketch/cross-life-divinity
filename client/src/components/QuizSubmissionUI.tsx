import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizSubmissionUIProps {
  lessonId: number;
  questions: Question[];
  onComplete?: (score: number, totalQuestions: number) => void;
}

export function QuizSubmissionUI({
  lessonId,
  questions,
  onComplete,
}: QuizSubmissionUIProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitQuizMutation = trpc.gedFeatures.submitQuizAnswers.useMutation();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const quizAnswers = questions.map((q) => ({
      questionId: q.id,
      userAnswer: answers[q.id] || "",
      isCorrect: answers[q.id] === q.correctAnswer,
    }));

    try {
      const result = await submitQuizMutation.mutateAsync({
        lessonId,
        answers: quizAnswers,
      });

      setShowResults(true);
      setSubmitted(true);

      if (onComplete) {
        onComplete(result.score, result.totalQuestions);
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  if (submitted && showResults) {
    const score = Object.values(answers).filter((answer, idx) => {
      return answer === questions[idx]?.correctAnswer;
    }).length;

    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>Your performance on this quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-5xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-lg font-semibold">
              {passed ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                  Passed! Great job!
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <XCircle className="w-6 h-6" />
                  Keep practicing!
                </div>
              )}
            </div>
            <div className="text-gray-600">
              You answered {score} out of {questions.length} questions correctly
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Review Your Answers</h3>
            {questions.map((q, idx) => {
              const isCorrect = answers[q.id] === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        Question {idx + 1}: {q.question}
                      </p>
                      <p className="text-sm mb-2">
                        Your answer: <span className="font-semibold">{answers[q.id]}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm mb-2">
                          Correct answer: <span className="font-semibold">{q.correctAnswer}</span>
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-semibold">Explanation:</span> {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={() => window.location.reload()} className="w-full">
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isAnswered = answers[currentQuestion.id] !== undefined;
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quiz: {currentQuestion.question}</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={answers[currentQuestion.id] || ""} onValueChange={handleAnswerChange}>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Previous
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!isAnswered} className="flex-1">
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitQuizMutation.isPending}
              className="flex-1"
            >
              {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>

        {!isAnswered && (
          <div className="flex items-center gap-2 text-yellow-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Please select an answer to continue
          </div>
        )}
      </CardContent>
    </Card>
  );
}
