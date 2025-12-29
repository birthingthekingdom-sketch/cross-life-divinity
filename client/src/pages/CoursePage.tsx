import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CourseIntroSlideshow } from "@/components/CourseIntroSlideshow";


import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, Award, BookOpen, CheckCircle2, Circle, Download, MessageSquare, Video } from "lucide-react";
import { Link, useParams } from "wouter";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function CoursePage() {
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id || "0");
  const { isAuthenticated } = useAuth();

  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery({ id: courseId });
  
  // Only check enrollment if user is logged in
  const { data: enrollmentCheck } = trpc.courses.checkEnrollment.useQuery(
    { courseId },
    { enabled: isAuthenticated }
  );
  
  const { data: lessons, isLoading: lessonsLoading } = trpc.lessons.getByCourse.useQuery({ courseId });
  
  // Only fetch progress if user is logged in
  const { data: progress } = trpc.progress.getByCourse.useQuery(
    { courseId },
    { enabled: isAuthenticated }
  );
  
  const { data: certificateEligibility } = trpc.certificates.checkEligibility.useQuery(
    { courseId },
    { enabled: isAuthenticated }
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
    return (
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
                <CardTitle>Enroll to Access This Course</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Sign up or log in to enroll in this course and access all {lessons?.length || 0} lessons.
                </p>
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

  // Enrolled user view
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Course Header */}
      <div 
        className="text-white shadow-lg"
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
            <Link href={`/course/${courseId}/forum`}>
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
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3">
                {course.code}
              </div>
              <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-white/90 text-lg max-w-3xl">{course.description}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="text-sm text-white/80 mb-2">Course Progress</div>
              <div className="text-3xl font-bold mb-2">
                {completedLessons.size} / {lessons?.length || 0}
              </div>
              <Progress value={progressPercent} className="h-2 bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Course Introduction Slideshow */}
          <CourseIntroSlideshow courseCode={course.code} courseTitle={course.title} />

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

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Course Lessons
          </h2>

          <div className="space-y-3">
            {lessons?.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              
              return (
                <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                  <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/50 cursor-pointer">
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
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                Completed
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {lesson.title}
                          </h3>
                        </div>
                        <div className="flex-shrink-0">
                          <Button variant="ghost" size="sm">
                            {isCompleted ? "Review" : "Start"} →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {lessons?.length === 0 && (
            <div className="text-center py-12 bg-card rounded-lg border">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Lessons Yet</h3>
              <p className="text-muted-foreground">
                Lessons for this course will be available soon.
              </p>
            </div>
          )}
          
          {/* Certificate Section */}
          {certificateEligibility && progressPercent === 100 && (
            <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Course Certificate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certificateEligibility.certificate ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Congratulations! You have completed all lessons in this course.
                    </p>
                    <Button
                      onClick={() => {
                        window.open(`/api/certificate/${certificateEligibility.certificate!.certificateNumber}`, '_blank');
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                  </div>
                ) : certificateEligibility.eligible ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Congratulations! You have completed all lessons in this course. Generate your certificate now.
                    </p>
                    <Button
                      onClick={() => {
                        setGeneratingCertificate(true);
                        generateCertificateMutation.mutate({ courseId });
                      }}
                      disabled={generatingCertificate}
                      className="w-full sm:w-auto"
                    >
                      {generatingCertificate ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Award className="mr-2 h-4 w-4" />
                          Generate Certificate
                        </>
                      )}
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
