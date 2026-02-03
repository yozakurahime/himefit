import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Checkin {
  id: string;
  student_id: string;
  checkin_at: string;
  checkout_at: string | null;
  modality: string | null;
  created_at: string;
}

export function useCheckins(studentId?: string) {
  const queryClient = useQueryClient();

  const { data: checkins = [], isLoading, error } = useQuery({
    queryKey: ["checkins", studentId],
    queryFn: async () => {
      let query = supabase
        .from("checkins")
        .select("*")
        .order("checkin_at", { ascending: false });
      
      if (studentId) {
        query = query.eq("student_id", studentId);
      }
      
      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data as unknown as Checkin[];
    },
  });

  const createCheckin = useMutation({
    mutationFn: async (checkin: Omit<Checkin, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("checkins")
        .insert(checkin as never)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkins"] });
      toast.success("Check-in registrado!");
    },
    onError: (error) => {
      console.error("Error creating checkin:", error);
      toast.error("Erro ao registrar check-in");
    },
  });

  const checkout = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("checkins")
        .update({ checkout_at: new Date().toISOString() } as never)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkins"] });
      toast.success("Check-out registrado!");
    },
    onError: (error) => {
      console.error("Error checkout:", error);
      toast.error("Erro ao registrar check-out");
    },
  });

  // Today's checkins
  const today = new Date().toISOString().split("T")[0];
  const todayCheckins = checkins.filter(c => 
    c.checkin_at.startsWith(today)
  );

  return {
    checkins,
    todayCheckins,
    isLoading,
    error,
    createCheckin,
    checkout,
  };
}
