-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data integrity
CREATE TYPE difficulty_level AS ENUM ('facil', 'medio', 'dificil');
CREATE TYPE question_type AS ENUM ('multipla_escolha', 'discursiva', 'verdadeiro_falso');
CREATE TYPE exam_type AS ENUM ('enem', 'fuvest', 'unicamp', 'uem', 'outros');

-- Table for institutions/exams
CREATE TABLE public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    exam_type exam_type NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for subjects
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    area TEXT NOT NULL, -- Ciências Humanas, Exatas, Biológicas, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for topics within subjects
CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main questions table
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES public.institutions(id),
    subject_id UUID REFERENCES public.subjects(id),
    topic_id UUID REFERENCES public.topics(id),
    year INTEGER,
    question_number TEXT,
    type question_type DEFAULT 'multipla_escolha',
    difficulty difficulty_level DEFAULT 'medio',
    statement TEXT NOT NULL,
    alternatives JSONB, -- For multiple choice: ["A) ...", "B) ...", ...]
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    image_url TEXT,
    tags TEXT[],
    competencies TEXT[], -- ENEM competencies
    skills TEXT[], -- ENEM skills
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles for personalized learning
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_exam exam_type,
    target_subjects UUID[], -- Array of subject IDs
    study_level difficulty_level DEFAULT 'medio',
    study_hours_per_week INTEGER,
    target_date DATE,
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User question attempts for performance tracking
CREATE TABLE public.user_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    user_answer TEXT,
    is_correct BOOLEAN,
    time_spent INTEGER, -- in seconds
    attempt_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    context TEXT -- 'simulado', 'pratica', 'revisao'
);

-- Simulados/Tests
CREATE TABLE public.simulados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    institution_id UUID REFERENCES public.institutions(id),
    total_questions INTEGER NOT NULL,
    time_limit INTEGER, -- in minutes
    difficulty difficulty_level,
    status TEXT DEFAULT 'rascunho', -- rascunho, ativo, finalizado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE
);

-- Questions in simulados
CREATE TABLE public.simulado_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulado_id UUID REFERENCES public.simulados(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    question_order INTEGER NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN,
    time_spent INTEGER,
    answered_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulado_questions ENABLE ROW LEVEL SECURITY;

-- Public read access for reference data
CREATE POLICY "Public read access for institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Public read access for subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read access for topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public read access for questions" ON public.questions FOR SELECT USING (true);

-- User-specific policies for profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- User-specific policies for attempts
CREATE POLICY "Users can view own attempts" ON public.user_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own attempts" ON public.user_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User-specific policies for simulados
CREATE POLICY "Users can view own simulados" ON public.simulados FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own simulados" ON public.simulados FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own simulados" ON public.simulados FOR UPDATE USING (auth.uid() = user_id);

-- Simulado questions access through simulado ownership
CREATE POLICY "Users can access simulado questions" ON public.simulado_questions 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.simulados 
        WHERE simulados.id = simulado_questions.simulado_id 
        AND simulados.user_id = auth.uid()
    )
);

-- Create indexes for better performance
CREATE INDEX idx_questions_institution ON public.questions(institution_id);
CREATE INDEX idx_questions_subject ON public.questions(subject_id);
CREATE INDEX idx_questions_topic ON public.questions(topic_id);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_questions_year ON public.questions(year);
CREATE INDEX idx_user_attempts_user_question ON public.user_attempts(user_id, question_id);
CREATE INDEX idx_user_attempts_date ON public.user_attempts(attempt_date);
CREATE INDEX idx_simulado_questions_simulado ON public.simulado_questions(simulado_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data
INSERT INTO public.institutions (name, code, exam_type, description) VALUES
('ENEM', 'ENEM', 'enem', 'Exame Nacional do Ensino Médio'),
('FUVEST', 'FUVEST', 'fuvest', 'Fundação Universitária para o Vestibular - USP'),
('UNICAMP', 'UNICAMP', 'unicamp', 'Universidade Estadual de Campinas'),
('UEM', 'UEM', 'uem', 'Universidade Estadual de Maringá');

INSERT INTO public.subjects (name, code, area) VALUES
('Matemática', 'MAT', 'Ciências Exatas'),
('Física', 'FIS', 'Ciências Exatas'),
('Química', 'QUI', 'Ciências Exatas'),
('Biologia', 'BIO', 'Ciências Biológicas'),
('História', 'HIS', 'Ciências Humanas'),
('Geografia', 'GEO', 'Ciências Humanas'),
('Português', 'POR', 'Linguagens'),
('Literatura', 'LIT', 'Linguagens'),
('Inglês', 'ING', 'Linguagens'),
('Filosofia', 'FIL', 'Ciências Humanas'),
('Sociologia', 'SOC', 'Ciências Humanas');

-- Function to get personalized questions based on user profile and performance
CREATE OR REPLACE FUNCTION public.get_personalized_questions(
    p_user_id UUID,
    p_count INTEGER DEFAULT 20,
    p_institution_id UUID DEFAULT NULL
)
RETURNS TABLE (
    question_id UUID,
    statement TEXT,
    alternatives JSONB,
    correct_answer TEXT,
    difficulty difficulty_level,
    subject_name TEXT,
    topic_name TEXT
) AS $$
DECLARE
    user_level difficulty_level;
    target_subjects UUID[];
BEGIN
    -- Get user profile info
    SELECT study_level, target_subjects INTO user_level, target_subjects
    FROM public.user_profiles 
    WHERE user_id = p_user_id;
    
    -- If no profile, use default
    IF user_level IS NULL THEN
        user_level := 'medio';
    END IF;
    
    -- Return personalized questions
    RETURN QUERY
    SELECT 
        q.id,
        q.statement,
        q.alternatives,
        q.correct_answer,
        q.difficulty,
        s.name,
        t.name
    FROM public.questions q
    JOIN public.subjects s ON q.subject_id = s.id
    LEFT JOIN public.topics t ON q.topic_id = t.id
    WHERE 
        (p_institution_id IS NULL OR q.institution_id = p_institution_id)
        AND (target_subjects IS NULL OR q.subject_id = ANY(target_subjects))
        AND q.difficulty <= user_level
        AND q.id NOT IN (
            -- Exclude recently attempted questions
            SELECT question_id FROM public.user_attempts 
            WHERE user_id = p_user_id 
            AND attempt_date > NOW() - INTERVAL '7 days'
        )
    ORDER BY 
        -- Prioritize weaker subjects
        CASE WHEN q.subject_id IN (
            SELECT ua.question_id 
            FROM public.user_attempts ua 
            JOIN public.questions uq ON ua.question_id = uq.id
            WHERE ua.user_id = p_user_id 
            AND ua.is_correct = false
            GROUP BY uq.subject_id
            HAVING COUNT(*) > 2
        ) THEN 1 ELSE 2 END,
        RANDOM()
    LIMIT p_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;