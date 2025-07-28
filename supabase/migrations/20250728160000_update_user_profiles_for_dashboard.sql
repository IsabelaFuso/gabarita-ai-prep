-- Add columns to store user's specific vestibular configuration
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS target_institution_id UUID REFERENCES public.institutions(id),
ADD COLUMN IF NOT EXISTS first_choice_course TEXT,
ADD COLUMN IF NOT EXISTS second_choice_course TEXT;

-- Add columns for dashboard stats
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS total_study_time_seconds INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS gamification_score INTEGER DEFAULT 0 NOT NULL;
