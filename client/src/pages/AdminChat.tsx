import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Send, User, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { AdminRoute } from "@/components/AdminRoute";

function AdminChatContent() {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Fetch all chat sessions
  const { data: sessions, refetch: refetchSessions } = trpc.chat.getAllSessions.useQuery();
  
  // Fetch messages for selected session
  const { data: messages, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { sessionId: selectedSessionId! },
    { enabled: !!selectedSessionId }
  );

  // Send reply mutation
  const sendReplyMutation = trpc.chat.sendAdminMessage.useMutation({
    onSuccess: () => {
      toast.success("Reply sent!");
      setReplyMessage("");
      refetchMessages();
      refetchSessions();
    },
    onError: (error) => {
      toast.error(`Failed to send reply: ${error.message}`);
    },
  });

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchSessions();
      if (selectedSessionId) {
        refetchMessages();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedSessionId, refetchSessions, refetchMessages]);

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedSessionId) return;

    sendReplyMutation.mutate({
      sessionId: selectedSessionId,
      message: replyMessage,
    });
  };

  const selectedSession = sessions?.find((s: any) => s.id === selectedSessionId);
  const unreadCount = sessions?.filter((s: any) => s.hasUnread).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="bg-primary text-white shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chat Dashboard</h1>
              <p className="text-white/90">Manage conversations with students and visitors</p>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-lg px-4 py-2">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="container py-8">
        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Sessions List */}
          <Card className="md:col-span-1 overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations ({sessions?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {sessions && sessions.length > 0 ? (
                <div className="divide-y">
                  {sessions.map((session: any) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`w-full text-left p-4 hover:bg-accent/10 transition-colors ${
                        selectedSessionId === session.id ? "bg-accent/20" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {session.visitorName || `Visitor ${session.id}`}
                          </span>
                        </div>
                        {session.hasUnread && (
                          <Badge variant="destructive" className="text-xs">New</Badge>
                        )}
                      </div>
                      {session.visitorEmail && (
                        <p className="text-xs text-muted-foreground mb-1">{session.visitorEmail}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(session.lastMessageAt), { addSuffix: true })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
                  <div>
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No conversations yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages Panel */}
          <Card className="md:col-span-2 overflow-hidden flex flex-col">
            {selectedSession ? (
              <>
                <CardHeader className="border-b">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {selectedSession.visitorName || `Visitor ${selectedSession.id}`}
                    </CardTitle>
                    {selectedSession.visitorEmail && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedSession.visitorEmail}
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages && messages.length > 0 ? (
                    messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.isAdmin
                              ? "bg-primary text-white"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.isAdmin ? "text-white/70" : "text-muted-foreground"}`}>
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p>No messages yet</p>
                    </div>
                  )}
                </CardContent>

                {/* Reply Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendReply()}
                      disabled={sendReplyMutation.isPending}
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || sendReplyMutation.isPending}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation from the left to view messages</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminChat() {
  return (
    <AdminRoute>
      <AdminChatContent />
    </AdminRoute>
  );
}