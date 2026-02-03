import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Conversation {
  id: string;
  phone_number: string;
  contact_name: string | null;
  student_id: string | null;
  status: "active" | "waiting" | "resolved" | "escalated";
  last_message_at: string;
  unread_count: number;
  ai_handled: boolean;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  direction: "incoming" | "outgoing";
  message_type: "text" | "audio" | "image" | "document" | "location";
  content: string;
  audio_transcription: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  is_ai_response: boolean;
  read_at: string | null;
  created_at: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  variables: string[];
  active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export function useConversations() {
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading, error } = useQuery({
    queryKey: ["whatsapp_conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_conversations")
        .select("*")
        .order("last_message_at", { ascending: false });
      
      if (error) throw error;
      return data as unknown as Conversation[];
    },
  });

  const createConversation = useMutation({
    mutationFn: async (conversation: Omit<Conversation, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("whatsapp_conversations")
        .insert(conversation as never)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp_conversations"] });
    },
  });

  const updateConversation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Conversation> & { id: string }) => {
      const { data, error } = await supabase
        .from("whatsapp_conversations")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp_conversations"] });
    },
  });

  // Statistics
  const stats = {
    total: conversations.length,
    active: conversations.filter(c => c.status === "active").length,
    waiting: conversations.filter(c => c.status === "waiting").length,
    resolved: conversations.filter(c => c.status === "resolved").length,
    escalated: conversations.filter(c => c.status === "escalated").length,
    unread: conversations.reduce((sum, c) => sum + c.unread_count, 0),
    aiHandled: conversations.filter(c => c.ai_handled).length,
  };

  return {
    conversations,
    isLoading,
    error,
    stats,
    createConversation,
    updateConversation,
  };
}

export function useMessages(conversationId: string | null) {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ["whatsapp_messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as unknown as Message[];
    },
    enabled: !!conversationId,
  });

  const sendMessage = useMutation({
    mutationFn: async (message: Omit<Message, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .insert(message as never)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update conversation last_message_at
      await supabase
        .from("whatsapp_conversations")
        .update({ last_message_at: new Date().toISOString() } as never)
        .eq("id", message.conversation_id);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp_messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp_conversations"] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
    },
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}

export function useTemplates() {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ["whatsapp_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .select("*")
        .order("category", { ascending: true });
      
      if (error) throw error;
      return data as unknown as Template[];
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<Template, "id" | "created_at" | "updated_at" | "usage_count">) => {
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .insert(template as never)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp_templates"] });
      toast.success("Template criado!");
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Template> & { id: string }) => {
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp_templates"] });
      toast.success("Template atualizado!");
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("whatsapp_templates")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp_templates"] });
      toast.success("Template removido!");
    },
  });

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
