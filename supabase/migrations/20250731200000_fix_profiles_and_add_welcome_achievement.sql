-- Migration to fix user profiles, add a welcome achievement, and fix the ranking function.

-- Step 1: Add full_name and avatar_url to user_profiles to store public user info.
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

COMMENT ON COLUMN public.user_profiles.full_name IS 'The user''s full name, copied from auth.users.';
COMMENT ON COLUMN public.user_profiles.avatar_url IS 'The user''s avatar URL, copied from auth.users.';


-- Step 2: Create a function to copy user metadata from auth.users to public.user_profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a profile for the new user
    INSERT INTO public.user_profiles (user_id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Grant the welcome achievement
    INSERT INTO public.user_achievements (user_id, achievement_code)
    VALUES (NEW.id, 'WELCOME');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create a trigger to call the function when a new user signs up.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Add the "Welcome" achievement to the achievements table.
INSERT INTO public.achievements (code, name, description, icon_name)
VALUES ('WELCOME', 'Bem-Vindo(a)!', 'Você iniciou sua jornada de estudos.', 'Sparkle')
ON CONFLICT (code) DO NOTHING;

-- Step 5: Recreate the get_ranking function to use the new local full_name column.
-- This fixes the "column up.full_name does not exist" error.
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
    WHERE
        up.full_name IS NOT NULL
    ORDER BY
        up.xp DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_ranking() TO authenticated;

COMMENT ON FUNCTION public.handle_new_user() IS 'Handles new user setup, creating a profile and granting a welcome achievement.';
-- COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'When a user is created, this trigger populates their profile and grants a welcome achievement.';
