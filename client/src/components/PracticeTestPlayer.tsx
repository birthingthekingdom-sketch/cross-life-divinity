import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface PracticeTestPlayerProps {
  testId: number;
  testTitle: string;
  timeLimit: number;
  questions: Question[];
  passingScore: number;
  onComplete?: (score: number, timeSpent: number) => void;
}

export function PracticeTestPlayer({
  testId,
  testTitle,
  timeLimit,
  questions,
  passingScore,
  onComplete,
}: PracticeTestPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const recordAttemptMutation = trpc.gedFeatures.recordPracticeTestAttempt.useMutation();

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timeSpent = timeLimit * 60 - timeRemaining;

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
    const score = Object.entries(answers).filter(([qId, answer]) => {
      const q = questions.find((q) => q.id === parseInt(qId));
      return q && answer === q.correctAnswer;
    }).length;

    try {
      await recordAttemptMutation.mutateAsync({
        practiceTestId: testId,
        score,
        totalQuestions: questions.length,
        timeSpent,
      });

      setShowResults(true);
      setSubmitted(true);

      if (onComplete) {
        onComplete(score, timeSpent);
      }
    } catch (error) {
      console.error("Failed to record attempt:", error);
    }
  };

  if (submitted && showResults) {
    const score = Object.entries(answers).filter(([qId, answer]) => {
      const q = questions.find((q) => q.id === parseInt(qId));
      return q && answer === q.correctAnswer;
    }).length;

    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= passingScore;

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{testTitle} - Results</CardTitle>
          <CardDescription>Your practice test performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-5xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-lg font-semibold">
              {passed ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                  Passed! ({passingScore}% required)
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <AlertCircle className="w-6 h-6" />
                  Score: {percentage}% (Need {passingScore}%)
                </div>
              )}
            </div>
            <div className="text-gray-600">
              {score} out of {questions.length} correct
            </div>
            <div className="text-gray-600 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Time spent: {formatTime(timeSpent)}
            </div>
          </div>

          <Button onClick={() => window.location.reload()} className="w-full">
            Retake Practice Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isAnswered = answers[currentQuestion.id] !== undefined;
  const allAnswered = Object.keys(answers).length === questions.length;
  const timeWarning = timeRemaining < 300;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <div>
            <CardTitle>{testTitle}</CardTitle>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardDescription>
          </div>
          <div
            className={`text-2xl font-bold flex items-center gap-2 ${
              timeWarning ? "text-red-600" : "text-gray-600"
            }`}
          >
            <Clock className="w-5 h-5" />
            {formatTime(timeRemaining)}
          </div>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">{currentQuestion.question}</h3>
          <RadioGroup value={answers[currentQuestion.id] || ""} onValueChange={handleAnswerChange}>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 border"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

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
              disabled={!allAnswered || recordAttemptMutation.isPending}
              className="flex-1"
            >
              {recordAttemptMutation.isPending ? "Submitting..." : "Finish Test"}
            </Button>
          )}
        </div>

        {timeWarning && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            Time is running out! Make sure to submit your answers.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
