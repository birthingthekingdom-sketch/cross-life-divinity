import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PullToRefresh } from "@/components/PullToRefresh";
import { trpc } from "@/lib/trpc";
import { Award, BookOpen, GraduationCap, LogOut, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useMemo } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const utils = trpc.useUtils();
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery();
  const { data: allProgress } = trpc.progress.getAll.useQuery();
  
  const handleRefresh = async () => {
    await Promise.all([
      utils.courses.list.invalidate(),
      utils.progress.getAll.invalidate()
    ]);
  };

  // Calculate progress for each course
  const courseProgress = useMemo(() => {
    if (!courses || !allProgress) return {};
    
    const progressMap: Record<number, { completed: number; total: number }> = {};
    
    courses.forEach(course => {
      const completed = allProgress.filter(
        p => p.courseId === course.id && p.completed
      ).length;
      progressMap[course.id] = {
        completed,
        total: course.totalLessons
      };
    });
    
    return progressMap;
  }, [courses, allProgress]);

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary-foreground/20 p-3 rounded-lg">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Cross Life School of Divinity</h1>
                <p className="text-primary-foreground/80 mt-1">Online Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{user?.name || "Student"}</p>
                <p className="text-sm text-primary-foreground/70">{user?.email}</p>
              </div>
              <Link href="/progress">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  My Progress
                </Button>
              </Link>
              <Link href="/certificates">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Award className="h-4 w-4 mr-2" />
                  My Certificates
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Message */}
      <div className="container py-8">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0] || "Student"}!
          </h2>
          <p className="text-muted-foreground">
            Continue your theological education journey. Select a course below to begin or continue your studies.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => {
            const progress = courseProgress[course.id] || { completed: 0, total: course.totalLessons };
            const progressPercent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

            return (
              <Link key={course.id} href={`/course/${course.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
                  <CardHeader 
                    className="text-card-foreground min-h-[140px] relative overflow-hidden"
                    style={{ backgroundColor: course.colorTheme }}
                  >
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                      {course.code}
                    </div>
                    <CardTitle className="text-white text-xl mb-2 pr-20">{course.title}</CardTitle>
                    {progress.total > 0 && (
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs text-white/90 mb-1">
                          <span>Progress</span>
                          <span>{progress.completed} / {progress.total} lessons</span>
                        </div>
                        <Progress value={progressPercent} className="h-2 bg-white/30" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription className="text-sm mb-4 line-clamp-2">
                      {course.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.totalLessons} lessons</span>
                      </div>
                      {progressPercent === 100 ? (
                        <span className="text-green-600 font-semibold">✓ Completed</span>
                      ) : progressPercent > 0 ? (
                        <span className="text-primary font-semibold">In Progress</span>
                      ) : (
                        <span className="text-muted-foreground">Not Started</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {courses?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Courses Available</h3>
            <p className="text-muted-foreground">
              Please contact your administrator to get access to courses.
            </p>
          </div>
        )}
      </div>
    </div>
    </PullToRefresh>
  );
}
