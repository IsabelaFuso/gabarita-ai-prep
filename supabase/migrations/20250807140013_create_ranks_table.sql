CREATE TABLE public.ranks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    xp_threshold INTEGER NOT NULL,
    rank_type TEXT DEFAULT 'general',
    special_trigger_condition TEXT,
    icon_url TEXT,
    background_color TEXT,
    text_color TEXT
);