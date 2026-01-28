import { useState } from "react";
import {
  Trophy,
  Flame,
  Star,
  Target,
  Zap,
  Medal,
  Crown,
  Gift,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface RankedStudent {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  achievements: number;
  trend: "up" | "down" | "same";
}

const topRanking: RankedStudent[] = [
  { rank: 1, name: "Lucas Mendes", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas", level: 45, xp: 12450, streak: 32, achievements: 24, trend: "same" },
  { rank: 2, name: "Juliana Ferreira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juliana", level: 42, xp: 11200, streak: 28, achievements: 21, trend: "up" },
  { rank: 3, name: "Rafael Costa", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rafael", level: 38, xp: 9800, streak: 21, achievements: 18, trend: "up" },
  { rank: 4, name: "Camila Oliveira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=camila", level: 35, xp: 8500, streak: 15, achievements: 16, trend: "down" },
  { rank: 5, name: "Pedro Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro", level: 33, xp: 7800, streak: 18, achievements: 14, trend: "up" },
  { rank: 6, name: "Ana Paula", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana", level: 31, xp: 7200, streak: 12, achievements: 13, trend: "same" },
  { rank: 7, name: "Carlos Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos", level: 29, xp: 6500, streak: 10, achievements: 11, trend: "down" },
];

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedBy: number;
}

const achievements: Achievement[] = [
  { id: "1", name: "Primeira Vitória", description: "Complete seu primeiro treino", icon: Star, rarity: "common", unlockedBy: 1180 },
  { id: "2", name: "Semana Perfeita", description: "Treine 7 dias seguidos", icon: Flame, rarity: "rare", unlockedBy: 456 },
  { id: "3", name: "Mestre do Ferro", description: "Complete 100 treinos de musculação", icon: Zap, rarity: "epic", unlockedBy: 128 },
  { id: "4", name: "Lenda Viva", description: "Mantenha um streak de 30 dias", icon: Crown, rarity: "legendary", unlockedBy: 42 },
  { id: "5", name: "Madrugador", description: "Treine antes das 6h por 10 dias", icon: Target, rarity: "rare", unlockedBy: 234 },
  { id: "6", name: "CrossFitter Elite", description: "Complete 50 WODs", icon: Medal, rarity: "epic", unlockedBy: 89 },
];

const rarityStyles = {
  common: { bg: "bg-secondary", border: "border-border", text: "text-muted-foreground" },
  rare: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  epic: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
  legendary: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
};

const challenges = [
  { id: "1", name: "Desafio da Semana", description: "Complete 5 treinos esta semana", progress: 60, reward: 500, participants: 342 },
  { id: "2", name: "Maratona de Janeiro", description: "Acumule 1000 minutos de treino", progress: 35, reward: 2000, participants: 156 },
  { id: "3", name: "Desafio CrossFit", description: "Complete 10 WODs em 2 semanas", progress: 80, reward: 1000, participants: 89 },
];

export default function Gamificacao() {
  const [activeTab, setActiveTab] = useState("ranking");

  const rankStyles = {
    1: { icon: Crown, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", text: "text-yellow-400" },
    2: { icon: Medal, color: "text-gray-300", bg: "bg-gray-300/10", border: "border-gray-300/30", text: "text-gray-300" },
    3: { icon: Medal, color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/30", text: "text-amber-600" },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            HimeQuest
          </h1>
          <p className="text-muted-foreground mt-1">
            Sistema de gamificação e engajamento dos alunos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="px-4 py-2 bg-gradient-primary text-primary-foreground">
            Semana 12 / 2024
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border stat-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Jogadores Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border stat-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Flame className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">15.4</p>
                <p className="text-sm text-muted-foreground">Streak Médio (dias)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border stat-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent/10">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">3,842</p>
                <p className="text-sm text-muted-foreground">Conquistas Desbloqueadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border stat-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/10">
                <Gift className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">R$ 4.200</p>
                <p className="text-sm text-muted-foreground">Prêmios Resgatados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          <TabsTrigger value="desafios">Desafios</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-6">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4">
            {[topRanking[1], topRanking[0], topRanking[2]].map((student, idx) => {
              const position = idx === 0 ? 2 : idx === 1 ? 1 : 3;
              const style = rankStyles[position as keyof typeof rankStyles];
              const RankIcon = style.icon;
              const isFirst = position === 1;

              return (
                <Card
                  key={student.rank}
                  className={cn(
                    "bg-card border overflow-hidden transition-all",
                    isFirst ? "scale-105 z-10" : "",
                    style.border
                  )}
                >
                  <CardContent className="p-6 text-center">
                    <div className={cn("inline-flex p-3 rounded-full mb-4", style.bg)}>
                      <RankIcon className={cn("w-8 h-8", style.color)} />
                    </div>
                    <Avatar className={cn("w-20 h-20 mx-auto border-4", style.border)}>
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold mt-4">{student.name}</h3>
                    <p className="text-muted-foreground text-sm">Nível {student.level}</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Badge className={cn("text-xs", style.bg, style.text)}>
                        {student.xp.toLocaleString()} XP
                      </Badge>
                      <div className="flex items-center gap-1 text-destructive">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{student.streak}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Full Ranking */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Ranking Completo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topRanking.slice(3).map((student) => (
                <div
                  key={student.rank}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
                    {student.rank}
                  </div>
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Nível {student.level}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-primary">{student.xp.toLocaleString()} XP</p>
                      <div className="flex items-center gap-1 text-destructive">
                        <Flame className="w-3 h-3" />
                        <span className="text-xs">{student.streak} dias</span>
                      </div>
                    </div>
                    <TrendingUp
                      className={cn(
                        "w-5 h-5",
                        student.trend === "up" && "text-success",
                        student.trend === "down" && "text-destructive rotate-180",
                        student.trend === "same" && "text-muted-foreground"
                      )}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conquistas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const style = rarityStyles[achievement.rarity];
              const Icon = achievement.icon;

              return (
                <Card
                  key={achievement.id}
                  className={cn("bg-card border overflow-hidden", style.border)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={cn("p-3 rounded-xl", style.bg)}>
                        <Icon className={cn("w-6 h-6", style.text)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <Badge className={cn("text-[10px]", style.bg, style.text)}>
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {achievement.unlockedBy} alunos conquistaram
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="desafios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      Ativo
                    </Badge>
                    <div className="flex items-center gap-1 text-warning">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">{challenge.reward} XP</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">{challenge.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {challenge.participants} participantes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
