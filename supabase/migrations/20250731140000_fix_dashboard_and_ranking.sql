-- Migration to fix dashboard and ranking views

-- Step 1: Create a SECURITY DEFINER function to get the public ranking data.
-- This is necessary because RLS policies prevent users from seeing each other's profiles.
CREATE OR REPLACE FUNCTION public.get_ranking()
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    xp INTEGER,
    level TEXT,
    target_institution TEXT,
    target_course TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        up.user_id,
        up.full_name,
        up.avatar_url,
        up.xp,
        up.level,
        i.name AS target_institution,
        up.first_choice_course AS target_course
    FROM
        public.user_profiles up
    LEFT JOIN
        public.institutions i ON up.target_institution_id = i.id
    ORDER BY
        up.xp DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_ranking() IS 'Returns the top 50 users for the public ranking. Runs with definer privileges to safely bypass RLS.';

-- Step 2: Create a comprehensive performance summary function.
-- This moves the logic from DesempenhoView.tsx to the database for efficiency.
CREATE OR REPLACE FUNCTION public.get_performance_summary(p_user_id UUID)
RETURNS TABLE (
    subject_name TEXT,
    correct_answers BIGINT,
    total_questions BIGINT,
    accuracy REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.name AS subject_name,
        COUNT(CASE WHEN ua.is_correct THEN 1 END) AS correct_answers,
        COUNT(ua.id) AS total_questions,
        (COUNT(CASE WHEN ua.is_correct THEN 1 END)::REAL / COUNT(ua.id)::REAL) AS accuracy
    FROM
        public.user_attempts ua
    JOIN
        public.questions q ON ua.question_id = q.id
    JOIN
        public.subjects s ON q.subject_id = s.id
    WHERE
        ua.user_id = p_user_id
    GROUP BY
        s.name
    ORDER BY
        total_questions DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.get_performance_summary(UUID) IS 'Calculates a user''s performance statistics grouped by subject.';


-- Step 3: Add a score column to the simulados table to fix "Recent Activity".
ALTER TABLE public.simulados
ADD COLUMN IF NOT EXISTS score REAL; -- e.g., 0.85 for 85%

COMMENT ON COLUMN public.simulados.score IS 'The accuracy score of the simulado (e.g., 0.85 for 85%). Added to simplify recent activity queries.';

-- Grant permissions for the new functions
GRANT EXECUTE ON FUNCTION public.get_ranking() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_performance_summary(UUID) TO authenticated;
