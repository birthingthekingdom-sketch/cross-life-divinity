import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { BridgeAcademyNav } from "@/components/BridgeAcademyNav";
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
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <BridgeAcademyNav currentPage="dashboard" />
        <div className="p-4 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <BridgeAcademyNav currentPage="dashboard" />
      <div className="p-4">
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
            <div>
              <h1 className="text-4xl font-bold mb-2">GED Progress Dashboard</h1>
              <p className="text-muted-foreground">Track your progress across all GED subjects</p>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                    <p className="text-3xl font-bold">{stats.overallProgress}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Courses Completed</p>
                    <p className="text-3xl font-bold">{stats.coursesCompleted}/{stats.totalCourses}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-bold">{stats.averageScore}%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Quiz Attempts</p>
                    <p className="text-3xl font-bold">{stats.totalAttempts}</p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="quizzes">Recent Quizzes</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-4">
              <div className="grid gap-4">
                {courses.map((course: CourseWithProgress) => (
                  <Card key={course.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">{course.title}</CardTitle>
                          <CardDescription className="text-blue-100">{course.code}</CardDescription>
                        </div>
                        {getStatusBadge(course)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {course.progress ? (
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Topics Completed</span>
                              <span className="text-sm text-muted-foreground">
                                {course.progress.topicsCompleted}/{course.progress.totalTopics}
                              </span>
                            </div>
                            <Progress 
                              value={(course.progress.topicsCompleted / course.progress.totalTopics) * 100} 
                              className="h-2"
                            />
                          </div>
                          {course.latestQuiz && (
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium">Latest Quiz Score</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(course.latestQuiz.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`text-lg font-bold ${getScoreColor(course.latestQuiz.percentage)}`}>
                                {course.latestQuiz.percentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Not started yet</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="space-y-4">
              {recentQuizzes.length > 0 ? (
                <div className="grid gap-4">
                  {recentQuizzes.map((quiz: any, idx: number) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{quiz.topicName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(quiz.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${getScoreColor(quiz.percentage)}`}>
                              {quiz.percentage}%
                            </p>
                            <p className="text-xs text-muted-foreground">{getScoreBadge(quiz.percentage)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No quizzes taken yet
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates" className="space-y-4">
              {certificates.length > 0 ? (
                <div className="grid gap-4">
                  {certificates.map((cert: any, idx: number) => (
                    <Card key={idx} className="bg-gradient-to-r from-amber-50 to-amber-100">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Award className="w-6 h-6 text-amber-600" />
                            <div>
                              <p className="font-medium">{cert.courseName}</p>
                              <p className="text-sm text-muted-foreground">
                                Earned {new Date(cert.earnedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    Complete all courses to earn certificates
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
