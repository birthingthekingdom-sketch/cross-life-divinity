import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { Link, useParams } from "wouter";
import { useMemo } from "react";

export default function CoursePage() {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id || "0");

  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery({ id: courseId });
  const { data: lessons, isLoading: lessonsLoading } = trpc.lessons.getByCourse.useQuery({ courseId });
  const { data: progress } = trpc.progress.getByCourse.useQuery({ courseId });

  const completedLessons = useMemo(() => {
    if (!progress) return new Set<number>();
    return new Set(progress.filter(p => p.completed).map(p => p.lessonId));
  }, [progress]);

  const progressPercent = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    return (completedLessons.size / lessons.length) * 100;
  }, [lessons, completedLessons]);

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Course not found</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Course Header */}
      <div 
        className="text-white shadow-lg"
        style={{ backgroundColor: course.colorTheme }}
      >
        <div className="container py-8">
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3">
                {course.code}
              </div>
              <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-white/90 text-lg max-w-3xl">{course.description}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="text-sm text-white/80 mb-2">Course Progress</div>
              <div className="text-3xl font-bold mb-2">
                {completedLessons.size} / {lessons?.length || 0}
              </div>
              <Progress value={progressPercent} className="h-2 bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Course Lessons
          </h2>

          <div className="space-y-3">
            {lessons?.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              
              return (
                <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                  <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/50 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Lesson {index + 1}
                            </span>
                            {isCompleted && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                Completed
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {lesson.title}
                          </h3>
                        </div>
                        <div className="flex-shrink-0">
                          <Button variant="ghost" size="sm">
                            {isCompleted ? "Review" : "Start"} →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {lessons?.length === 0 && (
            <div className="text-center py-12 bg-card rounded-lg border">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Lessons Yet</h3>
              <p className="text-muted-foreground">
                Lessons for this course will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
