export interface Question {
  id: string;
  institution?: string | { name: string };
  year?: number;
  subject: string | { name: string };
  topic?: string | { name: string };
  statement: string;
  image?: string;
  image_url?: string;
  type?: 'multipla_escolha' | 'summation' | 'discursiva' | 'verdadeiro_falso';
  alternatives?: string[];
  options?: { [key: string]: string } | { text: string; value: number }[];
  correctAnswer?: number;
  correct_answers?: { answer?: string; sum?: number };
  correct_sum?: number;
  explanation?: string;
}

export interface QuestionFilters {
  institution?: string;
  subject?: string;
  topic?: string;
  year?: number;
}

export interface Achievement {
  code: string;
  name: string;
  description: string;
  icon_name: string;
  icon_url?: string;
}

export interface RecentActivity {
  id: string;
  finished_at: string;
  title: string;
  score: number;
}

export interface RankingUser {
  user_id?: string;
  full_name: string;
  avatar_url: string;
  xp: number;
  rank_name: string;
  target_institution: string;
  target_course: string;
  latest_achievement_name?: string;
  latest_achievement_icon?: string;
  chosen_rank_name?: string;
  chosen_rank_icon?: string;
}

export interface Rank {
  id: number;
  name: string;
  xp_threshold: number;
  rank_type: 'general' | 'special_humorous';
  special_trigger_condition?: string;
  icon_url?: string;
  background_color?: string;
  text_color?: string;
}

export interface UserProfile {
  user_id: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  xp: number;
  current_streak: number;
  current_rank_id: number;
  chosen_rank_id?: number;
  special_ranks_unlocked: number[];
  target_institution_id?: string;
  first_choice_course?: string;
  second_choice_course?: string;
}