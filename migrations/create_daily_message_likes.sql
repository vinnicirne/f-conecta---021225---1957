-- Tabela para curtidas reais na Mensagem do Dia
CREATE TABLE IF NOT EXISTS public.daily_message_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, message_date)
);

-- RLS para curtidas da mensagem
ALTER TABLE public.daily_message_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode ver as curtidas"
    ON public.daily_message_likes FOR SELECT
    USING (true);

CREATE POLICY "Usuários autenticados podem curtir"
    ON public.daily_message_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem descurtir suas próprias curtidas"
    ON public.daily_message_likes FOR DELETE
    USING (auth.uid() = user_id);

-- Ativar Realtime para esta tabela
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'daily_message_likes'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE daily_message_likes;
    END IF;
END $$;
