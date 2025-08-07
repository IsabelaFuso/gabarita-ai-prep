-- Atualizar sistema de gamificação e patentes expandido

-- Atualizar tabela de ranks para incluir patentes especiais
ALTER TABLE public.ranks 
ADD COLUMN IF NOT EXISTS rank_type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS special_trigger_condition TEXT,
ADD COLUMN IF NOT EXISTS icon_url TEXT,
ADD COLUMN IF NOT EXISTS background_color TEXT,
ADD COLUMN IF NOT EXISTS text_color TEXT;

-- Limpar dados existentes e inserir nova estrutura de patentes
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

-- Inserir patentes especiais/humorísticas
INSERT INTO public.ranks (name, xp_threshold, rank_type, special_trigger_condition, icon_url, background_color, text_color) VALUES
('Ai Pai Para!', 0, 'special_humorous', 'OVERCOME_WEAKNESS', '/images/patentes/ai_pai_para.png', '#f97316', '#ffffff'),
('Toma Jack, Toma!', 0, 'special_humorous', 'STREAK_CHAMPION', '/images/patentes/toma_jack.png', '#10b981', '#ffffff'),
('Mestre do Ctrl+C, Ctrl+V (da Sabedoria)', 0, 'special_humorous', 'AI_TUTOR_MASTER', '/images/patentes/mestre_ctrlc.png', '#6366f1', '#ffffff'),
('O Brabo(a) Tem Nome', 0, 'special_humorous', 'TOP_1_PERCENT', '/images/patentes/brabo_tem_nome.png', '#fbbf24', '#000000'),
('Rainha/Rei da Redação', 0, 'special_humorous', 'ESSAY_MASTER', '/images/patentes/rei_redacao.png', '#ec4899', '#ffffff'),
('O Cara da Matemática', 0, 'special_humorous', 'MATH_GENIUS', '/images/patentes/cara_matematica.png', '#3b82f6', '#ffffff'),
('Historiador Épico', 0, 'special_humorous', 'HISTORY_MASTER', '/images/patentes/historiador_epico.png', '#92400e', '#ffffff'),
('Cientista Prodígio', 0, 'special_humorous', 'SCIENCE_PRODIGY', '/images/patentes/cientista_prodigio.png', '#059669', '#ffffff'),
('Filósofo Iluminado', 0, 'special_humorous', 'PHILOSOPHY_SAGE', '/images/patentes/filosofo_iluminado.png', '#7c2d12', '#ffffff'),
('Poliglota do Saber', 0, 'special_humorous', 'LANGUAGE_MASTER', '/images/patentes/poliglota_saber.png', '#be185d', '#ffffff');

-- Atualizar user_profiles para incluir personalização
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS chosen_rank_id INTEGER,
ADD COLUMN IF NOT EXISTS special_ranks_unlocked INTEGER[] DEFAULT '{}';

-- Atualizar conquistas com nova estrutura de trilha
DELETE FROM public.achievements;

-- Inserir conquistas da trilha (Fase 1: Início da Jornada)
INSERT INTO public.achievements (code, name, description, icon_name) VALUES
('PRIMEIROS_PASSOS', 'Primeiros Passos', 'Complete seu perfil e configure seu curso alvo', 'Footprints'),
('EXPLORADOR_PLATAFORMA', 'Explorador da Plataforma', 'Visite todas as seções principais do app', 'Map'),
('PRIMEIRA_VITORIA', 'Primeira Vitória', 'Resolva 10 questões com 70%+ de acerto', 'Trophy'),
('REDATOR_INICIANTE', 'Redator Iniciante', 'Submeta sua primeira redação', 'PenTool');

-- Fase 2: Construindo a Base
INSERT INTO public.achievements (code, name, description, icon_name) VALUES
('RITMO_CONSTANTE', 'Ritmo Constante', 'Estude por 3 dias consecutivos', 'Zap'),
('DESAFIO_SUPERADO', 'Desafio Superado', 'Complete seu primeiro simulado completo', 'Shield'),
('MESTRE_FUNDAMENTOS', 'Mestre dos Fundamentos', 'Atinja 70%+ em 3 matérias básicas', 'BookOpen'),
('ORGANIZADOR_NATO', 'Organizador Nato', 'Cumpra suas metas de estudo por 5 dias', 'Calendar');

-- Fase 3: Aprofundamento e Estratégia
INSERT INTO public.achievements (code, name, description, icon_name) VALUES
('ESPECIALISTA_MATERIA', 'Especialista em Matéria', 'Atinja 85%+ de acerto em 100 questões de uma matéria', 'GraduationCap'),
('GABARITO_PARCIAL', 'Gabarito Parcial', 'Atinja 90%+ em um simulado rápido', 'Target'),
('SUPERACAO_DIFICULDADES', 'Superação de Dificuldades', 'Melhore 20% em uma matéria difícil', 'TrendingUp'),
('ESCRITOR_PERSPICAZ', 'Escritor(a) Perspicaz', 'Tenha 3 redações consecutivas com 850+ pontos', 'Feather');

-- Fase 4: Reta Final e Simulação
INSERT INTO public.achievements (code, name, description, icon_name) VALUES
('MARATONISTA_ESTUDO', 'Maratonista do Estudo', 'Acumule 50 horas de estudo na plataforma', 'Clock'),
('SIMULADOR_PRO', 'Simulador Pro', 'Complete 5 simulados com média de 75%+', 'Award'),
('REVISOR_MESTRE', 'Revisor(a) Mestre', 'Revise 200 questões e melhore 15% nelas', 'RefreshCw'),
('PRONTO_BATALHA', 'Pronto para a Batalha', 'Atinja 80% geral com 1000+ questões por matéria', 'Swords');

-- Fase 5: Conquista Final
INSERT INTO public.achievements (code, name, description, icon_name) VALUES
('APROVADO', 'Aprovado(a)!', 'Conquiste sua aprovação no vestibular!', 'Crown');

-- Função para determinar patente baseada em XP
CREATE OR REPLACE FUNCTION public.get_rank_for_xp(p_xp integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    v_rank_id INTEGER;
BEGIN
    SELECT id INTO v_rank_id
    FROM public.ranks
    WHERE p_xp >= xp_threshold 
    AND rank_type = 'general'
    ORDER BY xp_threshold DESC
    LIMIT 1;
    RETURN v_rank_id;
END;
$$;