import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Award, BookOpen, CheckCircle2, Clock, Loader2, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Progress() {
  const { user } = useAuth();
  const { data: progressData, isLoading } = trpc.progress.getStudentProgress.useQuery();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Please Log In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You need to be logged in to view your progress.</p>
            <Link href="/enroll">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const {
    totalCourses = 0,
    completedCourses = 0,
    totalLessons = 0,
    completedLessons = 0,
    totalCPDHours = 0,
    earnedCPDHours = 0,
    averageQuizScore = 0,
    courseProgress = [],
    recentActivity = []
  } = progressData || {};

  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif">My Learning Progress</h1>
              <p className="text-blue-100 mt-1">Track your theological education journey</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Back to Courses
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{Math.round(overallProgress)}%</div>
              <ProgressBar value={overallProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-amber-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">
                {completedCourses}/{totalCourses}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {completedCourses} courses completed
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">CPD Hours</CardTitle>
                <Award className="h-4 w-4 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                {earnedCPDHours}/{totalCPDHours}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                CPD hours earned
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Quiz Average</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-purple-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{Math.round(averageQuizScore)}%</div>
              <p className="text-xs text-muted-foreground mt-2">
                Average quiz score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courseProgress.length > 0 ? (
                courseProgress.map((course: any) => {
                  const progress = course.totalLessons > 0 
                    ? (course.completedLessons / course.totalLessons) * 100 
                    : 0;
                  
                  return (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {course.code} • {course.completedLessons}/{course.totalLessons} lessons • {course.cpdHours} CPD hours
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-900">{Math.round(progress)}%</div>
                          {progress === 100 && (
                            <span className="text-xs text-green-600 font-medium">✓ Completed</span>
                          )}
                        </div>
                      </div>
                      <ProgressBar value={progress} className="h-2" />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No course progress yet. Start learning to see your progress here!</p>
                  <Link href="/dashboard">
                    <Button className="mt-4">Browse Courses</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.lessonTitle}</p>
                      <p className="text-sm text-muted-foreground">{activity.courseTitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.completedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No recent activity. Complete lessons to see them here!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
