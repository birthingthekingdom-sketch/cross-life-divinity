import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IdVerificationDeadlineAlert } from "@/components/IdVerificationDeadlineAlert";
import { 
  TrendingUp, 
  Award, 
  Zap, 
  BarChart3, 
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Star,
  Clock,
  FileCheck
} from "lucide-react";

export function StudentDashboard() {
  const [, navigate] = useLocation();
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  // Fetch user's enrolled courses
  const coursesQuery = trpc.courses.list.useQuery();
  const courses = coursesQuery.data || [];

  // Check ID verification deadline
  const verificationQuery = trpc.idVerification.checkVerificationDeadline.useQuery({});
  const verificationStatus = verificationQuery.data;

  // Fetch overall progress
  const progressQuery = trpc.progress.getAll.useQuery();
  const allProgress = progressQuery.data || [];

  // Fetch student progress summary
  const summaryQuery = trpc.progress.getStudentProgress.useQuery();
  const summary = summaryQuery.data;

  // Calculate stats
  const totalCoursesEnrolled = courses.length;
  const coursesCompleted = summary?.completedCourses || 0;
  const overallAverageScore = summary?.averageQuizScore || 0;
  const certificatesEarned = summary?.completedCourses || 0;

  // Get recommendations based on performance
  const getRecommendations = () => {
    const recommendations: string[] = [];

    if (overallAverageScore < 70) {
      recommendations.push("Focus on improving your quiz scores - aim for 70% or higher");
    }
    if (coursesCompleted === 0 && totalCoursesEnrolled > 0) {
      recommendations.push("Complete at least one course to earn your first certificate");
    }
    if (totalCoursesEnrolled === 0) {
      recommendations.push("Enroll in a course to start your learning journey");
    }

    return recommendations.length > 0
      ? recommendations
      : ["You're doing great! Keep up the excellent progress"];
  };

  const recommendations = getRecommendations();

  // Overview Mode
  if (viewMode === "overview") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and achievements</p>
          </div>

          {/* ID Verification Deadline Alert */}
          {verificationStatus?.hasEnrollments && (
            <IdVerificationDeadlineAlert enrollments={verificationStatus.enrollments} />
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {Math.round(overallAverageScore)}%
                    </p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Courses Completed</p>
                    <p className="text-3xl font-bold text-green-600">
                      {coursesCompleted}/{totalCoursesEnrolled}
                    </p>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Lessons Completed</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {allProgress.filter((p: any) => p.completed).length}
                    </p>
                  </div>
                  <Zap className="w-10 h-10 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Certificates</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {certificatesEarned}
                    </p>
                  </div>
                  <Award className="w-10 h-10 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Progress */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Enrolled Courses
              </CardTitle>
              <CardDescription>
                Your progress across all enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {courses.length > 0 ? (
                <div className="space-y-6">
                  {courses.map((course: any) => {
                    const courseProgress = allProgress.filter(
                      (p: any) => p.courseId === course.id
                    );
                    const completedLessons = courseProgress.filter(
                      (p: any) => p.completed
                    ).length;
                    const totalLessons = courseProgress.length;
                    const completionPercentage =
                      totalLessons > 0
                        ? Math.round((completedLessons / totalLessons) * 100)
                        : 0;
                    const isCertified = completionPercentage === 100;

                    return (
                      <div
                        key={course.id}
                        className="p-4 border rounded-lg hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {completedLessons} of {totalLessons} lessons completed
                            </p>
                          </div>
                          <Badge
                            variant={
                              isCertified ? "default" : "secondary"
                            }
                          >
                            {completionPercentage}%
                          </Badge>
                        </div>

                        <Progress
                          value={completionPercentage}
                          className="mb-3 h-2"
                        />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-blue-50 p-2 rounded">
                            <p className="text-muted-foreground text-xs">Status</p>
                            <p className="font-semibold text-blue-600">
                              {isCertified ? "Certified" : "In Progress"}
                            </p>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <p className="text-muted-foreground text-xs">Code</p>
                            <p className="font-semibold text-green-600">
                              {course.code}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No courses enrolled yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-8 border-2 border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertCircle className="w-5 h-5" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                    <span className="text-amber-900">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => setViewMode("detailed")}
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              View Detailed Analytics
            </Button>
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Detailed Mode
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setViewMode("overview")}
          className="mb-6"
        >
          ← Back to Overview
        </Button>

        <h1 className="text-3xl font-bold mb-8">Detailed Analytics</h1>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(overallAverageScore)}%
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Courses Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {coursesCompleted}/{totalCoursesEnrolled}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Lessons</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {allProgress.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificatesEarned > 0 ? (
                  <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
                    <p className="text-sm font-semibold text-amber-900">
                      {certificatesEarned} Certificate{certificatesEarned !== 1 ? 's' : ''} Earned
                    </p>
                    <p className="text-xs text-amber-700">
                      Complete all courses to earn certificates
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Complete a course to earn your first certificate
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Details */}
        {courses.map((course: any) => {
          const courseProgress = allProgress.filter(
            (p: any) => p.courseId === course.id
          );
          const completedLessons = courseProgress.filter(
            (p: any) => p.completed
          ).length;
          const totalLessons = courseProgress.length;
          const completionPercentage =
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

          return (
            <Card key={course.id} className="mb-6">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Completion</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {completionPercentage}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Lessons</p>
                    <p className="text-2xl font-bold text-green-600">
                      {completedLessons}/{totalLessons}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-lg font-bold text-purple-600">
                      {completionPercentage === 100 ? "Completed" : "In Progress"}
                    </p>
                  </div>
                </div>
                <Progress
                  value={completionPercentage}
                  className="mt-4 h-2"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
