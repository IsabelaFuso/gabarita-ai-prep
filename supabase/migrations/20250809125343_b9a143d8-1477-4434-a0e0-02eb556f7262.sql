-- Create essays table to store user essays
CREATE TABLE public.essays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  theme_title TEXT NOT NULL,
  theme_description TEXT NOT NULL,
  content TEXT NOT NULL,
  score INTEGER,
  criteria_scores JSONB,
  ai_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;

-- Create policies for essays
CREATE POLICY "Users can view their own essays" 
ON public.essays 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own essays" 
ON public.essays 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own essays" 
ON public.essays 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_essays_updated_at
BEFORE UPDATE ON public.essays
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update achievements table with proper achievement data
INSERT INTO public.achievements (code, name, description, icon_name) VALUES
('PRIMEIROS_PASSOS', 'Primeiros Passos', 'Bem-vindo à plataforma! Complete seu primeiro exercício', 'Footprints'),
('EXPLORADOR_PLATAFORMA', 'Explorador da Plataforma', 'Explore diferentes seções da plataforma', 'Eye'),
('PRIMEIRA_VITORIA', 'Primeira Vitória', 'Acerte sua primeira questão', 'Award'),
('REDATOR_INICIANTE', 'Redator Iniciante', 'Escreva sua primeira redação', 'BookUser'),
('RITMO_CONSTANTE', 'Ritmo Constante', 'Mantenha uma sequência de 3 dias estudando', 'Flame'),
('DESAFIO_SUPERADO', 'Desafio Superado', 'Complete seu primeiro simulado', 'Target'),
('MESTRE_FUNDAMENTOS', 'Mestre dos Fundamentos', 'Alcance 70% de acertos em uma matéria', 'BrainCircuit'),
('ORGANIZADOR_NATO', 'Organizador Nato', 'Configure seu perfil e meta de estudos', 'ShieldCheck'),
('ESPECIALISTA_MATERIA', 'Especialista da Matéria', 'Alcance 90% de acertos em um simulado', 'Trophy'),
('GABARITO_PARCIAL', 'Gabarito Parcial', 'Acerte 100 questões', 'Gem'),
('SUPERACAO_DIFICULDADES', 'Superação de Dificuldades', 'Complete 5 simulados', 'Crown'),
('ESCRITOR_PERSPICAZ', 'Escritor Perspicaz', 'Alcance nota 900+ em uma redação', 'BookUser'),
('MARATONISTA_ESTUDO', 'Maratonista de Estudo', 'Estude por 7 dias consecutivos', 'Zap'),
('SIMULADOR_PRO', 'Simulador Pro', 'Complete 10 simulados', 'Star'),
('REVISOR_MESTRE', 'Revisor Mestre', 'Revise 500 questões', 'Library'),
('PRONTO_BATALHA', 'Pronto para a Batalha', 'Alcance 5000 XP', 'Crown'),
('APROVADO', 'Aprovado!', 'Conquiste todas as outras medalhas', 'Trophy')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name;