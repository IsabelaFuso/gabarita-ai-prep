-- This migration reverts the get_ranking function to a stable version without the latest achievement lookup.
-- This is to resolve the HTTP 400 error while the achievement logic is fixed.
DROP FUNCTION IF EXISTS public.get_ranking();

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

COMMENT ON FUNCTION public.get_ranking() IS 'Reverted to stable version on 2025-07-31. Does not include latest achievement.';

GRANT EXECUTE ON FUNCTION public.get_ranking() TO authenticated;
