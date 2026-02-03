-- ============================================
-- SISTEMA DE FEED DE NOTÍCIAS
-- ============================================
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- 1. Criar tabela de seguidores (follows)
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_user ON likes(post_id, user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);

-- 3. Habilitar RLS na tabela follows
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS para follows

-- Usuários podem ver quem eles seguem e quem os segue
CREATE POLICY "Usuários podem ver relacionamentos de follows"
ON follows FOR SELECT
TO authenticated
USING (follower_id = auth.uid() OR following_id = auth.uid());

-- Usuários podem seguir outros
CREATE POLICY "Usuários podem seguir outros"
ON follows FOR INSERT
TO authenticated
WITH CHECK (follower_id = auth.uid());

-- Usuários podem deixar de seguir
CREATE POLICY "Usuários podem deixar de seguir"
ON follows FOR DELETE
TO authenticated
USING (follower_id = auth.uid());

-- 5. Atualizar contadores em profiles quando seguir/deixar de seguir
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrementar following_count do seguidor
    UPDATE profiles 
    SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
    
    -- Incrementar followers_count do seguido
    UPDATE profiles 
    SET followers_count = followers_count + 1 
    WHERE id = NEW.following_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrementar following_count do seguidor
    UPDATE profiles 
    SET following_count = GREATEST(0, following_count - 1)
    WHERE id = OLD.follower_id;
    
    -- Decrementar followers_count do seguido
    UPDATE profiles 
    SET followers_count = GREATEST(0, followers_count - 1)
    WHERE id = OLD.following_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS update_follow_counts_trigger ON follows;
CREATE TRIGGER update_follow_counts_trigger
AFTER INSERT OR DELETE ON follows
FOR EACH ROW
EXECUTE FUNCTION update_follow_counts();

-- 6. Verificar criação
SELECT 
  'Tabela follows criada com sucesso!' AS status,
  COUNT(*) AS total_follows
FROM follows;

SELECT 
  'Índices criados:' AS info,
  indexname
FROM pg_indexes
WHERE tablename = 'follows';
