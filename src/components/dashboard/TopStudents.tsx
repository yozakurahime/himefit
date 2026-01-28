import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Star, Medal, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  rank: number;
}

const topStudents: Student[] = [
  {
    id: "1",
    name: "Lucas Mendes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas",
    level: 45,
    xp: 12450,
    streak: 32,
    rank: 1,
  },
  {
    id: "2",
    name: "Juliana Ferreira",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juliana",
    level: 42,
    xp: 11200,
    streak: 28,
    rank: 2,
  },
  {
    id: "3",
    name: "Rafael Costa",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rafael",
    level: 38,
    xp: 9800,
    streak: 21,
    rank: 3,
  },
  {
    id: "4",
    name: "Camila Oliveira",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=camila",
    level: 35,
    xp: 8500,
    streak: 15,
    rank: 4,
  },
];

const rankIcons = {
  1: { icon: Crown, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  2: { icon: Medal, color: "text-gray-300", bg: "bg-gray-300/10" },
  3: { icon: Medal, color: "text-amber-600", bg: "bg-amber-600/10" },
  4: { icon: Star, color: "text-primary", bg: "bg-primary/10" },
};

export function TopStudents() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            HimeQuest - Ranking
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Semana 12
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topStudents.map((student) => {
          const rankConfig = rankIcons[student.rank as keyof typeof rankIcons];
          const RankIcon = rankConfig.icon;

          return (
            <div
              key={student.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                student.rank === 1
                  ? "bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20"
                  : "bg-secondary/50 hover:bg-secondary"
              )}
            >
              <div className={cn("p-2 rounded-lg", rankConfig.bg)}>
                <RankIcon className={cn("w-5 h-5", rankConfig.color)} />
              </div>
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={student.avatar} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{student.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">Nível {student.level}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-primary">{student.xp.toLocaleString()} XP</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10">
                <Flame className="w-3 h-3 text-destructive" />
                <span className="text-xs font-medium text-destructive">{student.streak}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
