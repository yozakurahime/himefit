import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  description: string | null;
  duration_months: number;
  price: number;
  modalities: string[];
  features: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface PlanInsert {
  name: string;
  description?: string | null;
  duration_months: number;
  price: number;
  modalities?: string[];
  features?: string[];
  active?: boolean;
}

interface PlanUpdate extends Partial<PlanInsert> {
  id: string;
}

export function usePlans() {
  const queryClient = useQueryClient();

  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("price", { ascending: true });
      
      if (error) throw error;
      return data as Plan[];
    },
  });

  const createPlan = useMutation({
    mutationFn: async (plan: PlanInsert) => {
      const { data, error } = await supabase
        .from("plans")
        .insert(plan)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plano criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating plan:", error);
      toast.error("Erro ao criar plano");
    },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, ...updates }: PlanUpdate) => {
      const { data, error } = await supabase
        .from("plans")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plano atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating plan:", error);
      toast.error("Erro ao atualizar plano");
    },
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("plans")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plano removido com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting plan:", error);
      toast.error("Erro ao remover plano");
    },
  });

  const activePlans = plans.filter(p => p.active);

  return {
    plans,
    activePlans,
    isLoading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
  };
}
