import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  QuizIcon,
  TrendingUp,
  Award
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { LessonProgressBar } from "@/components/LessonProgressBar";

interface Lesson {
  id: number;
  title: string;
  description?: string;
  content?: string;
  courseId: number;
  lessonOrder: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  questionType: string;
  options?: string[];
  correctAnswer: string;
  questionOrder: number;
}

interface CourseProgress {
  courseId: number;
  courseName: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

export default function BridgeAcademyLessonDetail() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/bridge-academy/lesson/:lessonId");
  const { user } = useAuth();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const lessonId = params?.lessonId ? parseInt(params.lessonId) : null;

  // Fetch lesson data
  useEffect(() => {
    const fetchLessonData = async () => {
      if (!lessonId || !user?.id) return;
      
      try {
        setLoading(true);
        // Fetch lesson details
        const lessonRes = await fetch(`/api/bridge-academy/lesson/${lessonId}`);
        if (lessonRes.ok) {
          const lessonData = await lessonRes.json();
          setLesson(lessonData.lesson);
          setQuizQuestions(lessonData.quizQuestions || []);
        }
        
        // Fetch course progress
        if (lessonData?.lesson?.courseId) {
          const progressRes = await fetch(`/api/bridge-academy/course/${lessonData.lesson.courseId}/progress`);
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            setCourseProgress(progressData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch lesson data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId, user?.id]);

  const handleMarkComplete = async () => {
    if (!lessonId || !user?.id) return;
    
    try {
      setIsMarking(true);
      const response = await fetch(`/api/bridge-academy/lesson/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        
        // Refresh course progress
        if (lesson?.courseId) {
          const progressRes = await fetch(`/api/bridge-academy/course/${lesson.courseId}/progress`);
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            setCourseProgress(progressData);
          }
        }
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
    } finally {
      setIsMarking(false);
    }
  };

  const handleBack = () => {
    navigate("/bridge-academy");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bridge Academy
          </Button>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Lesson not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bridge Academy
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-lg text-muted-foreground">
                {lesson.description}
              </p>
            )}
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Lesson marked as complete! Great job!
              </AlertDescription>
            </Alert>
          )}

          {/* Course Progress */}
          {courseProgress && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LessonProgressBar 
                  completed={courseProgress.completedLessons}
                  total={courseProgress.totalLessons}
                  courseName={courseProgress.courseName}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">
              <BookOpen className="w-4 h-4 mr-2" />
              Lesson Content
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <QuizIcon className="w-4 h-4 mr-2" />
              Quiz ({quizQuestions.length})
            </TabsTrigger>
          </TabsList>

          {/* Lesson Content Tab */}
          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {lesson.content ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {lesson.content}
                    </p>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Detailed lesson content coming soon. Check back for comprehensive study materials.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Mark Complete Button */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleMarkComplete}
                    disabled={isMarking}
                    className="flex-1"
                    size="lg"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {isMarking ? "Marking..." : "Mark as Complete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Quiz</CardTitle>
                <CardDescription>
                  Test your knowledge with {quizQuestions.length} questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quizQuestions.length > 0 ? (
                  <div className="space-y-6">
                    {quizQuestions.map((question, index) => (
                      <Card key={question.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                          <div className="mb-4">
                            <Badge variant="outline" className="mb-2">
                              Question {index + 1} of {quizQuestions.length}
                            </Badge>
                            <h3 className="text-lg font-semibold text-foreground mt-2">
                              {question.question}
                            </h3>
                          </div>

                          {question.questionType === "multiple_choice" && question.options && (
                            <div className="space-y-2">
                              {JSON.parse(question.options).map((option: string, optIndex: number) => (
                                <div
                                  key={optIndex}
                                  className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                                >
                                  <p className="text-sm">{option}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.questionType === "short_answer" && (
                            <div className="space-y-2">
                              <textarea
                                placeholder="Type your answer here..."
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={4}
                              />
                            </div>
                          )}

                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-900">
                              <strong>Answer:</strong> {question.correctAnswer}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No quiz questions available for this lesson yet.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    </div>
  );
}
