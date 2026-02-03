import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Mic,
  Search,
  Phone,
  MoreVertical,
  Check,
  CheckCheck,
  Sparkles,
  Loader2,
  Users,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConversations, useMessages, useTemplates } from "@/hooks/useWhatsApp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  active: "bg-success",
  waiting: "bg-warning",
  resolved: "bg-muted",
  escalated: "bg-destructive",
};

const sentimentEmoji = {
  positive: "😊",
  neutral: "😐",
  negative: "😔",
};

export default function WhatsAppIA() {
  const { conversations, stats, isLoading: conversationsLoading, updateConversation } = useConversations();
  const { templates } = useTemplates();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { messages, sendMessage, isLoading: messagesLoading } = useMessages(selectedConversation);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAIResponding, setIsAIResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const filteredConversations = conversations.filter((conv) =>
    (conv.contact_name || conv.phone_number).toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const userMessage = newMessage;
    setNewMessage("");

    // Send user message (as outgoing from the gym)
    await sendMessage.mutateAsync({
      conversation_id: selectedConversation,
      direction: "outgoing",
      message_type: "text",
      content: userMessage,
      audio_transcription: null,
      sentiment: null,
      is_ai_response: false,
      read_at: null,
    });
  };

  const handleAIResponse = async () => {
    if (!selectedConversation || messages.length === 0) return;

    setIsAIResponding(true);
    try {
      // Get last incoming message
      const lastIncoming = [...messages].reverse().find((m) => m.direction === "incoming");
      if (!lastIncoming) {
        toast.error("Nenhuma mensagem do cliente para responder");
        return;
      }

      // Analyze sentiment
      const { data: sentimentData } = await supabase.functions.invoke("whatsapp-ai", {
        body: {
          message: lastIncoming.content,
          type: "sentiment_analysis",
        },
      });

      const sentiment = sentimentData?.response?.toLowerCase().trim() as "positive" | "neutral" | "negative";

      // Generate AI response
      const { data, error } = await supabase.functions.invoke("whatsapp-ai", {
        body: {
          message: lastIncoming.content,
          type: "chat_response",
          context: `Histórico da conversa:\n${messages.slice(-5).map(m => `${m.direction === "incoming" ? "Cliente" : "Atendente"}: ${m.content}`).join("\n")}`,
        },
      });

      if (error) throw error;

      // Send AI response
      await sendMessage.mutateAsync({
        conversation_id: selectedConversation,
        direction: "outgoing",
        message_type: "text",
        content: data.response,
        audio_transcription: null,
        sentiment: sentiment || null,
        is_ai_response: true,
        read_at: null,
      });

      toast.success("Resposta IA enviada!");
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error("Erro ao gerar resposta IA");
    } finally {
      setIsAIResponding(false);
    }
  };

  const handleSimulateIncoming = async () => {
    if (!selectedConversation) return;

    const simulatedMessages = [
      "Olá, gostaria de saber os horários de funcionamento",
      "Quanto custa o plano mensal?",
      "Vocês têm CrossFit?",
      "Posso fazer uma aula experimental?",
      "Qual o endereço da academia?",
    ];

    const randomMessage = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];

    await sendMessage.mutateAsync({
      conversation_id: selectedConversation,
      direction: "incoming",
      message_type: "text",
      content: randomMessage,
      audio_transcription: null,
      sentiment: null,
      is_ai_response: false,
      read_at: null,
    });

    // Update conversation
    await updateConversation.mutateAsync({
      id: selectedConversation,
      unread_count: (selectedConv?.unread_count || 0) + 1,
    });
  };

  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-success" />
            Central IA - WhatsApp
          </h1>
          <p className="text-muted-foreground mt-1">
            Atendimento automatizado com IA e análise de sentimento
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Conversas Ativas</p>
                <p className="text-xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">Aguardando</p>
                <p className="text-xl font-bold">{stats.waiting}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Resolvidas</p>
                <p className="text-xl font-bold">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Respostas IA</p>
                <p className="text-xl font-bold">{Math.round((stats.aiHandled / Math.max(stats.total, 1)) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">Escalados</p>
                <p className="text-xl font-bold">{stats.escalated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma conversa encontrada</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors border-b border-border",
                      selectedConversation === conv.id && "bg-secondary"
                    )}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {(conv.contact_name || conv.phone_number).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card", statusColors[conv.status])} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conv.contact_name || conv.phone_number}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(conv.last_message_at), "HH:mm")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground truncate">{conv.phone_number}</p>
                        {conv.ai_handled && (
                          <Bot className="w-3 h-3 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    {conv.unread_count > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        {conv.unread_count}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="bg-card border-border lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {(selectedConv?.contact_name || selectedConv?.phone_number || "?").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedConv?.contact_name || selectedConv?.phone_number}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {selectedConv?.phone_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {selectedConv?.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          message.direction === "outgoing" ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.direction === "incoming" && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback>
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[75%] p-3 rounded-xl",
                            message.direction === "outgoing"
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-secondary text-secondary-foreground rounded-tl-sm"
                          )}
                        >
                          {message.is_ai_response && (
                            <div className="flex items-center gap-1 mb-1 opacity-75">
                              <Bot className="w-3 h-3" />
                              <span className="text-xs">Resposta IA</span>
                            </div>
                          )}
                          {message.message_type === "audio" && (
                            <div className="flex items-center gap-2 mb-1">
                              <Mic className="w-3 h-3" />
                              <span className="text-xs opacity-75">Áudio transcrito</span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            {message.sentiment && (
                              <span className="text-xs">{sentimentEmoji[message.sentiment]}</span>
                            )}
                            <span className="text-[10px] opacity-75">
                              {format(new Date(message.created_at), "HH:mm")}
                            </span>
                            {message.direction === "outgoing" && (
                              <CheckCheck className="w-3 h-3 opacity-75" />
                            )}
                          </div>
                        </div>
                        {message.direction === "outgoing" && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10">
                              {message.is_ai_response ? (
                                <Bot className="w-4 h-4 text-primary" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSimulateIncoming}
                    className="flex-shrink-0"
                  >
                    Simular msg
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAIResponse}
                    disabled={isAIResponding}
                    className="flex-shrink-0"
                  >
                    {isAIResponding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-primary" />
                    )}
                  </Button>
                  <Input
                    placeholder="Digite uma mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-secondary border-border"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="bg-gradient-primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Selecione uma conversa</p>
              <p className="text-sm">Escolha uma conversa para visualizar as mensagens</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
