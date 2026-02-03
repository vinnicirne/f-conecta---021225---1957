-- ============================================
-- CORREÇÃO: POLÍTICAS RLS PARA HASHTAGS
-- ============================================
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- 1. Permitir que o sistema insira hashtags automaticamente
-- (o trigger precisa de permissão para inserir)

-- Dropar políticas antigas se existirem
DROP POLICY IF EXISTS "Hashtags são públicas para leitura" ON hashtags;
DROP POLICY IF EXISTS "Post hashtags são públicas para leitura" ON post_hashtags;
DROP POLICY IF EXISTS "Sistema pode inserir hashtags" ON hashtags;
DROP POLICY IF EXISTS "Sistema pode inserir post_hashtags" ON post_hashtags;

-- 2. Criar novas políticas corretas

-- Hashtags: leitura pública, inserção/atualização pelo sistema
CREATE POLICY "Qualquer um pode ler hashtags"
ON hashtags FOR SELECT
TO public
USING (true);

CREATE POLICY "Sistema pode gerenciar hashtags"
ON hashtags FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Post_hashtags: leitura pública, inserção/deleção pelo sistema
CREATE POLICY "Qualquer um pode ler post_hashtags"
ON post_hashtags FOR SELECT
TO public
USING (true);

CREATE POLICY "Sistema pode gerenciar post_hashtags"
ON post_hashtags FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Verificar políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('hashtags', 'post_hashtags')
ORDER BY tablename, policyname;
