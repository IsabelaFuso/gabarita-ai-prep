-- Atualizar sistema de gamificação e patentes expandido

-- Primeiro, criar novos tipos para patentes especiais
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'special_rank_type') THEN
        CREATE TYPE special_rank_type AS ENUM (
          'general',
          'special_humorous'
        );
    END IF;
END$$;

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
ADD COLUMN display_name TEXT,
ADD COLUMN chosen_rank_id INTEGER REFERENCES public.ranks(id),
ADD COLUMN special_ranks_unlocked INTEGER[] DEFAULT '{}';

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

-- Função para verificar e conceder patentes especiais
CREATE OR REPLACE FUNCTION public.check_and_grant_special_ranks(p_user_id uuid)
RETURNS TABLE(rank_id integer, rank_name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_profile RECORD;
    v_total_questions_answered INTEGER;
    v_math_questions_answered INTEGER;
    v_math_accuracy REAL;
    v_essay_high_scores INTEGER;
    v_weakness_improvement REAL;
    v_special_ranks_unlocked INTEGER[];
    v_newly_unlocked INTEGER[] := ARRAY[]::INTEGER[];
BEGIN
    -- Get user's current stats and special ranks
    SELECT * INTO v_user_profile FROM public.user_profiles WHERE user_id = p_user_id;
    v_special_ranks_unlocked := COALESCE(v_user_profile.special_ranks_unlocked, ARRAY[]::INTEGER[]);
    
    -- Get statistics
    SELECT COUNT(*) INTO v_total_questions_answered FROM public.user_attempts WHERE user_id = p_user_id;
    
    -- Check for math mastery
    SELECT COUNT(*), AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) 
    INTO v_math_questions_answered, v_math_accuracy
    FROM public.user_attempts ua
    JOIN public.questions q ON ua.question_id = q.id
    JOIN public.subjects s ON q.subject_id = s.id
    WHERE ua.user_id = p_user_id AND s.name = 'Matemática';
    
    -- Check math genius (O Cara da Matemática)
    IF v_math_questions_answered >= 1000 AND v_math_accuracy >= 0.85 THEN
        IF NOT (SELECT id FROM public.ranks WHERE name = 'O Cara da Matemática') = ANY(v_special_ranks_unlocked) THEN
            v_newly_unlocked := array_append(v_newly_unlocked, (SELECT id FROM public.ranks WHERE name = 'O Cara da Matemática'));
        END IF;
    END IF;
    
    -- Check streak champion (Toma Jack, Toma!)
    IF v_user_profile.current_streak >= 7 THEN
        IF NOT (SELECT id FROM public.ranks WHERE name = 'Toma Jack, Toma!') = ANY(v_special_ranks_unlocked) THEN
            v_newly_unlocked := array_append(v_newly_unlocked, (SELECT id FROM public.ranks WHERE name = 'Toma Jack, Toma!'));
        END IF;
    END IF;
    
    -- Update special ranks if any new ones were unlocked
    IF array_length(v_newly_unlocked, 1) > 0 THEN
        UPDATE public.user_profiles 
        SET special_ranks_unlocked = v_special_ranks_unlocked || v_newly_unlocked
        WHERE user_id = p_user_id;
    END IF;
    
    -- Return newly unlocked special ranks
    RETURN QUERY
    SELECT r.id, r.name
    FROM public.ranks r
    WHERE r.id = ANY(v_newly_unlocked);
END;
$$;

-- Função atualizada para buscar ranking com patentes escolhidas
DROP FUNCTION IF EXISTS public.get_ranking();
CREATE OR REPLACE FUNCTION public.get_ranking()
RETURNS TABLE(user_id uuid, full_name text, avatar_url text, xp integer, rank_name text, target_institution text, target_course text, latest_achievement_name text, latest_achievement_icon text, chosen_rank_name text, chosen_rank_icon text)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH latest_achievements AS (
      SELECT
        la.user_id,
        la.achievement_code,
        la.unlocked_at,
        ROW_NUMBER() OVER(PARTITION BY la.user_id ORDER BY la.unlocked_at DESC) as rn
      FROM public.user_achievements la
    )
    SELECT
        up.user_id,
        COALESCE(up.display_name, up.full_name) as full_name,
        up.avatar_url,
        up.xp,
        r.name AS rank_name,
        i.name AS target_institution,
        up.first_choice_course AS target_course,
        a.name as latest_achievement_name,
        a.icon_name as latest_achievement_icon,
        cr.name as chosen_rank_name,
        cr.icon_url as chosen_rank_icon
    FROM
        public.user_profiles up
    LEFT JOIN
        public.ranks r ON up.current_rank_id = r.id
    LEFT JOIN
        public.ranks cr ON up.chosen_rank_id = cr.id
    LEFT JOIN
        public.institutions i ON up.target_institution_id = i.id
    LEFT JOIN
        latest_achievements la ON up.user_id = la.user_id AND la.rn = 1
    LEFT JOIN
        public.achievements a ON la.achievement_code = a.code
    WHERE
        up.full_name IS NOT NULL
    ORDER BY
        up.xp DESC
    LIMIT 50;
END;
$$;