import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CoursePreviewModal } from "@/components/CoursePreviewModal";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, Award, BookOpen, CheckCircle2, Circle, Download, MessageSquare, Video, Eye } from "lucide-react";
import { Link, useParams } from "wouter";
import { useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function CoursePageEnhanced() {
  const params = useParams<{ id: string }>();
  const paramId = params.id || "0";
  const isNumericId = /^\d+$/.test(paramId);
  const courseId = isNumericId ? parseInt(paramId) : 0;
  const courseCode = !isNumericId ? paramId : "";
  const { isAuthenticated } = useAuth();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    return (
      <>
        <CoursePreviewModal
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          courseTitle={course.title}
          courseDescription={course.description || undefined}
          courseCode={course.code || undefined}
          lessons={lessons?.slice(0, 1).map((l, idx) => ({
            id: l.id,
            title: l.title,
            description: l.content || undefined,
            videoUrl: undefined,
            duration: undefined,
            order: idx + 1
          })) || []}
          quizzes={[]}
          previewLessonId={lessons?.[0]?.id}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
          {/* Course Header */}
          <div 
            className="text-white shadow-lg"
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
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {course.code}
                  </div>
                  <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
                  <p className="text-white/90 text-lg max-w-3xl">{course.description}</p>
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
            <div className="max-w-4xl mx-auto">
              {/* Intro Video Section */}
              {course.introVideoUrl && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      Course Introduction Video
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VideoPlayer 
                      url={course.introVideoUrl} 
                      title={`${course.title} Introduction`}
                    />
                  </CardContent>
                </Card>
              )}

              <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Explore This Course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Get a preview of what's included in this course before enrolling.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsPreviewOpen(true)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Course
                    </Button>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full">Sign Up to Enroll</Button>
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
        </div>
      </>
    );
  }

  // Check if user is enrolled (for logged-in users)
  if (enrollmentCheck && !enrollmentCheck.enrolled) {
    return (
      <>
        <CoursePreviewModal
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          courseTitle={course.title}
          courseDescription={course.description || undefined}
          courseCode={course.code || undefined}
          lessons={lessons?.slice(0, 1).map((l, idx) => ({
            id: l.id,
            title: l.title,
            description: l.content || undefined,
            videoUrl: undefined,
            duration: undefined,
            order: idx + 1
          })) || []}
          quizzes={[]}
          previewLessonId={lessons?.[0]?.id}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Enrollment Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You need to enroll in this course to access the lessons and content.
              </p>
              <div className="flex gap-2 flex-col">
                <Button 
                  variant="outline"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Course
                </Button>
                <Link href="/pricing">
                  <Button className="w-full">View Pricing</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">Back to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Enrolled user view - return to original CoursePage component
  // This would be the existing enrolled user view
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Enrolled user view - use existing CoursePage</p>
        </div>
      </div>
    </div>
  );
}
