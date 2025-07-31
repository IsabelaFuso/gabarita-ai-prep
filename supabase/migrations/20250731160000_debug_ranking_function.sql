-- This migration simplifies the get_ranking function for debugging purposes.
-- It removes the JOIN and several columns to isolate the cause of the HTTP 400 error.
DROP FUNCTION IF EXISTS public.get_ranking();

CREATE OR REPLACE FUNCTION public.get_ranking()
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    xp INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        up.user_id,
        up.full_name,
        up.xp
    FROM
        public.user_profiles up
    ORDER BY
        up.xp DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_ranking() IS 'Simplified version for debugging (2025-07-31). Returns top 10 users with basic info.';

-- Re-grant permissions
GRANT EXECUTE ON FUNCTION public.get_ranking() TO authenticated;
