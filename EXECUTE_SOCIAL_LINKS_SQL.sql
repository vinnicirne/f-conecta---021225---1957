-- ============================================
-- EXECUTE ESTE SQL NO SUPABASE DASHBOARD
-- ============================================
-- 1. Vá para: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Clique em "SQL Editor" no menu lateral
-- 4. Cole todo este código
-- 5. Clique em "Run" ou pressione Ctrl+Enter
-- ============================================

-- Adicionar campo social_links à tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Comentário explicativo
COMMENT ON COLUMN profiles.social_links IS 'Links de redes sociais: whatsapp, instagram, facebook, twitter, youtube';

-- Verificar se foi adicionado
SELECT 
    'Campo social_links adicionado com sucesso!' AS status,
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'social_links';
