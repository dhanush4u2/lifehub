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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      credits_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          meta: Json | null
          owner: string | null
          reason: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          meta?: Json | null
          owner?: string | null
          reason?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          meta?: Json | null
          owner?: string | null
          reason?: string | null
          type?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          attendees: Json | null
          created_at: string | null
          description: string | null
          ends_at: string | null
          hub_id: string | null
          id: string
          location: string | null
          owner: string | null
          starts_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attendees?: Json | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          hub_id?: string | null
          id?: string
          location?: string | null
          owner?: string | null
          starts_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attendees?: Json | null
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          hub_id?: string | null
          id?: string
          location?: string | null
          owner?: string | null
          starts_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          description: string | null
          hub_id: string | null
          id: string
          milestones: Json | null
          owner: string | null
          progress: number | null
          target_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hub_id?: string | null
          id?: string
          milestones?: Json | null
          owner?: string | null
          progress?: number | null
          target_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hub_id?: string | null
          id?: string
          milestones?: Json | null
          owner?: string | null
          progress?: number | null
          target_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          cadence: string | null
          completed_days: number | null
          completed_today: boolean | null
          created_at: string | null
          credits: number | null
          hub_id: string | null
          id: string
          last_completed: string | null
          name: string
          owner: string | null
          schedule: Json | null
          streak: number | null
          target_days: number | null
          updated_at: string | null
        }
        Insert: {
          cadence?: string | null
          completed_days?: number | null
          completed_today?: boolean | null
          created_at?: string | null
          credits?: number | null
          hub_id?: string | null
          id?: string
          last_completed?: string | null
          name: string
          owner?: string | null
          schedule?: Json | null
          streak?: number | null
          target_days?: number | null
          updated_at?: string | null
        }
        Update: {
          cadence?: string | null
          completed_days?: number | null
          completed_today?: boolean | null
          created_at?: string | null
          credits?: number | null
          hub_id?: string | null
          id?: string
          last_completed?: string | null
          name?: string
          owner?: string | null
          schedule?: Json | null
          streak?: number | null
          target_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habits_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      hubs: {
        Row: {
          color: string
          created_at: string | null
          icon: string
          id: string
          is_default: boolean | null
          owner: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          icon: string
          id?: string
          is_default?: boolean | null
          owner?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          icon?: string
          id?: string
          is_default?: boolean | null
          owner?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          meta: Json | null
          timezone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          meta?: Json | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          meta?: Json | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          credits: number | null
          description: string | null
          due_at: string | null
          hub_id: string | null
          id: string
          metadata: Json | null
          owner: string | null
          priority: number | null
          repeat: Json | null
          scheduled_at: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits?: number | null
          description?: string | null
          due_at?: string | null
          hub_id?: string | null
          id?: string
          metadata?: Json | null
          owner?: string | null
          priority?: number | null
          repeat?: Json | null
          scheduled_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits?: number | null
          description?: string | null
          due_at?: string | null
          hub_id?: string | null
          id?: string
          metadata?: Json | null
          owner?: string | null
          priority?: number | null
          repeat?: Json | null
          scheduled_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          id: string
          metadata: Json | null
          name: string
          price: number | null
          slug: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          name: string
          price?: number | null
          slug: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          name?: string
          price?: number | null
          slug?: string
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          created_at: string | null
          id: string
          owner: string | null
          theme_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          owner?: string | null
          theme_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          owner?: string | null
          theme_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
