-- Corrigir constraint única em xp_threshold para permitir patentes especiais

-- Primeiro, remover a constraint única
ALTER TABLE public.ranks DROP CONSTRAINT IF EXISTS ranks_xp_threshold_key;

-- Atualizar sistema de gamificação
UPDATE public.user_profiles SET chosen_rank_id = NULL WHERE chosen_rank_id IS NOT NULL;
UPDATE public.user_profiles SET current_rank_id = NULL WHERE current_rank_id IS NOT NULL;

-- Adicionar colunas para patentes especiais
ALTER TABLE public.ranks 
ADD COLUMN IF NOT EXISTS rank_type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS special_trigger_condition TEXT,
ADD COLUMN IF NOT EXISTS icon_url TEXT,
ADD COLUMN IF NOT EXISTS background_color TEXT,
ADD COLUMN IF NOT EXISTS text_color TEXT;

-- Limpar dados existentes
DELETE FROM public.ranks;

-- Inserir patentes gerais por XP
INSERT INTO public.ranks (name, xp_threshold, rank_type, icon_url, background_color, text_color) VALUES
('Novato Curioso', 0, 'general', '/images/patentes/novato_curioso.png', '#94a3b8', '#ffffff'),
('Aprendiz Dedicado', 51, 'general', '/images/patentes/aprendiz_dedicado.png', '#22c55e', '#ffffff'),
('Explorador do Saber', 201, 'general', '/images/patentes/explorador_saber.png', '#3b82f6', '#ffffff'),
('Desbravador de Questões', 501, 'general', '/images/patentes/desbravador_questoes.png', '#f59e0b', '#ffffff'),
('Estrategista de Provas', 1001, 'general', '/images/patentes/estrategista_provas.png', '#8b5cf6', '#ffffff'),
('Mestre do Conteúdo', 2001, 'general', '/images/patentes/mestre_conteudo.png', '#06b6d4', '#ffffff'),
('Guardião do Gabarito', 3501, 'general', '/images/patentes/guardiao_gabarito.png', '#ef4444', '#ffffff'),
('Oráculo do Vestibular', 5001, 'general', '/images/patentes/oraculo_vestibular.png', '#a855f7', '#ffffff'),
('Arquiteto da Aprovação', 7001, 'general', '/images/patentes/arquiteto_aprovacao.png', '#0ea5e9', '#ffffff'),
('Lenda do Gabarito', 9001, 'general', '/images/patentes/lenda_gabarito.png', '#dc2626', '#ffffff'),
('Conquistador do Sonho', 12001, 'general', '/images/patentes/conquistador_sonho.png', '#7c3aed', '#ffffff');

-- Atualizar user_profiles para personalização
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS chosen_rank_id INTEGER,
ADD COLUMN IF NOT EXISTS special_ranks_unlocked INTEGER[] DEFAULT '{}';

-- Resetar ranks para o inicial
UPDATE public.user_profiles SET current_rank_id = (SELECT id FROM public.ranks WHERE name = 'Novato Curioso' LIMIT 1);
UPDATE public.user_profiles SET chosen_rank_id = current_rank_id;