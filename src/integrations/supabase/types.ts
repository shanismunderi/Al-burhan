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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attempt_answers: {
        Row: {
          attempt_id: string
          id: string
          is_correct: boolean | null
          manual_score: number | null
          question_id: string
          selected_answer: string | null
          updated_at: string
        }
        Insert: {
          attempt_id: string
          id?: string
          is_correct?: boolean | null
          manual_score?: number | null
          question_id: string
          selected_answer?: string | null
          updated_at?: string
        }
        Update: {
          attempt_id?: string
          id?: string
          is_correct?: boolean | null
          manual_score?: number | null
          question_id?: string
          selected_answer?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempt_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      cheat_events: {
        Row: {
          attempt_id: string
          event_type: string
          id: string
          occurred_at: string
          user_id: string
        }
        Insert: {
          attempt_id: string
          event_type: string
          id?: string
          occurred_at?: string
          user_id: string
        }
        Update: {
          attempt_id?: string
          event_type?: string
          id?: string
          occurred_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cheat_events_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_code: string | null
          created_at: string
          display_name: string | null
          id: string
          username: string
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          username: string
        }
        Update: {
          access_code?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          username?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string | null
          created_at: string
          id: string
          marks: number
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          position: number
          question_text: string
          question_type: string
          quiz_id: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          id?: string
          marks?: number
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          position?: number
          question_text: string
          question_type?: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          id?: string
          marks?: number
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          position?: number
          question_text?: string
          question_type?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          correct_count: number
          ends_at: string
          id: string
          quiz_id: string
          score: number
          started_at: string
          status: string
          submitted_at: string | null
          total_questions: number
          user_id: string
          warnings: number
        }
        Insert: {
          correct_count?: number
          ends_at: string
          id?: string
          quiz_id: string
          score?: number
          started_at?: string
          status?: string
          submitted_at?: string | null
          total_questions?: number
          user_id: string
          warnings?: number
        }
        Update: {
          correct_count?: number
          ends_at?: string
          id?: string
          quiz_id?: string
          score?: number
          started_at?: string
          status?: string
          submitted_at?: string | null
          total_questions?: number
          user_id?: string
          warnings?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          instructions: string | null
          is_active: boolean
          negative_marks: number
          randomize: boolean
          title: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          instructions?: string | null
          is_active?: boolean
          negative_marks?: number
          randomize?: boolean
          title: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          instructions?: string | null
          is_active?: boolean
          negative_marks?: number
          randomize?: boolean
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      email_for_access_code: { Args: { _code: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "participant"
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
      app_role: ["admin", "participant"],
    },
  },
} as const
