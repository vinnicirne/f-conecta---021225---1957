import { supabase } from './lib/supabase';

/**
 * Run this script once to create the user_notes table
 * Execute: npx ts-node scripts/createUserNotesTable.ts
 */
async function createUserNotesTable() {
    console.log('Creating user_notes table...');

    const { error } = await supabase.rpc('exec_sql', {
        sql: `
      -- Create user_notes table
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

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_notes_created_at ON user_notes(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_user_notes_category ON user_notes(category);

      -- Enable RLS
      ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if any
      DROP POLICY IF EXISTS "Users can view their own notes" ON user_notes;
      DROP POLICY IF EXISTS "Users can insert their own notes" ON user_notes;
      DROP POLICY IF EXISTS "Users can update their own notes" ON user_notes;
      DROP POLICY IF EXISTS "Users can delete their own notes" ON user_notes;

      -- Create RLS policies
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
    `
    });

    if (error) {
        console.error('Error creating table:', error);
        return;
    }

    console.log('✅ user_notes table created successfully!');
}

createUserNotesTable();
