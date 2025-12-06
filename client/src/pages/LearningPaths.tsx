import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, GraduationCap, Target } from "lucide-react";
import { Link } from "wouter";

export default function LearningPaths() {
  const { data: paths, isLoading } = trpc.bundles.getActiveLearningPaths.useQuery();
  const { data: enrolledCourses } = trpc.courses.list.useQuery();
  const { data: allProgress } = trpc.progress.getAll.useQuery();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "advanced":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "beginner":
        return <GraduationCap className="h-4 w-4" />;
      case "intermediate":
        return <BookOpen className="h-4 w-4" />;
      case "advanced":
        return <Target className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const calculatePathProgress = (pathCourses: any[]) => {
    if (!enrolledCourses || !allProgress || pathCourses.length === 0) return 0;

    const enrolledCourseIds = new Set(enrolledCourses.map((e: any) => e.id));
    const enrolledPathCourses = pathCourses.filter((c: any) => enrolledCourseIds.has(c.id));
    
    if (enrolledPathCourses.length === 0) return 0;

    let completedLessons = 0;
    let totalLessons = 0;

    enrolledPathCourses.forEach((course: any) => {
      totalLessons += course.totalLessons || 0;
      const courseProgress = allProgress.filter((p: any) => p.courseId === course.id && p.completed);
      completedLessons += courseProgress.length;
    });

    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading learning paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="bg-primary text-white shadow-lg">
        <div className="container py-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-3">Learning Paths</h1>
          <p className="text-white/90 text-lg max-w-3xl">
            Structured course sequences designed to help you achieve specific ministry goals. Follow a path from start to finish for comprehensive training.
          </p>
        </div>
      </div>

      {/* Learning Paths Grid */}
      <div className="container py-12">
        <div className="grid gap-8 max-w-6xl mx-auto">
          {paths?.map((path: any) => {
            const pathProgress = calculatePathProgress(path.courses);
            const requiredCourses = path.courses.filter((c: any) => c.isRequired);
            const optionalCourses = path.courses.filter((c: any) => !c.isRequired);

            return (
              <Card key={path.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getLevelColor(path.level)} flex items-center gap-1`}>
                          {getLevelIcon(path.level)}
                          {path.level.charAt(0).toUpperCase() + path.level.slice(1)}
                        </Badge>
                        {path.duration && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {path.duration}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl mb-2">{path.name}</CardTitle>
                      <CardDescription className="text-base">{path.description}</CardDescription>
                    </div>
                  </div>
                  
                  {path.goal && (
                    <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="flex items-start gap-2">
                        <Target className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-accent mb-1">Learning Goal</div>
                          <div className="text-sm text-muted-foreground">{path.goal}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {pathProgress > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Your Progress</span>
                        <span className="text-sm text-muted-foreground">{Math.round(pathProgress)}%</span>
                      </div>
                      <Progress value={pathProgress} className="h-2" />
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-6">
                  {/* Required Courses */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Required Courses ({requiredCourses.length})
                    </h3>
                    <div className="space-y-2">
                      {requiredCourses.map((course: any, index: number) => (
                        <Link key={course.id} href={`/course/${course.id}`}>
                          <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-accent/5 transition-colors cursor-pointer">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{course.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {course.code} • {course.totalLessons} lessons • {course.cpdHours} CPD hours
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              View →
                            </Button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Optional Courses */}
                  {optionalCourses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        Optional Courses ({optionalCourses.length})
                      </h3>
                      <div className="space-y-2">
                        {optionalCourses.map((course: any, index: number) => (
                          <Link key={course.id} href={`/course/${course.id}`}>
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed hover:border-primary/50 hover:bg-accent/5 transition-colors cursor-pointer">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                                {requiredCourses.length + index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{course.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {course.code} • {course.totalLessons} lessons • {course.cpdHours} CPD hours
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                View →
                              </Button>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(!paths || paths.length === 0) && (
          <div className="text-center py-12 bg-card rounded-lg border max-w-2xl mx-auto">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Learning Paths Available</h3>
            <p className="text-muted-foreground">
              Learning paths will be available soon to guide your theological education journey.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
