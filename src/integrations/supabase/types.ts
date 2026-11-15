export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      body_measurements: {
        Row: {
          arm_left: number | null
          arm_right: number | null
          body_fat_percentage: number | null
          calf_left: number | null
          calf_right: number | null
          chest: number | null
          created_at: string
          height: number | null
          hips: number | null
          id: string
          measurement_date: string
          muscle_mass: number | null
          notes: string | null
          student_id: string
          thigh_left: number | null
          thigh_right: number | null
          waist: number | null
          weight: number | null
        }
        Insert: {
          arm_left?: number | null
          arm_right?: number | null
          body_fat_percentage?: number | null
          calf_left?: number | null
          calf_right?: number | null
          chest?: number | null
          created_at?: string
          height?: number | null
          hips?: number | null
          id?: string
          measurement_date?: string
          muscle_mass?: number | null
          notes?: string | null
          student_id: string
          thigh_left?: number | null
          thigh_right?: number | null
          waist?: number | null
          weight?: number | null
        }
        Update: {
          arm_left?: number | null
          arm_right?: number | null
          body_fat_percentage?: number | null
          calf_left?: number | null
          calf_right?: number | null
          chest?: number | null
          created_at?: string
          height?: number | null
          hips?: number | null
          id?: string
          measurement_date?: string
          muscle_mass?: number | null
          notes?: string | null
          student_id?: string
          thigh_left?: number | null
          thigh_right?: number | null
          waist?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "body_measurements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      checkins: {
        Row: {
          checkin_at: string
          checkout_at: string | null
          created_at: string
          id: string
          modality: string | null
          student_id: string
        }
        Insert: {
          checkin_at?: string
          checkout_at?: string | null
          created_at?: string
          id?: string
          modality?: string | null
          student_id: string
        }
        Update: {
          checkin_at?: string
          checkout_at?: string | null
          created_at?: string
          id?: string
          modality?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkins_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          duration_months: number
          features: string[] | null
          id: string
          modalities: string[] | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration_months?: number
          features?: string[] | null
          id?: string
          modalities?: string[] | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration_months?: number
          features?: string[] | null
          id?: string
          modalities?: string[] | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          category: string
          cost_price: number | null
          created_at: string
          description: string | null
          id: string
          min_stock: number | null
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number | null
          name: string
          price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      radio_announcements: {
        Row: {
          active: boolean
          ai_generated: boolean | null
          audio_url: string | null
          content: string
          created_at: string
          duration_seconds: number | null
          id: string
          plays_count: number | null
          priority: number | null
          repeat_interval_minutes: number | null
          scheduled_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          ai_generated?: boolean | null
          audio_url?: string | null
          content: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          plays_count?: number | null
          priority?: number | null
          repeat_interval_minutes?: number | null
          scheduled_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          ai_generated?: boolean | null
          audio_url?: string | null
          content?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          plays_count?: number | null
          priority?: number | null
          repeat_interval_minutes?: number | null
          scheduled_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      radio_playlists: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          name: string
          tracks: Json | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          name: string
          tracks?: Json | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          name?: string
          tracks?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      radio_schedules: {
        Row: {
          active: boolean
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          playlist_id: string
          start_time: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          playlist_id: string
          start_time: string
        }
        Update: {
          active?: boolean
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          playlist_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "radio_schedules_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "radio_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          allergies: string | null
          birth_date: string | null
          blood_type: string | null
          cpf: string | null
          created_at: string
          current_plan_id: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          medical_notes: string | null
          modalities: string[] | null
          name: string
          notes: string | null
          phone: string | null
          photo_url: string | null
          plan_end_date: string | null
          plan_start_date: string | null
          status: Database["public"]["Enums"]["student_status"]
          updated_at: string
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          allergies?: string | null
          birth_date?: string | null
          blood_type?: string | null
          cpf?: string | null
          created_at?: string
          current_plan_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          medical_notes?: string | null
          modalities?: string[] | null
          name: string
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          plan_end_date?: string | null
          plan_start_date?: string | null
          status?: Database["public"]["Enums"]["student_status"]
          updated_at?: string
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          allergies?: string | null
          birth_date?: string | null
          blood_type?: string | null
          cpf?: string | null
          created_at?: string
          current_plan_id?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          medical_notes?: string | null
          modalities?: string[] | null
          name?: string
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          plan_end_date?: string | null
          plan_start_date?: string | null
          status?: Database["public"]["Enums"]["student_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_current_plan_id_fkey"
            columns: ["current_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount_paid: number | null
          created_at: string
          end_date: string
          id: string
          payment_method: string | null
          plan_id: string
          start_date: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          end_date: string
          id?: string
          payment_method?: string | null
          plan_id: string
          start_date: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          end_date?: string
          id?: string
          payment_method?: string | null
          plan_id?: string
          start_date?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["transaction_category"]
          created_at: string
          description: string
          id: string
          notes: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          category?: Database["public"]["Enums"]["transaction_category"]
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["transaction_category"]
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          ai_handled: boolean | null
          contact_name: string | null
          created_at: string
          id: string
          last_message_at: string | null
          phone_number: string
          status: Database["public"]["Enums"]["conversation_status"]
          student_id: string | null
          unread_count: number | null
          updated_at: string
        }
        Insert: {
          ai_handled?: boolean | null
          contact_name?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          phone_number: string
          status?: Database["public"]["Enums"]["conversation_status"]
          student_id?: string | null
          unread_count?: number | null
          updated_at?: string
        }
        Update: {
          ai_handled?: boolean | null
          contact_name?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          phone_number?: string
          status?: Database["public"]["Enums"]["conversation_status"]
          student_id?: string | null
          unread_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          audio_transcription: string | null
          content: string
          conversation_id: string
          created_at: string
          direction: string
          id: string
          is_ai_response: boolean | null
          message_type: Database["public"]["Enums"]["message_type"]
          read_at: string | null
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
        }
        Insert: {
          audio_transcription?: string | null
          content: string
          conversation_id: string
          created_at?: string
          direction: string
          id?: string
          is_ai_response?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"]
          read_at?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
        }
        Update: {
          audio_transcription?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          direction?: string
          id?: string
          is_ai_response?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"]
          read_at?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_templates: {
        Row: {
          active: boolean
          category: string
          content: string
          created_at: string
          id: string
          name: string
          updated_at: string
          usage_count: number | null
          variables: string[] | null
        }
        Insert: {
          active?: boolean
          category: string
          content: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          usage_count?: number | null
          variables?: string[] | null
        }
        Update: {
          active?: boolean
          category?: string
          content?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          usage_count?: number | null
          variables?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff_or_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
      conversation_status: "active" | "waiting" | "resolved" | "escalated"
      gender_type: "male" | "female" | "other" | "prefer_not_say"
      message_type: "text" | "audio" | "image" | "document" | "location"
      sentiment_type: "positive" | "neutral" | "negative"
      student_status: "active" | "inactive" | "suspended" | "pending"
      transaction_category:
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
        | "outro"
      transaction_status: "completed" | "pending" | "cancelled"
      transaction_type: "entrada" | "saida"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user"],
      conversation_status: ["active", "waiting", "resolved", "escalated"],
      gender_type: ["male", "female", "other", "prefer_not_say"],
      message_type: ["text", "audio", "image", "document", "location"],
      sentiment_type: ["positive", "neutral", "negative"],
      student_status: ["active", "inactive", "suspended", "pending"],
      transaction_category: [
        "mensalidade",
        "pdv",
        "despesa",
        "suplemento",
        "vestuario",
        "acessorio",
        "manutencao",
        "salario",
        "aluguel",
        "energia",
        "agua",
        "outro",
      ],
      transaction_status: ["completed", "pending", "cancelled"],
      transaction_type: ["entrada", "saida"],
    },
  },
} as const
