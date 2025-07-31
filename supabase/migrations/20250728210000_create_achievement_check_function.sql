-- This function checks all achievement conditions for a user and grants new ones.
-- It's designed to be called after an activity, like finishing a simulado.
CREATE OR REPLACE FUNCTION public.check_and_grant_achievements(
    p_user_id UUID,
    p_simulado_accuracy REAL DEFAULT 0, -- Accuracy of the last simulado (e.g., 0.95 for 95%)
    p_simulado_question_count INTEGER DEFAULT 0 -- Question count of the last simulado
)
RETURNS TABLE (
    code TEXT,
    name TEXT,
    description TEXT,
    icon_name TEXT
) AS $$
DECLARE
    v_user_profile RECORD;
    v_total_questions_answered INTEGER;
    v_total_simulados_completed INTEGER;
    v_previously_unlocked TEXT[];
    v_newly_unlocked TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Get user's current stats
    SELECT * INTO v_user_profile FROM public.user_profiles WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO v_total_questions_answered FROM public.user_attempts WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO v_total_simulados_completed FROM public.simulados WHERE user_id = p_user_id AND status = 'finalizado';

    -- Get achievements the user already has to avoid re-checking
    SELECT array_agg(achievement_code) INTO v_previously_unlocked FROM public.user_achievements WHERE user_id = p_user_id;
    IF v_previously_unlocked IS NULL THEN
        v_previously_unlocked := ARRAY[]::TEXT[];
    END IF;

    -- --- Achievement Checks ---

    -- Check for 'FIRST_SIMULADO'
    IF v_total_simulados_completed = 1 AND NOT ('FIRST_SIMULADO' = ANY(v_previously_unlocked)) THEN
        v_newly_unlocked := array_append(v_newly_unlocked, 'FIRST_SIMULADO');
    END IF;

    -- Check for 'STREAK_3'
    IF v_user_profile.current_streak >= 3 AND NOT ('STREAK_3' = ANY(v_previously_unlocked)) THEN
        v_newly_unlocked := array_append(v_newly_unlocked, 'STREAK_3');
    END IF;

    -- Check for 'STREAK_7'
    IF v_user_profile.current_streak >= 7 AND NOT ('STREAK_7' = ANY(v_previously_unlocked)) THEN
        v_newly_unlocked := array_append(v_newly_unlocked, 'STREAK_7');
    END IF;

    -- Check for 'ACCURACY_90'
    IF p_simulado_accuracy >= 0.9 AND p_simulado_question_count >= 30 AND NOT ('ACCURACY_90' = ANY(v_previously_unlocked)) THEN
        v_newly_unlocked := array_append(v_newly_unlocked, 'ACCURACY_90');
    END IF;

    -- Check for 'QUESTIONS_100'
    IF v_total_questions_answered >= 100 AND NOT ('QUESTIONS_100' = ANY(v_previously_unlocked)) THEN
        v_newly_unlocked := array_append(v_newly_unlocked, 'QUESTIONS_100');
    END IF;

    -- Check for 'QUESTIONS_500'
    IF v_total_questions_answered >= 500 AND NOT ('QUESTIONS_500' = ANY(v_previously_unlocked)) THEN
        v_newly_unlocked := array_append(v_newly_unlocked, 'QUESTIONS_500');
    END IF;

    -- --- End of Checks ---

    -- Insert the newly unlocked achievements in a single query
    IF array_length(v_newly_unlocked, 1) > 0 THEN
        INSERT INTO public.user_achievements (user_id, achievement_code)
        SELECT p_user_id, unnest(v_newly_unlocked);
    END IF;

    -- Return the details of the newly unlocked achievements
    RETURN QUERY
    SELECT
        a.code,
        a.name,
        a.description,
        a.icon_name
    FROM public.achievements a
    WHERE a.code = ANY(v_newly_unlocked);

END;
$$ LANGUAGE plpgsql;
