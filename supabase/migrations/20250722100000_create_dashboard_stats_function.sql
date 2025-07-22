-- supabase/migrations/YYYYMMDDHHMMSS_create_dashboard_stats_function.sql

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_user_id UUID)
RETURNS TABLE (
    questions_today BIGINT,
    overall_accuracy FLOAT,
    study_time_minutes BIGINT,
    total_score BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH user_data AS (
        SELECT
            is_correct,
            created_at
        FROM
            public.user_attempts
        WHERE
            user_id = p_user_id
    )
    SELECT
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS questions_today,
        (AVG(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100) AS overall_accuracy,
        -- This is an approximation: 2 minutes per question attempted.
        (COUNT(*) * 2) AS study_time_minutes,
        -- This is a simple score: 10 points per correct answer.
        (COUNT(*) FILTER (WHERE is_correct) * 10) AS total_score
    FROM
        user_data;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats(UUID) TO authenticated;
