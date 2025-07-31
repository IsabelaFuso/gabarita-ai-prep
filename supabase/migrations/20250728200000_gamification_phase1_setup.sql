-- Rename existing column for clarity
ALTER TABLE public.user_profiles
RENAME COLUMN gamification_score TO xp;

-- Add new gamification columns to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Iniciante' NOT NULL,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- Create table to define all possible achievements
CREATE TABLE IF NOT EXISTS public.achievements (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL -- e.g., 'Trophy', 'Star', 'Zap' from lucide-react
);

-- Create join table to track unlocked achievements for each user
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_code TEXT NOT NULL REFERENCES public.achievements(code) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, achievement_code)
);

-- Populate the achievements table with some initial data
INSERT INTO public.achievements (code, name, description, icon_name) VALUES
    ('FIRST_SIMULADO', 'Primeiros Passos', 'Você completou seu primeiro simulado!', 'Footprints'),
    ('STREAK_3', 'Consistência é a Chave', 'Manteve uma sequência de 3 dias de estudos.', 'CalendarDays'),
    ('STREAK_7', 'Hábito Formado', 'Manteve uma sequência de 7 dias de estudos!', 'CalendarCheck'),
    ('ACCURACY_90', 'Precisão Cirúrgica', 'Alcançou 90% de acerto em um simulado com mais de 30 questões.', 'Target'),
    ('QUESTIONS_100', 'Centurião', 'Você respondeu 100 questões.', 'Swords'),
    ('QUESTIONS_500', 'Maratonista', 'Você respondeu 500 questões!', 'Medal')
ON CONFLICT (code) DO NOTHING;

-- Enable RLS for the new tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for achievements
CREATE POLICY "Public read access for achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Users can view their own unlocked achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
