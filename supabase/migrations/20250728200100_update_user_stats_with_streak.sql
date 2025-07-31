-- Drop the old function first
DROP FUNCTION IF EXISTS public.update_user_stats(uuid, integer, integer);

-- Recreate the function with streak logic
CREATE OR REPLACE FUNCTION public.update_user_stats(
    p_user_id UUID,
    p_time_increase INTEGER,
    p_xp_increase INTEGER
)
RETURNS void AS $$
DECLARE
    v_last_activity_date DATE;
    v_current_streak INTEGER;
    v_xp_bonus INTEGER := 0;
BEGIN
    -- Get current streak and last activity date
    SELECT last_activity_date, current_streak INTO v_last_activity_date, v_current_streak
    FROM public.user_profiles
    WHERE user_id = p_user_id;

    -- Check and update streak
    IF v_last_activity_date IS NULL OR v_last_activity_date < (CURRENT_DATE - INTERVAL '1 day') THEN
        -- If there was no activity yesterday or before, reset streak to 1
        v_current_streak := 1;
    ELSIF v_last_activity_date = (CURRENT_DATE - INTERVAL '1 day') THEN
        -- If the last activity was yesterday, increment streak
        v_current_streak := v_current_streak + 1;
    END IF; -- If activity was today, streak remains the same

    -- Add XP bonus for maintaining streaks
    IF v_current_streak = 3 THEN
        v_xp_bonus := 50; -- Bonus for 3-day streak
    ELSIF v_current_streak = 7 THEN
        v_xp_bonus := 100; -- Bonus for 7-day streak
    END IF;

    -- Update the user's profile
    UPDATE public.user_profiles
    SET
        total_study_time_seconds = total_study_time_seconds + p_time_increase,
        xp = xp + p_xp_increase + v_xp_bonus,
        current_streak = v_current_streak,
        last_activity_date = CURRENT_DATE
    WHERE
        user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
