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
      boards: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      calendar_days: {
        Row: {
          absence_attachment_url: string | null
          absence_note: string | null
          absence_type: Database["public"]["Enums"]["absence_type"] | null
          completed_planned_tasks: boolean | null
          created_at: string | null
          date: string
          id: string
          updated_at: string | null
          user_id: string
          went_to_college: boolean | null
        }
        Insert: {
          absence_attachment_url?: string | null
          absence_note?: string | null
          absence_type?: Database["public"]["Enums"]["absence_type"] | null
          completed_planned_tasks?: boolean | null
          created_at?: string | null
          date: string
          id?: string
          updated_at?: string | null
          user_id: string
          went_to_college?: boolean | null
        }
        Update: {
          absence_attachment_url?: string | null
          absence_note?: string | null
          absence_type?: Database["public"]["Enums"]["absence_type"] | null
          completed_planned_tasks?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          updated_at?: string | null
          user_id?: string
          went_to_college?: boolean | null
        }
        Relationships: []
      }
      cards: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimate_hours: number | null
          id: string
          labels: string[] | null
          list_id: string
          position: number
          priority: Database["public"]["Enums"]["priority_level"] | null
          sprint_id: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimate_hours?: number | null
          id?: string
          labels?: string[] | null
          list_id: string
          position?: number
          priority?: Database["public"]["Enums"]["priority_level"] | null
          sprint_id?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimate_hours?: number | null
          id?: string
          labels?: string[] | null
          list_id?: string
          position?: number
          priority?: Database["public"]["Enums"]["priority_level"] | null
          sprint_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          board_id: string
          created_at: string | null
          id: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          board_id: string
          created_at?: string | null
          id?: string
          name: string
          position?: number
          updated_at?: string | null
        }
        Update: {
          board_id?: string
          created_at?: string | null
          id?: string
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lists_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      planned_tasks: {
        Row: {
          calendar_day_id: string
          card_id: string
          completed: boolean | null
          created_at: string | null
          id: string
        }
        Insert: {
          calendar_day_id: string
          card_id: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
        }
        Update: {
          calendar_day_id?: string
          card_id?: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planned_tasks_calendar_day_id_fkey"
            columns: ["calendar_day_id"]
            isOneToOne: false
            referencedRelation: "calendar_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_tasks_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          timezone: string | null
          updated_at: string | null
          workday_end: string | null
          workday_start: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          timezone?: string | null
          updated_at?: string | null
          workday_end?: string | null
          workday_start?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          timezone?: string | null
          updated_at?: string | null
          workday_end?: string | null
          workday_start?: string | null
        }
        Relationships: []
      }
      sprints: {
        Row: {
          created_at: string | null
          end_date: string
          goal: string | null
          id: string
          name: string
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          goal?: string | null
          id?: string
          name: string
          start_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          goal?: string | null
          id?: string
          name?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subtasks: {
        Row: {
          card_id: string
          created_at: string | null
          done: boolean | null
          estimate_hours: number | null
          id: string
          position: number
          title: string
          updated_at: string | null
        }
        Insert: {
          card_id: string
          created_at?: string | null
          done?: boolean | null
          estimate_hours?: number | null
          id?: string
          position?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          card_id?: string
          created_at?: string | null
          done?: boolean | null
          estimate_hours?: number | null
          id?: string
          position?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
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
      absence_type: "personal" | "sick" | "permission"
      priority_level: "P0" | "P1" | "P2" | "P3"
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
    Enums: {
      absence_type: ["personal", "sick", "permission"],
      priority_level: ["P0", "P1", "P2", "P3"],
    },
  },
} as const
