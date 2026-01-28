import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessEntry {
  id: string;
  name: string;
  avatar?: string;
  time: string;
  status: "success" | "denied" | "pending";
  method: "biometria" | "cartão" | "qrcode";
}

const recentAccess: AccessEntry[] = [
  {
    id: "1",
    name: "Carlos Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    time: "Agora",
    status: "success",
    method: "biometria",
  },
  {
    id: "2",
    name: "Ana Paula",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    time: "2 min",
    status: "success",
    method: "qrcode",
  },
  {
    id: "3",
    name: "Desconhecido",
    time: "5 min",
    status: "denied",
    method: "cartão",
  },
  {
    id: "4",
    name: "Pedro Santos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
    time: "8 min",
    status: "success",
    method: "biometria",
  },
  {
    id: "5",
    name: "Maria Costa",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    time: "12 min",
    status: "pending",
    method: "cartão",
  },
];

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    label: "Liberado",
  },
  denied: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    label: "Negado",
  },
  pending: {
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
    label: "Pendente",
  },
};

export function AccessLog() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Controle de Acesso</CardTitle>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-xs text-muted-foreground">Tempo real</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentAccess.map((entry) => {
          const status = statusConfig[entry.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  {entry.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{entry.method}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{entry.time}</span>
                <div className={cn("p-1.5 rounded-full", status.bgColor)}>
                  <StatusIcon className={cn("w-4 h-4", status.color)} />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
