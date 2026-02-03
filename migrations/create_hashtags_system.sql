-- ============================================
-- SISTEMA DE HASHTAGS E BUSCA
-- ============================================
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- 1. Criar tabela de hashtags
CREATE TABLE IF NOT EXISTS hashtags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL, -- sem o #, tudo minúsculo
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de relacionamento post-hashtag
CREATE TABLE IF NOT EXISTS post_hashtags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  hashtag_id UUID NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, hashtag_id)
);

-- 3. Criar índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_hashtags_name ON hashtags(name);
CREATE INDEX IF NOT EXISTS idx_hashtags_post_count ON hashtags(post_count DESC);
CREATE INDEX IF NOT EXISTS idx_post_hashtags_post ON post_hashtags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_hashtags_hashtag ON post_hashtags(hashtag_id);

-- Índices para busca de usuários (se não existirem)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_full_name_lower ON profiles(LOWER(full_name));

-- 4. Habilitar RLS
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_hashtags ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS (hashtags são públicas)
CREATE POLICY "Hashtags são públicas para leitura"
ON hashtags FOR SELECT
TO public
USING (true);

CREATE POLICY "Post hashtags são públicas para leitura"
ON post_hashtags FOR SELECT
TO public
USING (true);

-- 6. Função para extrair e salvar hashtags automaticamente
CREATE OR REPLACE FUNCTION extract_and_save_hashtags()
RETURNS TRIGGER AS $$
DECLARE
  hashtag_match TEXT;
  hashtag_name TEXT;
  hashtag_record RECORD;
BEGIN
  -- Deletar hashtags antigas do post (se for UPDATE)
  IF TG_OP = 'UPDATE' THEN
    DELETE FROM post_hashtags WHERE post_id = NEW.id;
  END IF;
  
  -- Extrair hashtags do conteúdo usando regex
  FOR hashtag_match IN 
    SELECT DISTINCT regexp_matches[1]
    FROM regexp_matches(NEW.content, '#(\w+)', 'g') AS regexp_matches
  LOOP
    -- Converter para minúsculo
    hashtag_name := LOWER(hashtag_match);
    
    -- Inserir ou atualizar hashtag
    INSERT INTO hashtags (name, post_count)
    VALUES (hashtag_name, 1)
    ON CONFLICT (name) DO UPDATE
    SET 
      post_count = hashtags.post_count + 1,
      updated_at = NOW()
    RETURNING * INTO hashtag_record;
    
    -- Associar hashtag ao post
    INSERT INTO post_hashtags (post_id, hashtag_id)
    VALUES (NEW.id, hashtag_record.id)
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para extrair hashtags automaticamente
DROP TRIGGER IF EXISTS extract_hashtags_trigger ON posts;
CREATE TRIGGER extract_hashtags_trigger
AFTER INSERT OR UPDATE OF content ON posts
FOR EACH ROW
EXECUTE FUNCTION extract_and_save_hashtags();

-- 8. Função para decrementar contador ao deletar post
CREATE OR REPLACE FUNCTION decrement_hashtag_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hashtags
  SET post_count = GREATEST(0, post_count - 1)
  WHERE id = OLD.hashtag_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger para decrementar contador
DROP TRIGGER IF EXISTS decrement_hashtag_count_trigger ON post_hashtags;
CREATE TRIGGER decrement_hashtag_count_trigger
AFTER DELETE ON post_hashtags
FOR EACH ROW
EXECUTE FUNCTION decrement_hashtag_count();

-- 10. Verificar criação
SELECT 
  'Sistema de hashtags criado com sucesso!' AS status,
  COUNT(*) AS total_hashtags
FROM hashtags;

SELECT 
  'Índices criados:' AS info,
  indexname
FROM pg_indexes
WHERE tablename IN ('hashtags', 'post_hashtags', 'profiles')
ORDER BY tablename, indexname;
