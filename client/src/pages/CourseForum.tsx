import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, MessageSquare, Plus, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CourseForum() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const courseId = parseInt(id!);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");

  const { data: courses } = trpc.courses.list.useQuery();
  const course = courses?.find(c => c.id === courseId);
  const { data: topics, refetch } = trpc.forum.getTopicsByCourse.useQuery({ courseId });
  
  const createTopicMutation = trpc.forum.createTopic.useMutation({
    onSuccess: () => {
      toast.success("Topic created successfully!");
      setNewTopicTitle("");
      setNewTopicContent("");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create topic");
    },
  });

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    createTopicMutation.mutate({
      courseId,
      title: newTopicTitle,
      content: newTopicContent
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/course/${courseId}`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{course?.title} - Discussion Forum</h1>
          <p className="text-muted-foreground">
            Ask questions, share insights, and engage with fellow students
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Discussion Topics</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
                <DialogDescription>
                  Start a new discussion about this course
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Topic Title</Label>
                  <Input
                    id="title"
                    placeholder="What would you like to discuss?"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Provide more details about your question or topic..."
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateTopic}
                  disabled={createTopicMutation.isPending}
                >
                  {createTopicMutation.isPending ? "Creating..." : "Create Topic"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {topics && topics.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No discussions yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to start a conversation!
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Topic
                </Button>
              </CardContent>
            </Card>
          )}

          {topics?.map((topic) => (
            <Card
              key={topic.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/forum/topic/${topic.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{topic.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {topic.author?.name || "Anonymous"}
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {topic.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
