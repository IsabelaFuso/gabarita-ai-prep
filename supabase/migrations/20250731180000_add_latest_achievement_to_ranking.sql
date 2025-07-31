-- This migration updates the get_ranking function to include the user's latest achievement.
DROP FUNCTION IF EXISTS public.get_ranking();

CREATE OR REPLACE FUNCTION public.get_ranking()
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    xp INTEGER,
    level TEXT,
    target_institution TEXT,
    target_course TEXT,
    latest_achievement_name TEXT,
    latest_achievement_icon TEXT
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
        up.first_choice_course AS target_course,
        la.name AS latest_achievement_name,
        la.icon_name AS latest_achievement_icon
    FROM
        public.user_profiles up
    LEFT JOIN
        public.institutions i ON up.target_institution_id = i.id
    LEFT JOIN LATERAL (
        SELECT
            ach.name,
            ach.icon_name
        FROM
            public.user_achievements ua
        JOIN
            public.achievements ach ON ua.achievement_code = ach.code
        WHERE
            ua.user_id = up.user_id
        ORDER BY
            ua.unlocked_at DESC
        LIMIT 1
    ) AS la ON true
    ORDER BY
        up.xp DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_ranking() IS 'Returns top 50 users with profile details and their latest unlocked achievement.';

GRANT EXECUTE ON FUNCTION public.get_ranking() TO authenticated;
