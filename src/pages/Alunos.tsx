import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  modality: string;
  plan: string;
  status: "active" | "pending" | "expired";
  level: number;
  frequency: number;
  lastVisit: string;
  joinDate: string;
}

const students: Student[] = [
  {
    id: "1",
    name: "Lucas Mendes",
    email: "lucas@email.com",
    phone: "(11) 98765-4321",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas",
    modality: "CrossFit",
    plan: "Premium",
    status: "active",
    level: 45,
    frequency: 92,
    lastVisit: "Hoje, 08:30",
    joinDate: "Jan 2024",
  },
  {
    id: "2",
    name: "Juliana Ferreira",
    email: "juliana@email.com",
    phone: "(11) 91234-5678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juliana",
    modality: "Musculação",
    plan: "Básico",
    status: "active",
    level: 42,
    frequency: 88,
    lastVisit: "Ontem, 17:45",
    joinDate: "Mar 2024",
  },
  {
    id: "3",
    name: "Rafael Costa",
    email: "rafael@email.com",
    phone: "(11) 99876-5432",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rafael",
    modality: "Funcional",
    plan: "Premium",
    status: "pending",
    level: 38,
    frequency: 75,
    lastVisit: "3 dias atrás",
    joinDate: "Fev 2024",
  },
  {
    id: "4",
    name: "Camila Oliveira",
    email: "camila@email.com",
    phone: "(11) 98888-7777",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=camila",
    modality: "Yoga",
    plan: "Básico",
    status: "expired",
    level: 35,
    frequency: 60,
    lastVisit: "1 semana atrás",
    joinDate: "Dez 2023",
  },
  {
    id: "5",
    name: "Pedro Santos",
    email: "pedro@email.com",
    phone: "(11) 97777-6666",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
    modality: "Spinning",
    plan: "Premium",
    status: "active",
    level: 28,
    frequency: 95,
    lastVisit: "Hoje, 06:00",
    joinDate: "Abr 2024",
  },
];

const statusConfig = {
  active: { label: "Ativo", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "Pendente", className: "bg-warning/10 text-warning border-warning/20" },
  expired: { label: "Expirado", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Alunos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModality, setFilterModality] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModality = filterModality === "all" || student.modality === filterModality;
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesModality && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os alunos da academia
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input placeholder="Digite o nome" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="email@exemplo.com" className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input placeholder="(00) 00000-0000" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Modalidade</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="musculacao">Musculação</SelectItem>
                      <SelectItem value="crossfit">CrossFit</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="spinning">Spinning</SelectItem>
                      <SelectItem value="funcional">Funcional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plano</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="basico">Básico - R$ 99/mês</SelectItem>
                      <SelectItem value="premium">Premium - R$ 189/mês</SelectItem>
                      <SelectItem value="vip">VIP - R$ 299/mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Input type="date" className="bg-secondary border-border" />
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90">
                Cadastrar Aluno
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Select value={filterModality} onValueChange={setFilterModality}>
              <SelectTrigger className="w-full md:w-48 bg-secondary border-border">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Modalidade" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todas Modalidades</SelectItem>
                <SelectItem value="Musculação">Musculação</SelectItem>
                <SelectItem value="CrossFit">CrossFit</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Spinning">Spinning</SelectItem>
                <SelectItem value="Funcional">Funcional</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className="bg-card border-border hover:border-primary/50 transition-colors"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.modality}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Histórico de pagamentos</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Desativar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Último: {student.lastVisit}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Badge className={cn("text-xs", statusConfig[student.status].className)}>
                  {statusConfig[student.status].label}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {student.plan}
                </Badge>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Nv. {student.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">{student.frequency}% freq.</span>
                </div>
                <span className="text-xs text-muted-foreground">Desde {student.joinDate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Nenhum aluno encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou adicionar um novo aluno.
          </p>
        </div>
      )}
    </div>
  );
}
