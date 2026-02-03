-- ============================================
-- EXECUTE ESTE SQL NO SUPABASE DASHBOARD
-- ============================================
-- 1. Vá para: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Clique em "SQL Editor" no menu lateral
-- 4. Cole todo este código
-- 5. Clique em "Run" ou pressione Ctrl+Enter
-- ============================================

-- Criar tabela de notas do usuário
CREATE TABLE IF NOT EXISTS user_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Geral',
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_created_at ON user_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notes_category ON user_notes(category);

-- Ativar Row Level Security
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view their own notes" ON user_notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON user_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON user_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON user_notes;

-- Criar políticas de segurança (RLS)
CREATE POLICY "Users can view their own notes"
    ON user_notes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
    ON user_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
    ON user_notes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
    ON user_notes FOR DELETE
    USING (auth.uid() = user_id);

-- Verificar se a tabela foi criada
SELECT 'user_notes table created successfully!' AS status;
