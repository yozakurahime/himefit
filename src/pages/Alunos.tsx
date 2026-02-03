import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Trophy,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { useStudents } from "@/hooks/useStudents";
import { StudentDialog } from "@/components/alunos/StudentDialog";
import { DeleteStudentDialog } from "@/components/alunos/DeleteStudentDialog";
import { StatCard } from "@/components/dashboard/StatCard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  active: { label: "Ativo", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "Pendente", className: "bg-warning/10 text-warning border-warning/20" },
  inactive: { label: "Inativo", className: "bg-muted text-muted-foreground border-border" },
  suspended: { label: "Suspenso", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Alunos() {
  const { students, isLoading, stats, createStudent, updateStudent, deleteStudent } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModality, setFilterModality] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesModality = filterModality === "all" || student.modalities?.includes(filterModality);
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesModality && matchesStatus;
  });

  const handleCreate = () => {
    setSelectedStudent(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (student: typeof students[0]) => {
    setSelectedStudent(student);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDelete = (student: typeof students[0]) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (dialogMode === "create") {
      createStudent.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      });
    } else if (selectedStudent) {
      updateStudent.mutate({ ...data, id: selectedStudent.id }, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      deleteStudent.mutate(selectedStudent.id, {
        onSuccess: () => setDeleteDialogOpen(false),
      });
    }
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os alunos da academia
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de Alunos"
          value={stats.total.toString()}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Alunos Ativos"
          value={stats.active.toString()}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Pendentes"
          value={stats.pending.toString()}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Inativos"
          value={stats.inactive.toString()}
          icon={UserX}
          variant="accent"
        />
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
                <SelectItem value="Natação">Natação</SelectItem>
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
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
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
                    <AvatarImage src={student.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.modalities?.join(", ") || "Sem modalidade"}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem onClick={() => handleEdit(student)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>Histórico de pagamentos</DropdownMenuItem>
                    <DropdownMenuItem>Evolução física</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(student)}
                    >
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                {student.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{student.email}</span>
                  </div>
                )}
                {student.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{student.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Desde {format(new Date(student.created_at), "MMM yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Badge className={cn("text-xs", statusConfig[student.status].className)}>
                  {statusConfig[student.status].label}
                </Badge>
                {student.modalities?.slice(0, 2).map((mod) => (
                  <Badge key={mod} variant="outline" className="text-xs">
                    {mod}
                  </Badge>
                ))}
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

      {/* Dialogs */}
      <StudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={selectedStudent ? {
          name: selectedStudent.name,
          email: selectedStudent.email || "",
          phone: selectedStudent.phone || "",
          cpf: selectedStudent.cpf || "",
          birth_date: selectedStudent.birth_date || "",
          gender: selectedStudent.gender || undefined,
          modalities: selectedStudent.modalities || [],
          address_street: selectedStudent.address_street || "",
          address_number: selectedStudent.address_number || "",
          address_complement: selectedStudent.address_complement || "",
          address_neighborhood: selectedStudent.address_neighborhood || "",
          address_city: selectedStudent.address_city || "",
          address_state: selectedStudent.address_state || "",
          address_zip: selectedStudent.address_zip || "",
          emergency_contact_name: selectedStudent.emergency_contact_name || "",
          emergency_contact_phone: selectedStudent.emergency_contact_phone || "",
          emergency_contact_relation: selectedStudent.emergency_contact_relation || "",
          medical_notes: selectedStudent.medical_notes || "",
          blood_type: selectedStudent.blood_type || "",
          allergies: selectedStudent.allergies || "",
          notes: selectedStudent.notes || "",
          current_plan_id: selectedStudent.current_plan_id || "",
          plan_start_date: selectedStudent.plan_start_date || "",
        } : undefined}
        isLoading={createStudent.isPending || updateStudent.isPending}
        mode={dialogMode}
      />

      <DeleteStudentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        studentName={selectedStudent?.name || ""}
      />
    </div>
  );
}
