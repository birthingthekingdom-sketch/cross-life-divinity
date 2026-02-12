import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CPEAccreditationBadge } from "@/components/CPEAccreditationBadge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, Award, BookOpen, CheckCircle2, Circle, Download, MessageSquare, Video } from "lucide-react";
import { Link, useParams } from "wouter";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// Helper function to determine if text should be dark or light based on background color
function getTextColor(hexColor: string): { textColor: string; textClass: string } {
  // Convert hex to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // If background is light (luminance > 0.6), use dark text; otherwise use white
  if (luminance > 0.6) {
    return { textColor: '#1a1a1a', textClass: 'text-gray-900' };
  }
  return { textColor: '#ffffff', textClass: 'text-white' };
}

export default function CoursePage() {
  const params = useParams<{ id: string }>();
  const paramId = params.id || "0";
  const isNumericId = /^\d+$/.test(paramId);
  const courseId = isNumericId ? parseInt(paramId) : 0;
  const courseCode = !isNumericId ? paramId : "";
  const { isAuthenticated } = useAuth();

  // Try to get course by numeric ID first, then by code
  const { data: courseById, isLoading: courseByIdLoading } = trpc.courses.getById.useQuery(
    { id: courseId },
    { enabled: isNumericId }
  );
  const { data: courseByCode, isLoading: courseByCodeLoading } = trpc.courses.getByCode.useQuery(
    { code: courseCode },
    { enabled: !isNumericId }
  );
  const course = courseById || courseByCode;
  const courseLoading = courseByIdLoading || courseByCodeLoading;
  const actualCourseId = course?.id || courseId;
  
  // Only check enrollment if user is logged in
  const { data: enrollmentCheck } = trpc.courses.checkEnrollment.useQuery(
    { courseId: actualCourseId },
    { enabled: isAuthenticated && !!course }
  );
  
  const { data: lessons, isLoading: lessonsLoading } = trpc.lessons.getByCourse.useQuery(
    { courseId: actualCourseId },
    { enabled: !!course }
  );
  
  // Only fetch progress if user is logged in
  const { data: progress } = trpc.progress.getByCourse.useQuery(
    { courseId: actualCourseId },
    { enabled: isAuthenticated && !!course }
  );
  
  const { data: certificateEligibility } = trpc.certificates.checkEligibility.useQuery(
    { courseId: actualCourseId },
    { enabled: isAuthenticated && !!course }
  );
  
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  
  const generateCertificateMutation = trpc.certificates.generate.useMutation({
    onSuccess: (data) => {
      // Download the certificate
      window.open(`/api/certificate/${data.certificateNumber}`, '_blank');
      toast.success("Certificate generated successfully!");
      setGeneratingCertificate(false);
    },
    onError: () => {
      toast.error("Failed to generate certificate");
      setGeneratingCertificate(false);
    },
  });

  const completedLessons = useMemo(() => {
    if (!progress) return new Set<number>();
    return new Set(progress.filter(p => p.completed).map(p => p.lessonId));
  }, [progress]);

  const progressPercent = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    return (completedLessons.size / lessons.length) * 100;
  }, [lessons, completedLessons]);

  // Only show loading if course is loading (lessons query might be disabled)
  if (courseLoading || (isAuthenticated && lessonsLoading)) {
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
          <Link href="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If user is not logged in, show course info with sign up prompt
  if (!isAuthenticated) {
    const textColorInfo = getTextColor(course.colorTheme || '#ffffff');
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Course Header */}
        <div 
          className={`${textColorInfo.textClass} shadow-lg`}
          style={{ backgroundColor: course.colorTheme }}
        >
          <div className="container py-8">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
                  {course.code}
                </div>
                <h1 className="text-4xl font-bold mb-3" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>{course.title}</h1>
                <p className="text-white/90 text-lg max-w-3xl" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>{course.description}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
                <div className="text-sm text-white/80 mb-2">Total Lessons</div>
                <div className="text-3xl font-bold mb-2">
                  {lessons?.length || 0}
                </div>
                <div className="text-sm text-white/80">CPD Hours: {course.cpdHours}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info for Non-Logged-In Users */}
        <div className="container py-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{course.description}</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Lessons</div>
                  <div className="text-2xl font-bold">{lessons?.length || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">CPD Hours</div>
                  <div className="text-2xl font-bold">{course.cpdHours}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="text-2xl font-bold">${course.price}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/signup">
                  <Button className="flex-1">Sign Up</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="flex-1">Log In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Course Lessons ({lessons?.length || 0})
          </h2>

          <div className="space-y-3">
            {lessons?.slice(0, 3).map((lesson, index) => (
              <Card key={lesson.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Lesson {index + 1}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {lesson.title}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {lessons && lessons.length > 3 && (
              <Card className="bg-muted/50">
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground">
                    + {lessons.length - 3} more lessons available after enrollment
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Check if user is enrolled (for logged-in users)
  if (enrollmentCheck && !enrollmentCheck.enrolled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Enrollment Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You need to enroll in this course to access the lessons and content.
            </p>
            <div className="flex gap-2">
              <Link href="/pricing">
                <Button className="flex-1">View Pricing</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="flex-1">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logged-in user with enrollment - show full course content
  const textColorInfo = getTextColor(course.colorTheme || '#ffffff');
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Course Header */}
      <div 
        className={`${textColorInfo.textClass} shadow-lg`}
        style={{ backgroundColor: course.colorTheme }}
      >
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href={`/forum/${course.id}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Discussion Forum
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
                {course.code}
              </div>
              <h1 className="text-4xl font-bold mb-3" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>{course.title}</h1>
              <p className="text-white/90 text-lg max-w-3xl" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>{course.description}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="text-sm text-white/80 mb-2">Course Progress</div>
              <div className="text-3xl font-bold mb-2">
                {Math.round(progressPercent)}%
              </div>
              <Progress value={progressPercent} className="h-2 mb-2" />
              <div className="text-xs text-white/80">
                {completedLessons.size} / {lessons?.length || 0} lessons
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container py-8">
        {/* Lessons Grid */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Course Lessons
        </h2>

        <div className="space-y-3">
          {lessons?.map((lesson, index) => {
            const isCompleted = completedLessons.has(lesson.id);
            return (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
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
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Completed
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {lesson.title}
                        </h3>
                      </div>
                      <Button variant="ghost" size="sm">
                        {isCompleted ? 'Review' : 'Start'} →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Certificate Section */}
        {certificateEligibility?.eligible && (
          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-2 flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Congratulations!
                </h3>
                <p className="text-green-700">
                  You've completed all lessons in this course. Download your certificate now.
                </p>
              </div>
              <Button
                onClick={() => {
                  setGeneratingCertificate(true);
                  generateCertificateMutation.mutate({ courseId: actualCourseId });
                }}
                disabled={generatingCertificate}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                {generatingCertificate ? 'Generating...' : 'Download Certificate'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
