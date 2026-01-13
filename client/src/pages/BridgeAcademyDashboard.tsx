import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, BookOpen, BarChart3, Zap, Target, TrendingUp } from "lucide-react";

interface SubjectStats {
  name: string;
  code: string;
  lessonCount: number;
  completedLessons: number;
  averageScore: number;
  attemptCount: number;
  lastAttemptDate?: string;
}

export default function BridgeAcademyDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Subject data
  const subjects: SubjectStats[] = [
    {
      name: "Mathematical Reasoning",
      code: "MATH",
      lessonCount: 3,
      completedLessons: 2,
      averageScore: 78,
      attemptCount: 5,
      lastAttemptDate: "Dec 30, 2024",
    },
    {
      name: "Reasoning Through Language Arts",
      code: "LANG",
      lessonCount: 3,
      completedLessons: 1,
      averageScore: 82,
      attemptCount: 3,
      lastAttemptDate: "Dec 29, 2024",
    },
    {
      name: "Science",
      code: "SCI",
      lessonCount: 3,
      completedLessons: 0,
      averageScore: 0,
      attemptCount: 0,
    },
    {
      name: "Social Studies",
      code: "SOCIAL",
      lessonCount: 3,
      completedLessons: 0,
      averageScore: 0,
      attemptCount: 0,
    },
  ];

  const handleStartQuiz = (subjectCode: string) => {
    navigate(`/bridge-academy/practice-quiz/${subjectCode}`);
  };

  const calculateOverallProgress = () => {
    const totalLessons = subjects.reduce((sum, s) => sum + s.lessonCount, 0);
    const completedLessons = subjects.reduce((sum, s) => sum + s.completedLessons, 0);
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const calculateAverageScore = () => {
    const attemptedSubjects = subjects.filter((s) => s.attemptCount > 0);
    if (attemptedSubjects.length === 0) return 0;
    const totalScore = attemptedSubjects.reduce((sum, s) => sum + s.averageScore, 0);
    return Math.round(totalScore / attemptedSubjects.length);
  };

  const overallProgress = calculateOverallProgress();
  const averageScore = calculateAverageScore();
  const totalAttempts = subjects.reduce((sum, s) => sum + s.attemptCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
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

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Bridge Academy GED Prep
              </h1>
              <p className="text-lg text-muted-foreground">
                Prepare for your GED exam with unlimited practice quizzes
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="text-2xl font-bold text-primary">$19/month</div>
                <div className="text-sm text-muted-foreground">or $180/year • Lifetime Access</div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="text-2xl font-semibold text-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Overall Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {subjects.reduce((sum, s) => sum + s.completedLessons, 0)} of{" "}
                {subjects.reduce((sum, s) => sum + s.lessonCount, 0)} lessons
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">{averageScore}%</div>
              <Badge variant="outline" className="text-xs">
                {averageScore >= 80 ? "Excellent" : averageScore >= 70 ? "Good" : "Keep Practicing"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalAttempts}</div>
              <p className="text-xs text-muted-foreground">Practice quizzes completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 mb-2">4</div>
              <p className="text-xs text-muted-foreground">Ready to practice</p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Practice Quizzes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Practice by Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.code} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{subject.name}</CardTitle>
                      <CardDescription>{subject.code} Subject</CardDescription>
                    </div>
                    <Badge variant="secondary">{subject.lessonCount} Lessons</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Lesson Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {subject.completedLessons}/{subject.lessonCount}
                      </span>
                    </div>
                    <Progress
                      value={(subject.completedLessons / subject.lessonCount) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 bg-secondary/50 p-3 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                      <p className="text-lg font-semibold">
                        {subject.averageScore > 0 ? `${subject.averageScore}%` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Attempts</p>
                      <p className="text-lg font-semibold">{subject.attemptCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Try</p>
                      <p className="text-xs font-medium">
                        {subject.lastAttemptDate ? subject.lastAttemptDate.split(",")[0] : "—"}
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleStartQuiz(subject.code)}
                    className="w-full"
                    size="lg"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Start Practice Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips Section */}
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
            <p>✓ Review explanations for incorrect answers</p>
            <p>✓ Track your progress and focus on improvement areas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
