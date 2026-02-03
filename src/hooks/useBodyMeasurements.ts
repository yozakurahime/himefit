import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BodyMeasurement {
  id: string;
  student_id: string;
  measurement_date: string;
  weight: number | null;
  height: number | null;
  body_fat_percentage: number | null;
  muscle_mass: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  arm_left: number | null;
  arm_right: number | null;
  thigh_left: number | null;
  thigh_right: number | null;
  calf_left: number | null;
  calf_right: number | null;
  notes: string | null;
  created_at: string;
}

export function useBodyMeasurements(studentId: string) {
  const queryClient = useQueryClient();

  const { data: measurements = [], isLoading, error } = useQuery({
    queryKey: ["body_measurements", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("body_measurements")
        .select("*")
        .eq("student_id", studentId)
        .order("measurement_date", { ascending: false });
      
      if (error) throw error;
      return data as unknown as BodyMeasurement[];
    },
    enabled: !!studentId,
  });

  const createMeasurement = useMutation({
    mutationFn: async (measurement: Omit<BodyMeasurement, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("body_measurements")
        .insert(measurement as never)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["body_measurements", studentId] });
      toast.success("Medição registrada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating measurement:", error);
      toast.error("Erro ao registrar medição");
    },
  });

  const deleteMeasurement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("body_measurements")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["body_measurements", studentId] });
      toast.success("Medição removida!");
    },
    onError: (error) => {
      console.error("Error deleting measurement:", error);
      toast.error("Erro ao remover medição");
    },
  });

  // Calculate evolution
  const evolution = measurements.length >= 2 ? {
    weight: measurements[0].weight && measurements[1].weight 
      ? measurements[0].weight - measurements[1].weight 
      : null,
    bodyFat: measurements[0].body_fat_percentage && measurements[1].body_fat_percentage 
      ? measurements[0].body_fat_percentage - measurements[1].body_fat_percentage 
      : null,
    muscleMass: measurements[0].muscle_mass && measurements[1].muscle_mass 
      ? measurements[0].muscle_mass - measurements[1].muscle_mass 
      : null,
  } : null;

  return {
    measurements,
    latestMeasurement: measurements[0] || null,
    evolution,
    isLoading,
    error,
    createMeasurement,
    deleteMeasurement,
  };
}
