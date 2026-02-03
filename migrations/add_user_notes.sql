-- Script para executar via Supabase Dashboard
-- Vá em: https://supabase.com/dashboard/project/YOUR_PROJECT/editor
-- Cole este SQL e execute

-- Criar tabela de notas gerais do usuário
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

CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_created_at ON user_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notes_category ON user_notes(category);

-- RLS Policies for user_notes
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notes" ON user_notes;
CREATE POLICY "Users can view their own notes"
    ON user_notes FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notes" ON user_notes;
CREATE POLICY "Users can insert their own notes"
    ON user_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notes" ON user_notes;
CREATE POLICY "Users can update their own notes"
    ON user_notes FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notes" ON user_notes;
CREATE POLICY "Users can delete their own notes"
    ON user_notes FOR DELETE
    USING (auth.uid() = user_id);
