import { useState } from "react";
import {
  Plus,
  CreditCard,
  Edit,
  Trash2,
  Check,
  Loader2,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePlans } from "@/hooks/usePlans";
import { PlanDialog } from "@/components/planos/PlanDialog";
import { cn } from "@/lib/utils";

export default function Planos() {
  const { plans, isLoading, createPlan, updatePlan, deletePlan } = usePlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const handleCreate = () => {
    setSelectedPlan(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDelete = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (dialogMode === "create") {
      createPlan.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      });
    } else if (selectedPlan) {
      updatePlan.mutate({ ...data, id: selectedPlan.id }, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPlan) {
      deletePlan.mutate(selectedPlan.id, {
        onSuccess: () => setDeleteDialogOpen(false),
      });
    }
  };

  const toggleActive = (plan: typeof plans[0]) => {
    updatePlan.mutate({ id: plan.id, active: !plan.active });
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
          <h1 className="text-3xl font-bold tracking-tight">Planos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os planos de assinatura da academia
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Planos</p>
              <p className="text-2xl font-bold">{plans.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <Check className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Planos Ativos</p>
              <p className="text-2xl font-bold">{plans.filter(p => p.active).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/10">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receita Potencial</p>
              <p className="text-2xl font-bold">
                R$ {plans.reduce((sum, p) => sum + Number(p.price), 0).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <Card
            key={plan.id}
            className={cn(
              "bg-card border-border relative overflow-hidden transition-all hover:shadow-lg",
              index === 2 && "border-primary ring-1 ring-primary"
            )}
          >
            {index === 2 && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                Popular
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <Switch
                  checked={plan.active}
                  onCheckedChange={() => toggleActive(plan)}
                />
              </div>
              {plan.description && (
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">R$ {Number(plan.price).toFixed(2)}</span>
                <span className="text-muted-foreground">
                  /{plan.duration_months} {plan.duration_months === 1 ? "mês" : "meses"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {plan.duration_months} {plan.duration_months === 1 ? "mês" : "meses"} de duração
                </span>
              </div>

              {plan.modalities && plan.modalities.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Modalidades:</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.modalities.map((mod) => (
                      <Badge key={mod} variant="secondary" className="text-xs">
                        {mod}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {plan.features && plan.features.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Benefícios:</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(plan)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(plan)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {plans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Nenhum plano cadastrado</h3>
          <p className="text-muted-foreground mb-4">
            Crie seu primeiro plano para começar a vender assinaturas.
          </p>
          <Button className="bg-gradient-primary" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Plano
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <PlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={selectedPlan ? {
          name: selectedPlan.name,
          description: selectedPlan.description || "",
          duration_months: selectedPlan.duration_months,
          price: Number(selectedPlan.price),
          modalities: selectedPlan.modalities || [],
          features: selectedPlan.features || [],
          active: selectedPlan.active,
        } : undefined}
        isLoading={createPlan.isPending || updatePlan.isPending}
        mode={dialogMode}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Plano</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o plano <strong>{selectedPlan?.name}</strong>?
              Alunos com este plano não serão afetados, mas o plano não poderá mais ser vendido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
