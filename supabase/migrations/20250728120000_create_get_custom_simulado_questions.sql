CREATE OR REPLACE FUNCTION public.get_custom_simulado_questions(
    p_user_id UUID,
    p_university_name TEXT,
    p_question_count INTEGER,
    p_subject_names TEXT[] DEFAULT NULL,
    p_difficulty_levels difficulty_level[] DEFAULT NULL,
    p_exclude_ids UUID[] DEFAULT NULL
)
RETURNS TABLE (
    question_id UUID,
    statement TEXT,
    image_url TEXT,
    alternatives JSONB,
    correct_answer TEXT,
    explanation TEXT,
    difficulty difficulty_level,
    subject_name TEXT,
    topic_name TEXT,
    institution_name TEXT,
    year INTEGER
) AS $$
DECLARE
    v_institution_id UUID;
    v_subject_ids UUID[];
BEGIN
    -- Get institution_id from name
    SELECT id INTO v_institution_id
    FROM public.institutions
    WHERE name = p_university_name;

    -- Get subject_ids from names if provided
    IF p_subject_names IS NOT NULL AND array_length(p_subject_names, 1) > 0 THEN
        SELECT array_agg(id) INTO v_subject_ids
        FROM public.subjects
        WHERE name = ANY(p_subject_names);
    END IF;

    RETURN QUERY
    SELECT
        q.id,
        q.statement,
        q.image_url,
        q.alternatives,
        q.correct_answer,
        q.explanation,
        q.difficulty,
        s.name,
        t.name,
        i.name,
        q.year
    FROM public.questions q
    JOIN public.subjects s ON q.subject_id = s.id
    LEFT JOIN public.topics t ON q.topic_id = t.id
    JOIN public.institutions i ON q.institution_id = i.id
    WHERE
        (v_institution_id IS NULL OR q.institution_id = v_institution_id)
        AND (v_subject_ids IS NULL OR q.subject_id = ANY(v_subject_ids))
        AND (p_difficulty_levels IS NULL OR q.difficulty = ANY(p_difficulty_levels))
        AND (p_exclude_ids IS NULL OR NOT q.id = ANY(p_exclude_ids))
    ORDER BY
        RANDOM()
    LIMIT p_question_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
