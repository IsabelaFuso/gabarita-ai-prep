-- Adiciona RLS (Row Level Security) à tabela 'simulados'
ALTER TABLE public.simulados ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas, se existirem, para evitar conflitos
DROP POLICY IF EXISTS "Authenticated users can view their own simulados" ON public.simulados;

-- Cria a nova política de SELECT
CREATE POLICY "Authenticated users can view their own simulados"
ON public.simulados
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
