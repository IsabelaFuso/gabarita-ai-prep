CREATE OR REPLACE FUNCTION public.update_user_stats(
    p_user_id UUID,
    p_time_increase INTEGER,
    p_score_increase INTEGER
)
RETURNS void AS $$
BEGIN
    UPDATE public.user_profiles
    SET
        total_study_time_seconds = total_study_time_seconds + p_time_increase,
        gamification_score = gamification_score + p_score_increase
    WHERE
        user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
