-- supabase/migrations/YYYYMMDDHHMMSS_create_performance_summary_function.sql

CREATE OR REPLACE FUNCTION public.get_user_performance_summary(p_user_id UUID)
RETURNS TABLE (
    subject_id UUID,
    subject_name TEXT,
    topic_id UUID,
    topic_name TEXT,
    total_attempts BIGINT,
    correct_attempts BIGINT,
    accuracy FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id AS subject_id,
        s.name AS subject_name,
        t.id AS topic_id,
        t.name AS topic_name,
        COUNT(ua.id) AS total_attempts,
        COUNT(ua.id) FILTER (WHERE ua.is_correct = TRUE) AS correct_attempts,
        (COUNT(ua.id) FILTER (WHERE ua.is_correct = TRUE)::FLOAT / COUNT(ua.id)::FLOAT) AS accuracy
    FROM
        public.user_attempts ua
    JOIN
        public.questions q ON ua.question_id = q.id
    JOIN
        public.subjects s ON q.subject_id = s.id
    JOIN
        public.topics t ON q.topic_id = t.id
    WHERE
        ua.user_id = p_user_id
    GROUP BY
        s.id, s.name, t.id, t.name
    ORDER BY
        accuracy ASC, total_attempts DESC;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_performance_summary(UUID) TO authenticated;
