-- ============================================
-- FéConecta - Complete Database Schema with Auth
-- Social Faith Platform
-- VERSÃO CORRIGIDA - Sem erros de duplicação
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- DROP EXISTING OBJECTS (para re-execução limpa)
-- ============================================

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS prayer_interactions CASCADE;
DROP TABLE IF EXISTS prayer_requests CASCADE;
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS bible_notes CASCADE;
DROP TABLE IF EXISTS devotional_interactions CASCADE;
DROP TABLE IF EXISTS devotionals CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS message_of_the_day CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS shares CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- PROFILES & USERS
-- ============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Profile stats
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Church/Community affiliation
    church_name VARCHAR(255),
    denomination VARCHAR(100),
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{"likes": true, "comments": true, "follows": true, "mentions": true}'::jsonb,
    privacy_settings JSONB DEFAULT '{"showEmail": false, "showLocation": false}'::jsonb
);

-- ============================================
-- SOCIAL FEED & POSTS
-- ============================================

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_type VARCHAR(20) DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'video', 'audio', 'gallery')),
    media_urls TEXT[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    hashtags TEXT[],
    mentions UUID[],
    is_pinned BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_hashtags ON posts USING GIN(hashtags);

CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- ============================================
-- FOLLOWS & RELATIONSHIPS
-- ============================================

CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- ============================================
-- DEVOTIONALS
-- ============================================

CREATE TABLE devotionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    scripture_reference VARCHAR(255),
    author VARCHAR(255),
    category VARCHAR(100),
    image_url TEXT,
    publish_date DATE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE devotional_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    devotional_id UUID NOT NULL REFERENCES devotionals(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    is_liked BOOLEAN DEFAULT FALSE,
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, devotional_id)
);

-- ============================================
-- BIBLE NOTES & HIGHLIGHTS
-- ============================================

CREATE TABLE bible_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    book VARCHAR(50) NOT NULL,
    chapter INTEGER NOT NULL,
    verse_start INTEGER NOT NULL,
    verse_end INTEGER,
    note_text TEXT,
    highlight_color VARCHAR(20),
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMMUNITIES & GROUPS
-- ============================================

CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    type VARCHAR(50) DEFAULT 'church' CHECK (type IN ('church', 'group', 'ministry', 'study')),
    is_private BOOLEAN DEFAULT FALSE,
    requires_approval BOOLEAN DEFAULT TRUE,
    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    location VARCHAR(255),
    denomination VARCHAR(100),
    website VARCHAR(255),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(community_id, user_id)
);

-- ============================================
-- EVENTS
-- ============================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    location_type VARCHAR(20) DEFAULT 'physical' CHECK (location_type IN ('physical', 'online', 'hybrid')),
    location_address VARCHAR(500),
    location_url TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    max_attendees INTEGER,
    requires_rsvp BOOLEAN DEFAULT TRUE,
    attendees_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- ============================================
-- PRAYER REQUESTS
-- ============================================

CREATE TABLE prayer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    is_anonymous BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'community', 'private')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'answered', 'closed')),
    answered_at TIMESTAMP WITH TIME ZONE,
    testimony TEXT,
    prayers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE prayer_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prayer_request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    prayed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prayer_request_id, user_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('like', 'comment', 'share', 'follow', 'mention', 'event', 'prayer', 'community')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    action_url TEXT,
    image_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- MESSAGE OF THE DAY
-- ============================================

CREATE TABLE message_of_the_day (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    scripture_reference VARCHAR(255),
    image_url TEXT,
    display_date DATE NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AUTHENTICATION TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://ui-avatars.com/api/?name=' || COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotional_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_of_the_day ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Public posts viewable" ON posts FOR SELECT USING (
    visibility = 'public' OR user_id = auth.uid() OR 
    (visibility = 'followers' AND EXISTS (SELECT 1 FROM follows WHERE following_id = posts.user_id AND follower_id = auth.uid()))
);
CREATE POLICY "Users create own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes viewable" ON likes FOR SELECT USING (true);
CREATE POLICY "Users create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments viewable" ON comments FOR SELECT USING (true);
CREATE POLICY "Users create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows viewable" ON follows FOR SELECT USING (true);
CREATE POLICY "Users follow others" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users unfollow" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Devotionals policies
CREATE POLICY "Published devotionals viewable" ON devotionals FOR SELECT USING (is_published = true);
CREATE POLICY "Users view own interactions" ON devotional_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create interactions" ON devotional_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update interactions" ON devotional_interactions FOR UPDATE USING (auth.uid() = user_id);

-- Bible notes policies
CREATE POLICY "Users view notes" ON bible_notes FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users create notes" ON bible_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update notes" ON bible_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete notes" ON bible_notes FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System creates notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Message of the day policies
CREATE POLICY "Active messages viewable" ON message_of_the_day FOR SELECT USING (is_active = true);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- REALTIME CONFIGURATION
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE likes;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE follows;

-- ============================================
-- SAMPLE DATA
-- ============================================

INSERT INTO message_of_the_day (title, message, scripture_reference, display_date, is_active)
VALUES 
  ('Fé que Move Montanhas', 'Se tiverdes fé como um grão de mostarda, direis a este monte: Passa daqui para acolá, e ele passará. Nada vos será impossível.', 'Mateus 17:20', CURRENT_DATE, true),
  ('O Amor de Deus', 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', 'João 3:16', CURRENT_DATE + INTERVAL '1 day', true)
ON CONFLICT (display_date) DO NOTHING;

INSERT INTO devotionals (title, content, scripture_reference, author, category, publish_date, is_published)
VALUES 
  ('A Fé que Move Montanhas', 'Hoje vamos refletir sobre o poder da fé em nossas vidas. A fé não é apenas acreditar, mas confiar plenamente em Deus mesmo quando não vemos o caminho...', 'Mateus 17:20', 'Pastor João', 'Fé', CURRENT_DATE, true),
  ('O Amor que Transforma', 'O amor de Deus é transformador e nos capacita a amar uns aos outros. Quando permitimos que esse amor flua através de nós, nos tornamos instrumentos de paz...', '1 João 4:19', 'Pastora Maria', 'Amor', CURRENT_DATE, true)
ON CONFLICT DO NOTHING;
