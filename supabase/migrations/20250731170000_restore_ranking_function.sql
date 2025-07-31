-- This migration restores the full-featured get_ranking function after debugging.
-- It brings back the JOIN on the institutions table and all related profile information.
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

COMMENT ON FUNCTION public.get_ranking() IS 'Restores the full ranking query. Returns top 50 users with profile details.';

-- Re-grant permissions
GRANT EXECUTE ON FUNCTION public.get_ranking() TO authenticated;
