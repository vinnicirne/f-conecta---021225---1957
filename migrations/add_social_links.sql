-- ============================================
-- ADICIONAR LINKS DE REDES SOCIAIS
-- ============================================
-- Execute no Supabase Dashboard > SQL Editor

-- Adicionar campo social_links à tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Comentário explicativo
COMMENT ON COLUMN profiles.social_links IS 'Links de redes sociais: whatsapp, instagram, facebook, twitter, youtube';

-- Verificar se foi adicionado
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'social_links';
