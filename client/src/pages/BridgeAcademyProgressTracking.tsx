import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LessonProgressBar, MultiCourseProgress } from '@/components/LessonProgressBar';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, BookOpen, TrendingUp } from 'lucide-react';

export default function BridgeAcademyProgressTracking() {
  const [, navigate] = useLocation();
  const [courseStats, setCourseStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all GED course stats using tRPC
  const { data: stats, isLoading, isError } = trpc.lessonProgress.getAllGedStats.useQuery();

  useEffect(() => {
    if (stats) {
      setCourseStats(stats);
      setLoading(false);
    }
  }, [stats]);

  useEffect(() => {
    if (isError) {
      setError('Failed to load progress data');
      setLoading(false);
    }
  }, [isError]);

  const handleCourseClick = (courseId: number) => {
    navigate(`/bridge-academy/course/${courseId}`);
  };

  const handleBack = () => {
    navigate('/bridge-academy');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Calculate overall statistics
  const totalLessons = courseStats.reduce((sum, course) => sum + course.totalLessons, 0);
  const completedLessons = courseStats.reduce((sum, course) => sum + course.completedLessons, 0);
  const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bridge Academy
          </Button>

          <div className="mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              GED Preparation Progress
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your progress across all four GED courses
            </p>
          </div>

          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{overallPercentage}%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Courses Enrolled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{courseStats.length}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  GED preparation courses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Lessons Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{completedLessons}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total lessons completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress Bar */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Overall Progress</CardTitle>
              <CardDescription>
                Complete all lessons to master GED preparation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LessonProgressBar
                completed={completedLessons}
                total={totalLessons}
                showPercentage={true}
                size="lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Course Progress Cards */}
        {error ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : courseStats.length > 0 ? (
          <MultiCourseProgress
            courses={courseStats}
            onCourseClick={handleCourseClick}
          />
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                You haven't enrolled in any GED courses yet.
              </p>
              <Button
                onClick={() => navigate('/bridge-academy')}
                className="mt-4"
              >
                Browse GED Courses
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        {courseStats.length > 0 && (
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Study Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>• Complete lessons in order for better understanding</p>
              <p>• Review completed lessons to reinforce concepts</p>
              <p>• Take practice quizzes after each lesson</p>
              <p>• Set a consistent study schedule</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
