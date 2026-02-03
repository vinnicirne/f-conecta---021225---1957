-- ============================================
-- CONFIGURAR STORAGE PARA POSTS COM MÍDIA
-- ============================================
-- Execute este SQL no Supabase Dashboard
-- SQL Editor > New Query > Cole e Execute
-- ============================================

-- 1. Criar bucket para mídias de posts (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts-media', 'posts-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Configurar políticas de acesso ao bucket

-- Permitir que usuários autenticados façam upload
CREATE POLICY "Usuários podem fazer upload de mídias"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts-media');

-- Permitir que todos vejam as mídias (bucket público)
CREATE POLICY "Qualquer um pode ver mídias"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts-media');

-- Permitir que usuários deletem suas próprias mídias
CREATE POLICY "Usuários podem deletar suas mídias"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts-media' AND owner = auth.uid());

-- 3. Verificar se foi criado corretamente
SELECT 
    'Bucket criado com sucesso!' AS status,
    id, 
    name, 
    public,
    created_at
FROM storage.buckets
WHERE id = 'posts-media';

-- 4. Verificar políticas
SELECT 
    'Políticas configuradas:' AS info,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%mídia%';
