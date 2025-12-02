import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useParams, useLocation } from "wouter";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function AdminEditLesson() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const lessonId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();

  const { data: lesson, isLoading } = trpc.lessons.getById.useQuery({ id: lessonId });
  const { data: course } = trpc.courses.getById.useQuery(
    { id: lesson?.courseId || 0 },
    { enabled: !!lesson }
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setContent(lesson.content);
    }
  }, [lesson]);

  const updateLessonMutation = trpc.lessons.update.useMutation({
    onSuccess: () => {
      toast.success("Lesson updated successfully!");
      if (lesson) {
        setLocation(`/admin/course/${lesson.courseId}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update lesson");
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter lesson content");
      return;
    }

    updateLessonMutation.mutate({
      id: lessonId,
      title: title.trim(),
      content: content.trim(),
    });
  };

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Lesson Not Found</CardTitle>
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
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/admin/course/${lesson.courseId}`}>
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Edit Lesson</h1>
            {course && (
              <p className="text-muted-foreground mt-1">
                {course.code} - {course.title}
              </p>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={updateLessonMutation.isPending}
          >
            {updateLessonMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lesson title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Lesson Content</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Enter lesson content (supports Markdown)..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
