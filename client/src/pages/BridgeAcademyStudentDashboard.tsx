import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  ArrowLeft, 
  BookOpen, 
  BarChart3, 
  Zap, 
  Target, 
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  LineChart
} from "lucide-react";

interface CourseWithProgress {
  id: number;
  code: string;
  title: string;
  description?: string;
  colorTheme: string;
  topicCount: number;
  progress?: {
    topicsCompleted: number;
    totalTopics: number;
    averageScore: number;
    lastActivityAt?: string;
    completedAt?: string;
  };
  latestQuiz?: {
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    submittedAt: string;
  };
}

export default function BridgeAcademyStudentDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("/api/bridge-academy/student-dashboard");
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboard();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const courses = dashboardData?.coursesWithProgress || [];
  const recentQuizzes = dashboardData?.recentQuizzes || [];
  const recentPractice = dashboardData?.recentPractice || [];
  const certificates = dashboardData?.certificates || [];
  const enrollment = dashboardData?.enrollment;

  // Calculate overall statistics
  const calculateOverallStats = () => {
    const coursesWithProgress = courses.filter((c: CourseWithProgress) => c.progress);
    const totalTopics = courses.reduce((sum: number, c: CourseWithProgress) => sum + (c.progress?.totalTopics || 0), 0);
    const completedTopics = courses.reduce((sum: number, c: CourseWithProgress) => sum + (c.progress?.topicsCompleted || 0), 0);
    const avgScore = coursesWithProgress.length > 0
      ? Math.round(coursesWithProgress.reduce((sum: number, c: CourseWithProgress) => sum + (c.progress?.averageScore || 0), 0) / coursesWithProgress.length)
      : 0;

    return {
      totalCourses: courses.length,
      coursesStarted: coursesWithProgress.length,
      coursesCompleted: coursesWithProgress.filter((c: CourseWithProgress) => c.progress?.completedAt).length,
      totalTopics,
      completedTopics,
      overallProgress: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
      averageScore: avgScore,
      totalAttempts: recentQuizzes.length,
    };
  };

  const stats = calculateOverallStats();

  // Get status badge
  const getStatusBadge = (course: CourseWithProgress) => {
    if (!course.progress) return <Badge variant="outline">Not Started</Badge>;
    if (course.progress.completedAt) return <Badge className="bg-green-600">Completed</Badge>;
    if (course.progress.topicsCompleted > 0) {
      return <Badge className="bg-blue-600">In Progress</Badge>;
    }
    return <Badge variant="outline">Started</Badge>;
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    return "text-amber-600";
  };

  // Get score badge
  const getScoreBadge = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Keep Practicing";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Bridge Academy GED Prep
              </h1>
              <p className="text-lg text-muted-foreground">
                Prepare for your GED exam with unlimited practice quizzes and personalized learning
              </p>
            </div>
            {enrollment?.status === "active" && (
              <Badge className="bg-green-600 text-white whitespace-nowrap">
                Active Subscription
              </Badge>
            )}
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(stats.overallProgress)}`}>
                {stats.overallProgress}%
              </div>
              <Progress value={stats.overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.completedTopics} of {stats.totalTopics} topics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore}%
              </div>
              <Badge variant="outline" className="text-xs">
                {getScoreBadge(stats.averageScore)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.coursesStarted}/{stats.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">Started</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.coursesCompleted}
              </div>
              <p className="text-xs text-muted-foreground">Courses finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="w-4 h-4" />
                Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {certificates.length}
              </div>
              <p className="text-xs text-muted-foreground">Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="courses" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">GED Courses</TabsTrigger>
            <TabsTrigger value="results">Quiz Results</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Available GED Courses</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course: CourseWithProgress) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
                          <CardDescription>{course.code}</CardDescription>
                        </div>
                        {getStatusBadge(course)}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {course.description && (
                        <p className="text-sm text-muted-foreground">{course.description}</p>
                      )}

                      {course.progress ? (
                        <>
                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Topic Progress</span>
                              <span className="text-sm text-muted-foreground">
                                {course.progress.topicsCompleted}/{course.progress.totalTopics}
                              </span>
                            </div>
                            <Progress
                              value={(course.progress.topicsCompleted / course.progress.totalTopics) * 100}
                              className="h-2"
                            />
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-3 bg-secondary/50 p-3 rounded-lg">
                            <div>
                              <p className="text-xs text-muted-foreground">Avg Score</p>
                              <p className={`text-lg font-semibold ${getScoreColor(course.progress.averageScore)}`}>
                                {course.progress.averageScore}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Topics</p>
                              <p className="text-lg font-semibold">{course.progress.topicsCompleted}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Last Activity</p>
                              <p className="text-xs font-medium">
                                {course.progress.lastActivityAt
                                  ? new Date(course.progress.lastActivityAt).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                          </div>

                          {course.latestQuiz && (
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                              <p className="text-xs font-medium text-blue-900 mb-1">Latest Quiz</p>
                              <p className="text-sm">
                                <span className={`font-semibold ${getScoreColor(course.latestQuiz.percentage)}`}>
                                  {course.latestQuiz.percentage}%
                                </span>
                                <span className="text-muted-foreground ml-2">
                                  ({course.latestQuiz.score}/{course.latestQuiz.totalQuestions})
                                </span>
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                          <p className="text-sm text-amber-900">
                            Start learning this course to track your progress
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={() => navigate(`/bridge-academy/course/${course.id}`)}
                        className="w-full"
                        size="lg"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {course.progress ? "Continue Learning" : "Start Course"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Quiz Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Recent Quiz Results</h2>

              {recentQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {recentQuizzes.map((quiz: any, index: number) => (
                    <Card key={index} className="hover:bg-secondary/50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">Topic Quiz</h3>
                              <Badge variant="outline" className="text-xs">
                                {new Date(quiz.submittedAt).toLocaleDateString()}
                              </Badge>
                              {quiz.passed ? (
                                <Badge className="bg-green-600 text-xs">Passed</Badge>
                              ) : (
                                <Badge className="bg-red-600 text-xs">Needs Review</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Score: {quiz.score}/{quiz.totalQuestions}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${getScoreColor(quiz.percentage)}`}>
                              {quiz.percentage}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(quiz.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No quiz results yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start a course and take quizzes to see your results here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Practice Attempts */}
            {recentPractice.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Recent Practice Attempts</h2>
                <div className="space-y-3">
                  {recentPractice.map((attempt: any, index: number) => (
                    <Card key={index} className="hover:bg-secondary/50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">Practice Attempt #{attempt.attemptNumber}</h3>
                              <Badge variant="outline" className="text-xs">
                                {attempt.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Score: {attempt.score}/{attempt.totalQuestions}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                              {attempt.percentage}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(attempt.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Certificates</h2>

              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert: any, index: number) => (
                    <Card key={index} className="border-2 border-amber-200 bg-amber-50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">GED Prep Certificate</CardTitle>
                            <CardDescription>Certificate #{cert.certificateNumber}</CardDescription>
                          </div>
                          <Award className="w-8 h-8 text-amber-600" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Completion Date</p>
                          <p className="font-semibold">
                            {new Date(cert.completionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Average Score</p>
                          <p className={`text-2xl font-bold ${getScoreColor(cert.averageScore)}`}>
                            {cert.averageScore}%
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/verify-certificate/${cert.verificationToken}`)}
                        >
                          View Certificate
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No certificates yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete all topics in a course to earn a certificate
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Study Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Study Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✓ Take practice quizzes regularly to identify weak areas</p>
            <p>✓ Aim for 80%+ on each subject before taking the full exam</p>
            <p>✓ Review explanations for incorrect answers to learn from mistakes</p>
            <p>✓ Track your progress and focus on improvement areas</p>
            <p>✓ Use the adaptive difficulty to challenge yourself appropriately</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
