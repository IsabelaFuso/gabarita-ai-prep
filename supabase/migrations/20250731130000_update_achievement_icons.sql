-- Make achievement icons more creative and inspiring
UPDATE public.achievements
SET icon_name = 'Award'
WHERE code = 'FIRST_SIMULADO';

UPDATE public.achievements
SET icon_name = 'Flame'
WHERE code = 'STREAK_3';

UPDATE public.achievements
SET icon_name = 'Crown'
WHERE code = 'STREAK_7';

-- No change for ACCURACY_90, 'Target' is already a great icon.

UPDATE public.achievements
SET icon_name = 'ShieldCheck'
WHERE code = 'QUESTIONS_100';

UPDATE public.achievements
SET icon_name = 'Trophy'
WHERE code = 'QUESTIONS_500';

COMMENT ON TABLE public.achievements IS 'Updated icon names on 2025-07-31 to be more creative and aligned with the user experience.';
