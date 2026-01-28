import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, User, Mic, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  time: string;
  isAudio?: boolean;
  sentiment?: "positive" | "neutral" | "negative";
}

const recentMessages: Message[] = [
  {
    id: "1",
    type: "user",
    content: "Olá, gostaria de saber sobre as modalidades disponíveis",
    time: "14:32",
    sentiment: "neutral",
  },
  {
    id: "2",
    type: "bot",
    content: "Olá! 🏋️ Temos Musculação, CrossFit, Yoga, Spinning e Funcional. Qual te interessa mais?",
    time: "14:32",
  },
  {
    id: "3",
    type: "user",
    content: "Áudio recebido: 'Quero fazer CrossFit, qual o valor?'",
    time: "14:33",
    isAudio: true,
    sentiment: "positive",
  },
  {
    id: "4",
    type: "bot",
    content: "Nosso CrossFit custa R$ 189/mês! Posso agendar uma aula experimental grátis pra você 💪",
    time: "14:33",
  },
];

const sentimentColors = {
  positive: "bg-success text-success-foreground",
  neutral: "bg-secondary text-secondary-foreground",
  negative: "bg-destructive text-destructive-foreground",
};

export function WhatsAppPreview() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-success" />
            Central IA - WhatsApp
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-success/10 text-success border-success/20">
              12 ativos
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {recentMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.type === "bot" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-xl",
                  message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-secondary text-secondary-foreground rounded-tl-sm"
                )}
              >
                {message.isAudio && (
                  <div className="flex items-center gap-2 mb-1">
                    <Mic className="w-3 h-3" />
                    <span className="text-[10px] opacity-75">Transcrição de áudio</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  {message.sentiment && (
                    <Badge className={cn("text-[9px] h-4 px-1", sentimentColors[message.sentiment])}>
                      {message.sentiment === "positive" && "😊"}
                      {message.sentiment === "neutral" && "😐"}
                      {message.sentiment === "negative" && "😔"}
                    </Badge>
                  )}
                  <span className="text-[10px] opacity-75">{message.time}</span>
                </div>
              </div>
              {message.type === "user" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-success">94%</p>
                <p className="text-[10px] text-muted-foreground">Respostas IA</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">6</p>
                <p className="text-[10px] text-muted-foreground">Takeovers</p>
              </div>
            </div>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
              Ver todos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
