import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  tracks: { title: string; artist: string; duration: number }[];
  duration_seconds: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  audio_url: string | null;
  duration_seconds: number;
  priority: number;
  scheduled_at: string | null;
  repeat_interval_minutes: number | null;
  active: boolean;
  plays_count: number;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

interface Schedule {
  id: string;
  playlist_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active: boolean;
  created_at: string;
}

export function usePlaylists() {
  const queryClient = useQueryClient();

  const { data: playlists = [], isLoading, error } = useQuery({
    queryKey: ["radio_playlists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radio_playlists")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as unknown as Playlist[];
    },
  });

  const createPlaylist = useMutation({
    mutationFn: async (playlist: Omit<Playlist, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("radio_playlists")
        .insert(playlist as never)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radio_playlists"] });
      toast.success("Playlist criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating playlist:", error);
      toast.error("Erro ao criar playlist");
    },
  });

  const updatePlaylist = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Playlist> & { id: string }) => {
      const { data, error } = await supabase
        .from("radio_playlists")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radio_playlists"] });
      toast.success("Playlist atualizada!");
    },
    onError: (error) => {
      console.error("Error updating playlist:", error);
      toast.error("Erro ao atualizar playlist");
    },
  });

  const deletePlaylist = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("radio_playlists")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radio_playlists"] });
      toast.success("Playlist removida!");
    },
    onError: (error) => {
      console.error("Error deleting playlist:", error);
      toast.error("Erro ao remover playlist");
    },
  });

  return {
    playlists,
    isLoading,
    error,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  };
}

export function useAnnouncements() {
  const queryClient = useQueryClient();

  const { data: announcements = [], isLoading, error } = useQuery({
    queryKey: ["radio_announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radio_announcements")
        .select("*")
        .order("priority", { ascending: true });
      
      if (error) throw error;
      return data as unknown as Announcement[];
    },
  });

  const createAnnouncement = useMutation({
    mutationFn: async (announcement: Omit<Announcement, "id" | "created_at" | "updated_at" | "plays_count">) => {
      const { data, error } = await supabase
        .from("radio_announcements")
        .insert(announcement as never)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radio_announcements"] });
      toast.success("Anúncio criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating announcement:", error);
      toast.error("Erro ao criar anúncio");
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Announcement> & { id: string }) => {
      const { data, error } = await supabase
        .from("radio_announcements")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radio_announcements"] });
      toast.success("Anúncio atualizado!");
    },
    onError: (error) => {
      console.error("Error updating announcement:", error);
      toast.error("Erro ao atualizar anúncio");
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("radio_announcements")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radio_announcements"] });
      toast.success("Anúncio removido!");
    },
    onError: (error) => {
      console.error("Error deleting announcement:", error);
      toast.error("Erro ao remover anúncio");
    },
  });

  return {
    announcements,
    isLoading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
}

export function useSchedules() {
  const queryClient = useQueryClient();

  const { data: schedules = [], isLoading, error } = useQuery({
    queryKey: ["radio_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radio_schedules")
        .select("*")
        .order("day_of_week", { ascending: true });
      
      if (error) throw error;
      return data as unknown as Schedule[];
    },
  });

  const createSchedule = useMutation({
    mutationFn: async (schedule: Omit<Schedule, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("radio_schedules")
        .insert(schedule as never)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radio_schedules"] });
      toast.success("Agendamento criado!");
    },
    onError: (error) => {
      console.error("Error creating schedule:", error);
      toast.error("Erro ao criar agendamento");
    },
  });

  const deleteSchedule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("radio_schedules")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radio_schedules"] });
      toast.success("Agendamento removido!");
    },
    onError: (error) => {
      console.error("Error deleting schedule:", error);
      toast.error("Erro ao remover agendamento");
    },
  });

  return {
    schedules,
    isLoading,
    error,
    createSchedule,
    deleteSchedule,
  };
}
