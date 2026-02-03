-- ============================================
-- TRIGGERS PARA CONTADORES DE LIKES E COMENTÁRIOS
-- ============================================
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- 1. FUNÇÃO: Incrementar contador de likes
CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. FUNÇÃO: Decrementar contador de likes
CREATE OR REPLACE FUNCTION decrement_post_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 3. FUNÇÃO: Incrementar contador de comentários
CREATE OR REPLACE FUNCTION increment_post_comments()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. FUNÇÃO: Decrementar contador de comentários
CREATE OR REPLACE FUNCTION decrement_post_comments()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CRIAR TRIGGERS
-- ============================================

-- Trigger: Incrementar likes ao adicionar
DROP TRIGGER IF EXISTS increment_likes_trigger ON likes;
CREATE TRIGGER increment_likes_trigger
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION increment_post_likes();

-- Trigger: Decrementar likes ao remover
DROP TRIGGER IF EXISTS decrement_likes_trigger ON likes;
CREATE TRIGGER decrement_likes_trigger
AFTER DELETE ON likes
FOR EACH ROW
EXECUTE FUNCTION decrement_post_likes();

-- Trigger: Incrementar comentários ao adicionar
DROP TRIGGER IF EXISTS increment_comments_trigger ON comments;
CREATE TRIGGER increment_comments_trigger
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION increment_post_comments();

-- Trigger: Decrementar comentários ao remover
DROP TRIGGER IF EXISTS decrement_comments_trigger ON comments;
CREATE TRIGGER decrement_comments_trigger
AFTER DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION decrement_post_comments();

-- ============================================
-- RECALCULAR CONTADORES EXISTENTES
-- ============================================

-- Atualizar likes_count para posts existentes
UPDATE posts p
SET likes_count = (
    SELECT COUNT(*)
    FROM likes l
    WHERE l.post_id = p.id
);

-- Atualizar comments_count para posts existentes
UPDATE posts p
SET comments_count = (
    SELECT COUNT(*)
    FROM comments c
    WHERE c.post_id = p.id
);

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

SELECT 
    p.id,
    p.content,
    p.likes_count,
    p.comments_count,
    (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as actual_likes,
    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as actual_comments
FROM posts p
ORDER BY p.created_at DESC
LIMIT 10;
