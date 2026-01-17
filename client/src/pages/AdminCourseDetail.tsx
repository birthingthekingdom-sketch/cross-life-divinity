import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Award, Edit, Loader2, Video, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Link, useParams } from "wouter";

function CPDHoursCard({ course }: { course: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [cpdHours, setCpdHours] = useState(course.cpdHours || 0);
  const utils = trpc.useUtils();
  const updateCPD = trpc.admin.updateCourseCPDHours.useMutation({
    onSuccess: () => {
      toast.success('CPD hours updated successfully');
      utils.courses.getById.invalidate({ id: course.id });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const handleSave = () => {
    updateCPD.mutate({ courseId: course.id, cpdHours });
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-700" />
            <CardTitle>CPD Accreditation</CardTitle>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cpdHours">CPD Hours</Label>
              <Input
                id="cpdHours"
                type="number"
                min="0"
                value={cpdHours}
                onChange={(e) => setCpdHours(parseInt(e.target.value) || 0)}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Number of CPD hours awarded upon course completion
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={updateCPD.isPending}>
                {updateCPD.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => {
                setCpdHours(course.cpdHours || 0);
                setIsEditing(false);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-3xl font-bold text-blue-900">
              {course.cpdHours || 0} CPD Hours
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Awarded upon successful course completion
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function IntroVideoCard({ course }: { course: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(course.introVideoUrl || '');
  const utils = trpc.useUtils();
  const updateVideo = trpc.admin.updateCourseVideo.useMutation({
    onSuccess: () => {
      toast.success('Intro video updated successfully');
      utils.courses.getById.invalidate({ id: course.id });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const handleSave = () => {
    updateVideo.mutate({ courseId: course.id, introVideoUrl: videoUrl });
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-700" />
            <CardTitle>Introduction Video</CardTitle>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                type="text"
                placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Supported: YouTube, Vimeo, or direct video file URLs (.mp4, .webm, .ogg)
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={updateVideo.isPending}>
                {updateVideo.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => {
                setVideoUrl(course.introVideoUrl || '');
                setIsEditing(false);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {course.introVideoUrl ? (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current video URL:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                  {course.introVideoUrl}
                </code>
              </div>
            ) : (
              <p className="text-muted-foreground">No intro video set</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminCourseDetail() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const courseId = parseInt(params.id || "0");

  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery({ id: courseId });
  const { data: lessons, isLoading: lessonsLoading } = trpc.lessons.getByCourse.useQuery({ courseId });

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (courseLoading || lessonsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Course Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button>Back to Admin</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <Link href={`/course/${course.id}`}>
              <Button variant="default" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview Course
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground mt-1">
            {course.code} - {course.description}
          </p>
        </div>

        {/* CPD Hours Card */}
        <CPDHoursCard course={course} />

        {/* Intro Video Card */}
        <IntroVideoCard course={course} />

        {/* Lessons Table */}
        <Card>
          <CardHeader>
            <CardTitle>Course Lessons ({lessons?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {lessons && lessons.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">{lesson.lessonOrder}</TableCell>
                      <TableCell>{lesson.title}</TableCell>
                      <TableCell>
                        <Link href={`/admin/lesson/${lesson.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No lessons found for this course.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
