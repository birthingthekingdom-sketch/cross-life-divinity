import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createSessionMutation = trpc.chat.createSession.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  
  const { data: messages, refetch } = trpc.chat.getMessages.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId, refetchInterval: 3000 } // Poll every 3 seconds
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleStartChat = async () => {
    if (!visitorName.trim()) return;
    
    const session = await createSessionMutation.mutateAsync({
      visitorName,
      visitorEmail: visitorEmail || undefined,
    });
    
    setSessionId(session.insertId as number);
    setShowWelcome(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !sessionId) return;

    await sendMessageMutation.mutateAsync({
      sessionId,
      message: message.trim(),
    });

    setMessage("");
    refetch();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl border border-border w-96 h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Chat with us</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 rounded p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Welcome Form */}
          {showWelcome && !sessionId && (
            <div className="p-6 flex-1 flex flex-col justify-center">
              <h4 className="text-lg font-semibold mb-2">Welcome!</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Please provide your details to start chatting with our support team.
              </p>
              <div className="space-y-3">
                <Input
                  placeholder="Your name *"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your email (optional)"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                />
                <Button
                  onClick={handleStartChat}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!visitorName.trim() || createSessionMutation.isPending}
                >
                  {createSessionMutation.isPending ? "Starting..." : "Start Chat"}
                </Button>
              </div>
            </div>
          )}

          {/* Messages */}
          {sessionId && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages && messages.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    <p>Welcome to our support chat!</p>
                    <p className="mt-1">Send a message to get started.</p>
                  </div>
                )}
                {messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderType === "visitor" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.senderType === "visitor"
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.senderType === "visitor" ? "text-white/70" : "text-muted-foreground"}`}>
                        {format(new Date(msg.createdAt), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
