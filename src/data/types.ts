export interface Question {
  id: string;
  institution?: string;
  year?: number;
  subject: string;
  topic: string;
  statement: string;
  image?: string; // URL or path for the question image
  alternatives: string[];
  correctAnswer: number;
  explanation: string;
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
}
