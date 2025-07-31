-- Step 1: Insert a wider range of achievements to enhance gamification.
INSERT INTO public.achievements (code, name, description, icon_name) VALUES
    -- XP Milestones
    ('XP_1000', 'Aprendiz Esforçado', 'Alcançou 1.000 XP!', 'BookUser'),
    ('XP_5000', 'Veterano dos Estudos', 'Alcançou 5.000 XP!', 'BrainCircuit'),
    ('XP_10000', 'Mestre do Vestibular', 'Alcançou 10.000 XP!', 'Gem'),

    -- Question Milestones
    ('QUESTIONS_250', 'Questionador', 'Respondeu 250 questões.', 'HelpCircle'),
    ('QUESTIONS_1000', 'Sábio', 'Respondeu 1.000 questões!', 'Library'),

    -- Accuracy Milestones
    ('ACCURACY_95', 'Olho de Lince', 'Alcançou 95% de acerto em um simulado com mais de 30 questões.', 'Eye'),

    -- Streak Milestones
    ('STREAK_14', 'Imparável', 'Manteve uma sequência de 14 dias de estudos!', 'Zap'),
    ('STREAK_30', 'Lendário', 'Manteve uma sequência de 30 dias de estudos!', 'Star')
ON CONFLICT (code) DO NOTHING;


-- Step 2: Update the function to check for the new achievements.
-- We need to pass the user's current XP to check for XP-based achievements.
CREATE OR REPLACE FUNCTION public.check_and_grant_achievements(
    p_user_id UUID,
    p_simulado_accuracy REAL DEFAULT 0,
    p_simulado_question_count INTEGER DEFAULT 0
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

    -- Get achievements the user already has
    SELECT array_agg(achievement_code) INTO v_previously_unlocked FROM public.user_achievements WHERE user_id = p_user_id;
    IF v_previously_unlocked IS NULL THEN
        v_previously_unlocked := ARRAY[]::TEXT[];
    END IF;

    -- --- Achievement Checks ---

    -- Simulado-based
    IF v_total_simulados_completed = 1 AND NOT ('FIRST_SIMULADO' = ANY(v_previously_unlocked)) THEN
        v_newly_unlocked := array_append(v_newly_unlocked, 'FIRST_SIMULADO');
    END IF;
    IF p_simulado_accuracy >= 0.9 AND p_simulado_question_count >= 30 AND NOT ('ACCURACY_90' = ANY(v_previously_unlocked)) THEN
        v_newly_unlocked := array_append(v_newly_unlocked, 'ACCURACY_90');
    END IF;
    IF p_simulado_accuracy >= 0.95 AND p_simulado_question_count >= 30 AND NOT ('ACCURACY_95' = ANY(v_previously_unlocked)) THEN
        v_newly_unlocked := array_append(v_newly_unlocked, 'ACCURACY_95');
    END IF;

    -- Streak-based
    IF v_user_profile.current_streak >= 3 AND NOT ('STREAK_3' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'STREAK_3'); END IF;
    IF v_user_profile.current_streak >= 7 AND NOT ('STREAK_7' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'STREAK_7'); END IF;
    IF v_user_profile.current_streak >= 14 AND NOT ('STREAK_14' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'STREAK_14'); END IF;
    IF v_user_profile.current_streak >= 30 AND NOT ('STREAK_30' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'STREAK_30'); END IF;

    -- Question-based
    IF v_total_questions_answered >= 100 AND NOT ('QUESTIONS_100' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'QUESTIONS_100'); END IF;
    IF v_total_questions_answered >= 250 AND NOT ('QUESTIONS_250' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'QUESTIONS_250'); END IF;
    IF v_total_questions_answered >= 500 AND NOT ('QUESTIONS_500' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'QUESTIONS_500'); END IF;
    IF v_total_questions_answered >= 1000 AND NOT ('QUESTIONS_1000' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'QUESTIONS_1000'); END IF;

    -- XP-based
    IF v_user_profile.xp >= 1000 AND NOT ('XP_1000' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'XP_1000'); END IF;
    IF v_user_profile.xp >= 5000 AND NOT ('XP_5000' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'XP_5000'); END IF;
    IF v_user_profile.xp >= 10000 AND NOT ('XP_10000' = ANY(v_previously_unlocked)) THEN v_newly_unlocked := array_append(v_newly_unlocked, 'XP_10000'); END IF;

    -- --- End of Checks ---

    IF array_length(v_newly_unlocked, 1) > 0 THEN
        INSERT INTO public.user_achievements (user_id, achievement_code)
        SELECT p_user_id, unnest(v_newly_unlocked);
    END IF;

    RETURN QUERY
    SELECT a.code, a.name, a.description, a.icon_name
    FROM public.achievements a
    WHERE a.code = ANY(v_newly_unlocked);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.check_and_grant_achievements(UUID, REAL, INTEGER) IS 'Checks all achievement conditions for a user and grants new ones. Expanded on 2025-07-31 to include more achievements.';
