import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, BookOpen, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface Lesson {
  id: number;
  title: string;
  content: string;
  lessonOrder: number;
  courseId: number;
}

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  lessonId: number;
}

export default function AdminPreviewCourse() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id || "0");
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);

  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery({ id: courseId });
  const { data: lessons, isLoading: lessonsLoading } = trpc.lessons.getByCourse.useQuery({ courseId });
  const { data: allQuizzes, isLoading: quizzesLoading } = trpc.quizzes.getByCourse.useQuery({ courseId });

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (courseLoading || lessonsLoading || quizzesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Course Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button>Back to Admin</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Group quizzes by lesson
  const quizzesByLesson = (allQuizzes || []).reduce((acc: Record<number, Quiz[]>, quiz: any) => {
    if (!acc[quiz.lessonId]) {
      acc[quiz.lessonId] = [];
    }
    acc[quiz.lessonId].push(quiz);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground mt-2">{course.code}</p>
          <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline">{course.cpdHours || 0} CPD Hours</Badge>
            <Badge variant="outline">{lessons?.length || 0} Lessons</Badge>
            <Badge variant="outline">{allQuizzes?.length || 0} Quiz Questions</Badge>
          </div>
        </div>

        {/* Lessons and Quizzes */}
        <div className="space-y-4">
          {lessons && lessons.length > 0 ? (
            lessons.map((lesson: Lesson) => {
              const lessonQuizzes = quizzesByLesson[lesson.id] || [];
              const isExpanded = expandedLessonId === lesson.id;

              return (
                <Card key={lesson.id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() =>
                      setExpandedLessonId(isExpanded ? null : lesson.id)
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Lesson {lesson.lessonOrder}</Badge>
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {lessonQuizzes.length} quiz questions
                        </p>
                      </div>
                      <div className="text-muted-foreground">
                        {isExpanded ? "▼" : "▶"}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-6 border-t pt-6">
                      {/* Lesson Content */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Lesson Content
                        </h3>
                        <div className="bg-muted/50 p-4 rounded-lg prose prose-sm max-w-none dark:prose-invert">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: lesson.content || "No content available",
                            }}
                          />
                        </div>
                      </div>

                      {/* Quiz Questions */}
                      {lessonQuizzes.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Quiz Questions ({lessonQuizzes.length})
                          </h3>
                          <div className="space-y-4">
                            {lessonQuizzes.map((quiz: Quiz, idx: number) => (
                              <Card key={quiz.id} className="bg-muted/30">
                                <CardContent className="pt-6">
                                  <p className="font-medium mb-3">
                                    Q{idx + 1}: {quiz.question}
                                  </p>
                                  <div className="space-y-2 ml-4">
                                    {(typeof quiz.options === 'string' ? JSON.parse(quiz.options) : quiz.options).map((option: string, optIdx: number) => (
                                      <div
                                        key={optIdx}
                                        className={`p-2 rounded text-sm ${
                                          optIdx === (typeof quiz.correctAnswer === 'string' ? parseInt(quiz.correctAnswer) : quiz.correctAnswer)
                                            ? "bg-green-100 text-green-900 border border-green-300"
                                            : "bg-white text-gray-700 border border-gray-200"
                                        }`}
                                      >
                                        <span className="font-medium">
                                          {String.fromCharCode(65 + optIdx)}.
                                        </span>{" "}
                                        {option}
                                        {optIdx === (typeof quiz.correctAnswer === 'string' ? parseInt(quiz.correctAnswer) : quiz.correctAnswer) && (
                                          <span className="ml-2 text-xs font-semibold">
                                            ✓ CORRECT
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No lessons found for this course.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
