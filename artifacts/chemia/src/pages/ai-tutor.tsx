import React, { useState, useEffect, useRef } from "react";
import { 
  useListConversations, 
  useCreateConversation, 
  useGetConversation, 
  useDeleteConversation, 
  useSendMessage,
  getListConversationsQueryKey,
  getGetConversationQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Trash2, Send, Loader2, Bot, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";

// Simple markdown parser
function formatMessage(content: string) {
  // Bold
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-secondary/50 px-1 py-0.5 rounded text-primary font-mono text-sm">$1</code>');
  // Code blocks
  formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-secondary/30 p-3 rounded-md overflow-x-auto font-mono text-sm border border-border/50 my-2"><code>$1</code></pre>');
  // Line breaks
  formatted = formatted.replace(/\n/g, '<br/>');
  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
}

export default function AiTutor() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: isListLoading } = useListConversations({
    query: { enabled: !!user }
  });
  
  const { data: activeConversation, isLoading: isActiveLoading } = useGetConversation(
    activeId!,
    { query: { enabled: !!activeId } }
  );

  const createMutation = useCreateConversation();
  const deleteMutation = useDeleteConversation();
  const sendMutation = useSendMessage();

  useEffect(() => {
    // Auto-scroll to bottom of messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, sendMutation.isPending]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <Bot className="h-16 w-16 text-primary opacity-50" />
        <h2 className="text-2xl font-bold">AI Chemistry Tutor</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Sign in to interact with the AI tutor, ask complex chemistry questions, and get detailed explanations.
        </p>
        <Link href="/login">
          <Button>Log In to Continue</Button>
        </Link>
      </div>
    );
  }

  const handleCreate = () => {
    createMutation.mutate(
      { data: { title: "New Conversation" } },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
          setActiveId(data.id);
        }
      }
    );
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(
      id,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
          if (activeId === id) setActiveId(null);
        }
      }
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;

    const messageContent = input.trim();
    setInput("");

    // Optimistically update UI could go here, but relying on invalidate for simplicity
    sendMutation.mutate(
      { conversationId: activeId, data: { content: messageContent } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetConversationQueryKey(activeId) });
        }
      }
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <Card className="w-full md:w-80 flex flex-col border-border/50 h-full md:h-auto overflow-hidden shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Chats
          </h2>
          <Button size="icon" variant="ghost" onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isListLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-10 bg-secondary/50 animate-pulse rounded-md m-1" />
              ))
            ) : conversations?.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground p-4">No conversations yet.</p>
            ) : (
              conversations?.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                    activeId === conv.id ? "bg-primary/10 text-primary" : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <span className="truncate text-sm font-medium">{conv.title}</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100 transition-opacity" 
                    onClick={(e) => handleDelete(conv.id, e)}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col border-border/50 h-[60vh] md:h-auto overflow-hidden">
        {activeId ? (
          <>
            <div className="p-4 border-b border-border bg-card/50">
              <h3 className="font-semibold">{activeConversation?.title || "Loading..."}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {isActiveLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : activeConversation?.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                  <Bot className="h-12 w-12 opacity-20" />
                  <p>Start a conversation. Ask me about chemistry!</p>
                </div>
              ) : (
                activeConversation?.messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                    }`}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-primary/10 text-foreground border border-primary/20' 
                        : 'bg-secondary/50 text-foreground border border-border/50'
                    }`}>
                      {formatMessage(msg.content)}
                    </div>
                  </div>
                ))
              )}
              {sendMutation.isPending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-secondary/50 text-foreground border border-border/50 rounded-lg p-4 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-card/50">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  placeholder="Ask a chemistry question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sendMutation.isPending}
                  className="bg-background"
                />
                <Button type="submit" disabled={!input.trim() || sendMutation.isPending} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
            <MessageSquare className="h-12 w-12 opacity-20" />
            <p>Select a conversation or create a new one to start learning.</p>
            <Button variant="outline" onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              New Conversation
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}