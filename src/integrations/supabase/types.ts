export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      institutions: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          exam_type: Database["public"]["Enums"]["exam_type"]
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          exam_type: Database["public"]["Enums"]["exam_type"]
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          alternatives: Json | null
          competencies: string[] | null
          correct_answer: string
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          explanation: string | null
          id: string
          image_url: string | null
          institution_id: string | null
          question_number: string | null
          skills: string[] | null
          statement: string
          subject_id: string | null
          tags: string[] | null
          topic_id: string | null
          type: Database["public"]["Enums"]["question_type"] | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          alternatives?: Json | null
          competencies?: string[] | null
          correct_answer: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          institution_id?: string | null
          question_number?: string | null
          skills?: string[] | null
          statement: string
          subject_id?: string | null
          tags?: string[] | null
          topic_id?: string | null
          type?: Database["public"]["Enums"]["question_type"] | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          alternatives?: Json | null
          competencies?: string[] | null
          correct_answer?: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          explanation?: string | null
          id?: string
          image_url?: string | null
          institution_id?: string | null
          question_number?: string | null
          skills?: string[] | null
          statement?: string
          subject_id?: string | null
          tags?: string[] | null
          topic_id?: string | null
          type?: Database["public"]["Enums"]["question_type"] | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      simulado_questions: {
        Row: {
          answered_at: string | null
          id: string
          is_correct: boolean | null
          question_id: string | null
          question_order: number
          simulado_id: string | null
          time_spent: number | null
          user_answer: string | null
        }
        Insert: {
          answered_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          question_order: number
          simulado_id?: string | null
          time_spent?: number | null
          user_answer?: string | null
        }
        Update: {
          answered_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          question_order?: number
          simulado_id?: string | null
          time_spent?: number | null
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulado_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulado_questions_simulado_id_fkey"
            columns: ["simulado_id"]
            isOneToOne: false
            referencedRelation: "simulados"
            referencedColumns: ["id"]
          },
        ]
      }
      simulados: {
        Row: {
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          finished_at: string | null
          id: string
          institution_id: string | null
          started_at: string | null
          status: string | null
          time_limit: number | null
          title: string
          total_questions: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          finished_at?: string | null
          id?: string
          institution_id?: string | null
          started_at?: string | null
          status?: string | null
          time_limit?: number | null
          title: string
          total_questions: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          finished_at?: string | null
          id?: string
          institution_id?: string | null
          started_at?: string | null
          status?: string | null
          time_limit?: number | null
          title?: string
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulados_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          area: string
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          area: string
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          area?: string
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_attempts: {
        Row: {
          attempt_date: string | null
          context: string | null
          id: string
          is_correct: boolean | null
          question_id: string | null
          time_spent: number | null
          user_answer: string | null
          user_id: string | null
        }
        Insert: {
          attempt_date?: string | null
          context?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          time_spent?: number | null
          user_answer?: string | null
          user_id?: string | null
        }
        Update: {
          attempt_date?: string | null
          context?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          time_spent?: number | null
          user_answer?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json | null
          study_hours_per_week: number | null
          study_level: Database["public"]["Enums"]["difficulty_level"] | null
          target_date: string | null
          target_exam: Database["public"]["Enums"]["exam_type"] | null
          target_subjects: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          study_hours_per_week?: number | null
          study_level?: Database["public"]["Enums"]["difficulty_level"] | null
          target_date?: string | null
          target_exam?: Database["public"]["Enums"]["exam_type"] | null
          target_subjects?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          study_hours_per_week?: number | null
          study_level?: Database["public"]["Enums"]["difficulty_level"] | null
          target_date?: string | null
          target_exam?: Database["public"]["Enums"]["exam_type"] | null
          target_subjects?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_personalized_questions: {
        Args: { p_user_id: string; p_count?: number; p_institution_id?: string }
        Returns: {
          question_id: string
          statement: string
          alternatives: Json
          correct_answer: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          subject_name: string
          topic_name: string
        }[]
      }
    }
    Enums: {
      difficulty_level: "facil" | "medio" | "dificil"
      exam_type: "enem" | "fuvest" | "unicamp" | "uem" | "outros"
      question_type: "multipla_escolha" | "discursiva" | "verdadeiro_falso"
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
      difficulty_level: ["facil", "medio", "dificil"],
      exam_type: ["enem", "fuvest", "unicamp", "uem", "outros"],
      question_type: ["multipla_escolha", "discursiva", "verdadeiro_falso"],
    },
  },
} as const
