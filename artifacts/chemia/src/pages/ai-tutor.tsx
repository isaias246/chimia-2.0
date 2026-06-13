import React, { useState, useEffect, useRef } from "react";
import {
  useListConversations,
  useCreateConversation,
  useGetConversation,
  useDeleteConversation,
  useSendMessage,
  getListConversationsQueryKey,
  getGetConversationQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Trash2, Send, Loader2, User, Hexagon, Sparkles, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatMessage(content: string) {
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-black/30 px-1.5 py-0.5 rounded text-primary font-mono text-[13px] border border-primary/20">$1</code>');
  formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-[#050d1a] p-4 rounded-lg overflow-x-auto font-mono text-[13px] border border-border/50 my-3 text-muted-foreground leading-relaxed"><code>$1</code></pre>');
  formatted = formatted.replace(/\n/g, "<br/>");
  return <div dangerouslySetInnerHTML={{ __html: formatted }} className="leading-relaxed" />;
}

export default function AiTutor() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: isListLoading } = useListConversations();
  const { data: activeConversation, isLoading: isActiveLoading } = useGetConversation(activeId ?? 0);

  const createMutation = useCreateConversation();
  const deleteMutation = useDeleteConversation();
  const sendMutation = useSendMessage();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeConversation?.messages, sendMutation.isPending]);

  // Auto-create a session conversation on first load for anonymous users
  useEffect(() => {
    if (!user && !activeId && !createMutation.isPending) {
      createMutation.mutate(
        { data: { title: "Sesión de Química" } },
        { onSuccess: (data) => setActiveId(data.id) }
      );
    }
  }, [user]);

  const handleCreateAndAsk = (initialQuestion?: string) => {
    createMutation.mutate(
      { data: { title: initialQuestion ? initialQuestion.substring(0, 40) + "..." : "Nueva Conversación" } },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
          setActiveId(data.id);
          if (initialQuestion) {
            sendMutation.mutate(
              { id: data.id, data: { content: initialQuestion } },
              { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetConversationQueryKey(data.id) }) }
            );
          }
        }
      }
    );
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
          if (activeId === id) setActiveId(null);
        }
      }
    );
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !activeId) return;
    const content = input.trim();
    setInput("");
    sendMutation.mutate(
      { id: activeId, data: { content } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetConversationQueryKey(activeId) }) }
    );
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const suggestedQuestions = [
    "¿Qué es un enlace iónico?", "Explica las tendencias de la tabla periódica",
    "¿Cómo funciona el pH?", "¿Qué son las leyes de los gases?",
    "Explica la configuración electrónica", "¿Cómo balancear ecuaciones redox?",
  ];

  const topics = ["Estructura Atómica", "Enlace Químico", "Ácidos y Bases", "Termodinámica", "Cinética"];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
      {/* Sidebar */}
      <div className="w-full md:w-72 flex flex-col h-full md:h-auto overflow-hidden shrink-0 glass rounded-xl border-border/50">
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-black/20">
          <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            {user ? "Historial" : "Tutor de Química"}
          </span>
          {user && (
            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleCreateAndAsk()} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {!user ? (
              <div className="p-4 space-y-3">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 text-xs text-muted-foreground leading-relaxed">
                  <div className="flex items-center gap-1.5 mb-2 text-primary font-semibold">
                    <Lock className="h-3 w-3" /> Historial de Chat
                  </div>
                  <p>Crea una cuenta para guardar tu historial de conversaciones.</p>
                  <div className="flex gap-2 mt-3">
                    <Link href="/register" className="flex-1">
                      <button className="w-full px-2 py-1.5 text-xs rounded bg-primary/90 text-primary-foreground font-semibold hover:bg-primary transition-colors">Registrarse</button>
                    </Link>
                    <Link href="/login" className="flex-1">
                      <button className="w-full px-2 py-1.5 text-xs rounded border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-colors">Entrar</button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : isListLoading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-14 bg-secondary/30 animate-pulse rounded-lg m-1" />)
            ) : conversations?.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground p-8 opacity-50">Sin historial</p>
            ) : (
              conversations?.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${activeId === conv.id ? "bg-primary/10 border border-primary/20 text-primary shadow-[inset_4px_0_0_0_rgba(0,229,255,1)]" : "border border-transparent hover:bg-white/5 text-muted-foreground hover:text-foreground"}`}
                >
                  <div className="overflow-hidden pr-2">
                    <div className="truncate text-sm font-medium">{conv.title}</div>
                    <div className="text-[10px] opacity-50 mt-1">{format(new Date(conv.createdAt), "d MMM, yyyy", { locale: es })}</div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20" onClick={(e) => handleDelete(conv.id, e)}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[60vh] md:h-auto overflow-hidden glass rounded-xl border-border/50 relative">
        {activeId ? (
          <>
            <div className="p-4 border-b border-border/50 bg-black/20 flex items-center justify-between">
              <h3 className="font-semibold text-sm">{activeConversation?.title || "Cargando..."}</h3>
              <div className="flex gap-2">
                {topics.map(topic => (
                  <button key={topic} className="text-[10px] px-2 py-1 rounded border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors hidden sm:block"
                    onClick={() => handleCreateAndAsk(`Explica los conceptos de ${topic}`)}>
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" ref={scrollRef}>
              {isActiveLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-primary opacity-50" />
                </div>
              ) : activeConversation?.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-6">
                  <div className="p-4 bg-primary/5 rounded-full ring-1 ring-primary/20">
                    <Hexagon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-foreground">¿En qué puedo ayudarte hoy?</h3>
                    <p className="text-sm max-w-md mx-auto">Pregunta cualquier duda de química — elementos, ecuaciones, conceptos teóricos.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mt-4">
                    {suggestedQuestions.map((q, i) => (
                      <button key={i}
                        onClick={() => {
                          setInput(q);
                          setTimeout(() => {
                            sendMutation.mutate({ id: activeId, data: { content: q } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetConversationQueryKey(activeId) }) });
                            setInput("");
                          }, 50);
                        }}
                        className="text-left p-3 rounded-lg border border-border/40 bg-secondary/20 hover:bg-primary/5 hover:border-primary/30 transition-all text-sm flex items-center gap-2 group"
                      >
                        <Sparkles className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        <span className="truncate">{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8 max-w-4xl mx-auto w-full">
                  {activeConversation?.messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === "user" ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary border border-border text-foreground"}`}>
                        {msg.role === "user" ? <User className="h-4 w-4" /> : <Hexagon className="h-4 w-4 text-primary" />}
                      </div>
                      <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                        <div className="text-[10px] text-muted-foreground mb-1 font-medium tracking-wide uppercase px-1">
                          {msg.role === "user" ? "Tú" : "Tutor CHEMIA"}
                        </div>
                        <div className={`rounded-2xl px-5 py-3.5 text-sm shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary/40 border border-border/60 text-foreground/90 rounded-tl-sm"}`}>
                          {msg.role === "user" ? <div className="whitespace-pre-wrap">{msg.content}</div> : formatMessage(msg.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {sendMutation.isPending && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 mt-1">
                        <Hexagon className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="text-[10px] text-muted-foreground mb-1 font-medium tracking-wide uppercase px-1">Tutor CHEMIA</div>
                        <div className="bg-secondary/40 border border-border/60 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                          <span className="flex space-x-1">
                            {[0, 0.2, 0.4].map((d, i) => <span key={i} className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border/50 bg-black/20">
              <div className="max-w-4xl mx-auto relative">
                <textarea
                  placeholder="Escribe una pregunta de química... (Shift+Enter para nueva línea)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={sendMutation.isPending}
                  className="w-full bg-secondary/30 border border-border/60 rounded-xl pl-4 pr-14 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none min-h-[56px] max-h-[200px] overflow-hidden"
                  rows={1}
                />
                <Button onClick={handleSend} disabled={!input.trim() || sendMutation.isPending} size="icon"
                  className="absolute right-2 bottom-2 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all disabled:opacity-50">
                  <Send className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-muted-foreground/50 font-mono">El Tutor CHEMIA puede cometer errores. Verifica los cálculos importantes.</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
              <MessageSquare className="h-16 w-16 opacity-30 relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium text-foreground">Selecciona una conversación</h3>
              <p className="text-sm">Elige del historial o inicia una nueva sesión.</p>
            </div>
            <Button className="h-10 px-6 font-semibold" onClick={() => handleCreateAndAsk()} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Nueva Sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
