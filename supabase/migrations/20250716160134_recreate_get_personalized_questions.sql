DROP FUNCTION IF EXISTS public.get_personalized_questions(uuid, integer, uuid) CASCADE;

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
    topic_name TEXT,
    institution_name TEXT,
    year INTEGER
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
        t.name,
        i.name AS institution_name,
        q.year
    FROM public.questions q
    JOIN public.subjects s ON q.subject_id = s.id
    LEFT JOIN public.topics t ON q.topic_id = t.id
    LEFT JOIN public.institutions i ON q.institution_id = i.id
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
            SELECT uq.subject_id
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