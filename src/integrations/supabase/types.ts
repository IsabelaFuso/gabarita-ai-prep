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
      achievements: {
        Row: {
          code: string
          description: string
          icon_name: string
          name: string
        }
        Insert: {
          code: string
          description: string
          icon_name: string
          name: string
        }
        Update: {
          code?: string
          description?: string
          icon_name?: string
          name?: string
        }
        Relationships: []
      }
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
      ranks: {
        Row: {
          background_color: string | null
          icon_url: string | null
          id: number
          name: string
          rank_type: string | null
          special_trigger_condition: string | null
          text_color: string | null
          xp_threshold: number
        }
        Insert: {
          background_color?: string | null
          icon_url?: string | null
          id?: number
          name: string
          rank_type?: string | null
          special_trigger_condition?: string | null
          text_color?: string | null
          xp_threshold: number
        }
        Update: {
          background_color?: string | null
          icon_url?: string | null
          id?: number
          name?: string
          rank_type?: string | null
          special_trigger_condition?: string | null
          text_color?: string | null
          xp_threshold?: number
        }
        Relationships: []
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
          score: number | null
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
          score?: number | null
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
          score?: number | null
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
      user_achievements: {
        Row: {
          achievement_code: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_code: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_code?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_code_fkey"
            columns: ["achievement_code"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["code"]
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
          avatar_url: string | null
          chosen_rank_id: number | null
          created_at: string | null
          current_rank_id: number | null
          current_streak: number
          display_name: string | null
          first_choice_course: string | null
          full_name: string | null
          id: string
          last_activity_date: string | null
          preferences: Json | null
          second_choice_course: string | null
          special_ranks_unlocked: number[] | null
          study_hours_per_week: number | null
          study_level: Database["public"]["Enums"]["difficulty_level"] | null
          target_date: string | null
          target_exam: Database["public"]["Enums"]["exam_type"] | null
          target_institution_id: string | null
          target_subjects: string[] | null
          total_study_time_seconds: number
          updated_at: string | null
          user_id: string | null
          username: string | null
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          chosen_rank_id?: number | null
          created_at?: string | null
          current_rank_id?: number | null
          current_streak?: number
          display_name?: string | null
          first_choice_course?: string | null
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          preferences?: Json | null
          second_choice_course?: string | null
          special_ranks_unlocked?: number[] | null
          study_hours_per_week?: number | null
          study_level?: Database["public"]["Enums"]["difficulty_level"] | null
          target_date?: string | null
          target_exam?: Database["public"]["Enums"]["exam_type"] | null
          target_institution_id?: string | null
          target_subjects?: string[] | null
          total_study_time_seconds?: number
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          chosen_rank_id?: number | null
          created_at?: string | null
          current_rank_id?: number | null
          current_streak?: number
          display_name?: string | null
          first_choice_course?: string | null
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          preferences?: Json | null
          second_choice_course?: string | null
          special_ranks_unlocked?: number[] | null
          study_hours_per_week?: number | null
          study_level?: Database["public"]["Enums"]["difficulty_level"] | null
          target_date?: string | null
          target_exam?: Database["public"]["Enums"]["exam_type"] | null
          target_institution_id?: string | null
          target_subjects?: string[] | null
          total_study_time_seconds?: number
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_chosen_rank_id_fkey"
            columns: ["chosen_rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_current_rank_id_fkey"
            columns: ["current_rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_target_institution_id_fkey"
            columns: ["target_institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_dashboard_data: {
        Row: {
          avatar_url: string | null
          current_streak: number | null
          full_name: string | null
          last_activity_date: string | null
          next_rank_xp_threshold: number | null
          rank_name: string | null
          rank_xp_threshold: number | null
          user_id: string | null
          xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_and_grant_achievements: {
        Args: {
          p_user_id: string
          p_simulado_accuracy?: number
          p_simulado_question_count?: number
        }
        Returns: {
          code: string
          name: string
          description: string
          icon_name: string
        }[]
      }
      exec: {
        Args: { sql: string }
        Returns: undefined
      }
      get_custom_simulado_questions: {
        Args: {
          p_user_id: string
          p_university_name: string
          p_question_count: number
          p_subject_names?: string[]
          p_difficulty_levels?: Database["public"]["Enums"]["difficulty_level"][]
          p_exclude_ids?: string[]
          p_prioritize_weaknesses?: boolean
        }
        Returns: {
          question_id: string
          statement: string
          image_url: string
          alternatives: Json
          correct_answer: string
          explanation: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          subject_name: string
          topic_name: string
          institution_name: string
          year: number
        }[]
      }
      get_performance_summary: {
        Args: { p_user_id: string }
        Returns: {
          subject_name: string
          correct_answers: number
          total_questions: number
          accuracy: number
        }[]
      }
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
          institution_name: string
          year: number
        }[]
      }
      get_rank_for_xp: {
        Args: { p_xp: number }
        Returns: number
      }
      get_ranking: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          full_name: string
          avatar_url: string
          xp: number
          rank_name: string
          target_institution: string
          target_course: string
          latest_achievement_name: string
          latest_achievement_icon: string
        }[]
      }
      get_user_performance_summary: {
        Args: { p_user_id: string }
        Returns: {
          subject_id: string
          subject_name: string
          topic_id: string
          topic_name: string
          total_attempts: number
          correct_attempts: number
          accuracy: number
        }[]
      }
      handle_essay_submission: {
        Args: { p_user_id: string; p_score: number }
        Returns: {
          code: string
          name: string
          description: string
          icon_name: string
        }[]
      }
      update_user_stats: {
        Args:
          | {
              p_user_id: string
              p_time_increase: number
              p_xp_increase: number
            }
          | {
              p_user_id: string
              p_xp_change: number
              p_correct_answers_change: number
              p_wrong_answers_change: number
            }
        Returns: undefined
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
