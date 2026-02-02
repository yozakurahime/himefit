import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TransactionType = "entrada" | "saida";
export type TransactionStatus = "completed" | "pending" | "cancelled";
export type TransactionCategory = 
  | "mensalidade" 
  | "pdv" 
  | "despesa" 
  | "suplemento" 
  | "vestuario" 
  | "acessorio" 
  | "manutencao" 
  | "salario" 
  | "aluguel" 
  | "energia" 
  | "agua" 
  | "outro";

export interface Transaction {
  id: string;
  description: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionInput {
  description: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
  status?: TransactionStatus;
  payment_method?: string;
  notes?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: TransactionCategory;
  status?: TransactionStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.type) {
        query = query.eq("type", filters.type);
      }
      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.startDate) {
        query = query.gte("created_at", filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte("created_at", filters.endDate.toISOString());
      }
      if (filters?.search) {
        query = query.ilike("description", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Transaction[];
    },
  });
}

export function useTransactionStats() {
  return useQuery({
    queryKey: ["transaction-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("status", "completed");

      if (error) throw error;

      const transactions = data as Transaction[];
      
      const totalReceita = transactions
        .filter((t) => t.type === "entrada")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const totalDespesas = transactions
        .filter((t) => t.type === "saida")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const mensalidades = transactions
        .filter((t) => t.category === "mensalidade" && t.type === "entrada")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const pdv = transactions
        .filter((t) => t.category === "pdv" && t.type === "entrada")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const mensalidadesCount = transactions.filter((t) => t.category === "mensalidade").length;
      const pdvCount = transactions.filter((t) => t.category === "pdv").length;

      return {
        totalReceita,
        totalDespesas,
        mensalidades,
        mensalidadesCount,
        pdv,
        pdvCount,
        saldo: totalReceita - totalDespesas,
      };
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionInput) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-stats"] });
      toast.success("Transação criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar transação: " + error.message);
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-stats"] });
      toast.success("Transação atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar transação: " + error.message);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-stats"] });
      toast.success("Transação excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir transação: " + error.message);
    },
  });
}
