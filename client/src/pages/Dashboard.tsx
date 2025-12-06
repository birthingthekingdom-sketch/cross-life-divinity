import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PullToRefresh } from "@/components/PullToRefresh";
import { trpc } from "@/lib/trpc";
import { Award, BookOpen, GraduationCap, LogOut, TrendingUp, Video, RefreshCw, Settings } from "lucide-react";
import { Link } from "wouter";
import { useMemo } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const utils = trpc.useUtils();
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery();
  const { data: allProgress } = trpc.progress.getAll.useQuery();
  const { data: bundles } = trpc.bundles.getActiveBundles.useQuery();
  const { data: paths } = trpc.bundles.getActiveLearningPaths.useQuery();
  const { data: myEnrolledPaths } = trpc.bundles.getMyEnrolledPaths.useQuery();
  
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
              <Link href="/webinars">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Webinars
                </Button>
              </Link>
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
              {user?.role === 'admin' && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500/20 border-green-400/30 text-primary-foreground hover:bg-green-500/30"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/toggle-role">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-500/20 border-blue-400/30 text-primary-foreground hover:bg-blue-500/30"
                  title={`Switch to ${user?.role === 'admin' ? 'Student' : 'Admin'} View`}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {user?.role === 'admin' ? 'Student' : 'Admin'} View
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
            Welcome!
          </h2>
          <p className="text-muted-foreground">
            Continue your theological education journey. Select a course below to begin or continue your studies.
          </p>
        </div>

        {/* Active Learning Path Section */}
        {myEnrolledPaths && myEnrolledPaths.length > 0 && paths && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">My Active Learning Path</h2>
            {(() => {
              const enrolledPath = paths.find((p: any) => p.id === myEnrolledPaths[0].learningPathId);
              if (!enrolledPath) return null;
              
              const pathCourses = enrolledPath.courses || [];
              const completedCourses = pathCourses.filter((c: any) => {
                const progress = allProgress?.find((p: any) => p.courseId === c.id);
                return progress?.completed;
              });
              const inProgressCourses = pathCourses.filter((c: any) => {
                const progress = allProgress?.find((p: any) => p.courseId === c.id);
                return progress && !progress.completed;
              });
              const notStartedCourses = pathCourses.filter((c: any) => {
                const progress = allProgress?.find((p: any) => p.courseId === c.id);
                return !progress;
              });
              const completionPercentage = pathCourses.length > 0 
                ? Math.round((completedCourses.length / pathCourses.length) * 100) 
                : 0;
              const nextCourse = inProgressCourses[0] || notStartedCourses[0];
              
              return (
                <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{enrolledPath.name}</CardTitle>
                          <Badge variant="secondary">
                            {completedCourses.length} / {pathCourses.length} completed
                          </Badge>
                        </div>
                        <CardDescription className="mt-2">{enrolledPath.description}</CardDescription>
                      </div>
                      <Link href="/learning-paths">
                        <Button variant="outline">
                          View Details →
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm font-semibold text-primary">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-3" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-700">{completedCourses.length}</div>
                        <div className="text-sm text-green-600">Completed</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">{inProgressCourses.length}</div>
                        <div className="text-sm text-blue-600">In Progress</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-gray-700">{notStartedCourses.length}</div>
                        <div className="text-sm text-gray-600">Not Started</div>
                      </div>
                    </div>
                    {nextCourse && (
                      <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                        <div className="text-sm font-semibold text-accent mb-2">Next Recommended Course</div>
                        <Link href={`/course/${nextCourse.id}`}>
                          <div className="flex items-center justify-between hover:bg-accent/5 p-2 rounded transition-colors cursor-pointer">
                            <div>
                              <div className="font-medium">{nextCourse.title}</div>
                              <div className="text-sm text-muted-foreground">{nextCourse.code}</div>
                            </div>
                            <Button size="sm">
                              {inProgressCourses.includes(nextCourse) ? 'Continue' : 'Start'} →
                            </Button>
                          </div>
                        </Link>
                      </div>
                    )}
                    {completionPercentage === 100 && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-green-700 mb-1">Congratulations!</div>
                            <div className="text-sm text-green-600">You've completed this learning path</div>
                          </div>
                          <Link href={`/path-certificate/${enrolledPath.id}`}>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              View Certificate
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}

        {/* Learning Paths Section */}
        {paths && paths.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Learning Paths</h2>
              <Link href="/learning-paths">
                <Button variant="outline" size="sm">
                  View All Paths →
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paths.slice(0, 3).map((path: any) => (
                <Link key={path.id} href="/learning-paths">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
                    <CardHeader className="bg-gradient-to-br from-purple-50 to-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-primary uppercase">
                          {path.level}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{path.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription className="text-sm mb-3 line-clamp-2">
                        {path.description}
                      </CardDescription>
                      <div className="text-sm text-muted-foreground">
                        {path.courses.length} courses • {path.duration}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Course Bundles Section */}
        {bundles && bundles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Course Bundles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bundles.map((bundle: any) => {
                // Calculate bundle progress
                const bundleCourseIds = bundle.courses.map((c: any) => c.id);
                const enrolledBundleCourses = courses?.filter((c: any) => bundleCourseIds.includes(c.id)) || [];
                let totalLessons = 0;
                let completedLessons = 0;
                
                enrolledBundleCourses.forEach((course: any) => {
                  totalLessons += course.totalLessons || 0;
                  const courseCompleted = allProgress?.filter(
                    (p: any) => p.courseId === course.id && p.completed
                  ).length || 0;
                  completedLessons += courseCompleted;
                });
                
                const bundleProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

                return (
                  <Card key={bundle.id} className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                    <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-primary uppercase">Bundle</span>
                      </div>
                      <CardTitle className="text-lg">{bundle.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription className="text-sm mb-4 line-clamp-2">
                        {bundle.description}
                      </CardDescription>
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          {bundle.courses.length} courses included
                        </div>
                        {bundleProgress > 0 && (
                          <div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Bundle Progress</span>
                              <span>{Math.round(bundleProgress)}%</span>
                            </div>
                            <Progress value={bundleProgress} className="h-2" />
                          </div>
                        )}
                        <div className="space-y-1">
                          {bundle.courses.slice(0, 3).map((course: any) => (
                            <Link key={course.id} href={`/course/${course.id}`}>
                              <div className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                                <span>→</span>
                                <span className="line-clamp-1">{course.title}</span>
                              </div>
                            </Link>
                          ))}
                          {bundle.courses.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              + {bundle.courses.length - 3} more courses
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Courses Grid */}
        <h2 className="text-2xl font-bold text-foreground mb-6">All Courses</h2>
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
