import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { AssignmentSubmission } from "@/components/AssignmentSubmission";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { useAuth } from "@/_core/hooks/useAuth";

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const lessonId = parseInt(params.id || "0");
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation(`/login?redirect=/lesson/${lessonId}`);
    }
  }, [isAuthenticated, lessonId, setLocation]);

  const { data: lesson, isLoading: lessonLoading } = trpc.lessons.getById.useQuery(
    { id: lessonId },
    { enabled: isAuthenticated }
  );
  const { data: course } = trpc.courses.getById.useQuery(
    { id: lesson?.courseId || 0 },
    { enabled: !!lesson }
  );
  const { data: quizQuestions } = trpc.quizzes.getByLesson.useQuery({ lessonId });
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const submitQuizMutation = trpc.quizzes.submitQuiz.useMutation({
    onSuccess: (data) => {
      setShowResults(true);
      if (data.passed) {
        toast.success(`Quiz passed with ${data.score}/${data.totalQuestions} correct! Lesson complete.`);
      } else {
        toast.error(`Quiz score: ${data.score}/${data.totalQuestions}. You need 70% to pass.`);
      }
    },
    onError: () => {
      toast.error("Failed to submit quiz. Please try again.");
    },
  });

  const quizResults = useMemo(() => {
    if (!quizQuestions || !showResults) return null;
    
    const results = quizQuestions.map(q => {
      const userAnswer = answers[q.id] || "";
      const isCorrect = userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
      return { questionId: q.id, isCorrect };
    });
    
    const correctCount = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const percentage = total > 0 ? (correctCount / total) * 100 : 0;
    
    return { results, correctCount, total, percentage };
  }, [quizQuestions, answers, showResults]);

  const handleSubmitQuiz = async () => {
    if (!quizQuestions || !lesson) return;
    
    // Check if all questions are answered
    const unanswered = quizQuestions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    // Submit quiz with all answers
    const answerArray = quizQuestions.map(q => ({
      questionId: q.id,
      answer: answers[q.id],
    }));

    await submitQuizMutation.mutateAsync({
      lessonId: lesson.id,
      courseId: lesson.courseId,
      answers: answerArray,
    });
  };

  // Show loading while checking authentication or loading lesson
  if (!isAuthenticated || lessonLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{!isAuthenticated ? 'Redirecting to login...' : 'Loading lesson...'}</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Lesson not found</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Lesson Header */}
      <div 
        className="text-white shadow-lg"
        style={{ backgroundColor: course?.colorTheme || "#1a365d" }}
      >
        <div className="container py-6">
          <Link href={`/course/${lesson.courseId}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          {course && (
            <p className="text-white/80 mt-2">{course.title} - {course.code}</p>
          )}
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Lesson Content */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <Streamdown>{lesson.content}</Streamdown>
            </CardContent>
          </Card>

          {/* Assignment Section */}
          {lesson.assignment && (
            <AssignmentSubmission 
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              assignmentPrompt={lesson.assignment}
            />
          )}

          {/* Quiz Section */}
          {quizQuestions && quizQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Lesson Quiz</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete the quiz below to test your understanding. You need 70% or higher to pass.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {quizQuestions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const result = quizResults?.results.find(r => r.questionId === question.id);
                  
                  return (
                    <div key={question.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="font-semibold text-primary">{index + 1}.</span>
                        <div className="flex-1">
                          <p className="font-medium mb-3">{question.question}</p>
                          
                          {question.questionType === "multiple_choice" && question.options && (
                            <RadioGroup
                              value={userAnswer || ""}
                              onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                              disabled={showResults}
                            >
                              {JSON.parse(question.options).map((option: string, optIndex: number) => (
                                <div key={optIndex} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option} id={`q${question.id}-opt${optIndex}`} />
                                  <Label htmlFor={`q${question.id}-opt${optIndex}`} className="cursor-pointer">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          )}
                          
                          {question.questionType === "true_false" && (
                            <RadioGroup
                              value={userAnswer || ""}
                              onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                              disabled={showResults}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="True" id={`q${question.id}-true`} />
                                <Label htmlFor={`q${question.id}-true`} className="cursor-pointer">True</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="False" id={`q${question.id}-false`} />
                                <Label htmlFor={`q${question.id}-false`} className="cursor-pointer">False</Label>
                              </div>
                            </RadioGroup>
                          )}
                          
                          {question.questionType === "short_answer" && (
                            <Textarea
                              value={userAnswer || ""}
                              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                              placeholder="Type your answer here..."
                              disabled={showResults}
                              rows={3}
                            />
                          )}
                          
                          {showResults && result && (
                            <div className={`mt-2 p-3 rounded-md ${result.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                              {result.isCorrect ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span className="font-semibold">Correct!</span>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-semibold mb-1">Incorrect</p>
                                  <p className="text-sm">Correct answer: {question.correctAnswer}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!showResults ? (
                  <Button 
                    onClick={handleSubmitQuiz} 
                    className="w-full"
                    disabled={submitQuizMutation.isPending}
                  >
                    {submitQuizMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Quiz"
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Card className={quizResults && quizResults.percentage >= 70 ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold mb-2">
                            {quizResults?.correctCount} / {quizResults?.total} Correct
                          </p>
                          <p className="text-lg">
                            Score: {quizResults?.percentage.toFixed(0)}%
                          </p>
                          {quizResults && quizResults.percentage >= 70 ? (
                            <p className="text-green-700 font-semibold mt-2">✓ Passed! Lesson Complete</p>
                          ) : (
                            <p className="text-red-700 font-semibold mt-2">
                              You need 70% or higher to pass. Please review the material and try again.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setAnswers({});
                          setShowResults(false);
                        }}
                        className="flex-1"
                      >
                        Retake Quiz
                      </Button>
                      <Link href={`/course/${lesson.courseId}`} className="flex-1">
                        <Button className="w-full">
                          Back to Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
