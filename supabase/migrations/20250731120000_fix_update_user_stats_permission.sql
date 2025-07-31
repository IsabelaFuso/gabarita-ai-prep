-- Alter the existing function to run with definer privileges
ALTER FUNCTION public.update_user_stats(UUID, INTEGER, INTEGER) SECURITY DEFINER;

-- Add a comment to explain why this is necessary
COMMENT ON FUNCTION public.update_user_stats(UUID, INTEGER, INTEGER) IS
'This function is set to SECURITY DEFINER so it can bypass Row Level Security (RLS) policies.
This is necessary because users need to be able to update their own stats (like XP and streak),
but the standard RLS policy might restrict direct updates to the user_profiles table.
By running as the definer (usually a superuser), the function has the required permissions
to modify the user''s profile data on their behalf after a simulado is completed.';
