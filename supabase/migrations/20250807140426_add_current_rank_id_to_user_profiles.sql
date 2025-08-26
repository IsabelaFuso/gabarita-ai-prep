ALTER TABLE public.user_profiles
ADD COLUMN current_rank_id INTEGER REFERENCES public.ranks(id);