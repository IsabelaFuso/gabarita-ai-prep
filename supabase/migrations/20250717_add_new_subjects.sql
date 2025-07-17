INSERT INTO public.subjects (name, code, area) VALUES
('Língua Francesa', 'FRA', 'Linguagens'),
('Artes', 'ART', 'Linguagens'),
('Educação Física', 'EDF', 'Ciências Humanas')
ON CONFLICT (name) DO NOTHING;