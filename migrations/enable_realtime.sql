-- Ativar Realtime para as tabelas principais
-- Isso permite ouvir INSERT, UPDATE e DELETE em tempo real

-- Primeiro, garante que a publicação existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

-- Adiciona as tabelas à publicação (uma de cada vez para evitar erros se já existirem)
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE likes;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- Nota: Certifique-se de que o Realtime está habilitado no Dashboard do Supabase:
-- Database -> Replication -> supabase_realtime -> Source -> Tables
