import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Send, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ForumTopic() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const topicId = parseInt(id!);
  
  const [replyContent, setReplyContent] = useState("");

  const { data: topic, refetch } = trpc.forum.getTopic.useQuery({ id: topicId });
  
  const createReplyMutation = trpc.forum.createReply.useMutation({
    onSuccess: () => {
      toast.success("Reply posted successfully!");
      setReplyContent("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to post reply");
    },
  });

  const handlePostReply = () => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    createReplyMutation.mutate({
      topicId,
      content: replyContent
    });
  };

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/course/${topic.courseId}/forum`)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>

        {/* Topic */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{topic.title}</CardTitle>
            <CardDescription className="flex items-center gap-4">
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
            <p className="whitespace-pre-wrap">{topic.content}</p>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold">
            Replies ({topic.replies?.length || 0})
          </h2>
          
          {topic.replies && topic.replies.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No replies yet. Be the first to respond!
              </CardContent>
            </Card>
          )}

          {topic.replies?.map((reply) => (
            <Card key={reply.id}>
              <CardHeader>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {reply.author?.name || "Anonymous"}
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{reply.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Form */}
        <Card>
          <CardHeader>
            <CardTitle>Post a Reply</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reply">Your Reply</Label>
              <Textarea
                id="reply"
                placeholder="Share your thoughts..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
              />
            </div>
            <Button
              onClick={handlePostReply}
              disabled={createReplyMutation.isPending}
            >
              {createReplyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Reply
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
