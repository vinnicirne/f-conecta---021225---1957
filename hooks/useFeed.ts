import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import toast from 'react-hot-toast';

interface UseFeedReturn {
    posts: Post[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refreshFeed: () => Promise<void>;
}

const POSTS_PER_PAGE = 10;

export const useFeed = (): UseFeedReturn => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Buscar posts do feed (TODOS os posts públicos)
    const fetchFeed = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            setLoading(true);

            // Obter usuário atual
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setPosts([]);
                setLoading(false);
                return;
            }

            // Buscar TODOS os posts (não apenas de quem segue)
            const from = pageNum * POSTS_PER_PAGE;
            const to = from + POSTS_PER_PAGE - 1;

            const { data, error: fetchError } = await supabase
                .from('posts')
                .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          ),
          comments_count,
          likes_count,
          shares_count,
          user_like:likes!left(id)
        `)
                .eq('user_like.user_id', user.id) // This filters the JOIN, not the posts
                .order('created_at', { ascending: false })
                .range(from, to);

            if (fetchError) throw fetchError;

            // Verificar se há mais posts
            setHasMore(data.length === POSTS_PER_PAGE);

            // Transformar dados
            const transformedPosts: Post[] = (data || []).map((post: any) => ({
                id: post.id,
                author: post.profiles?.full_name || post.profiles?.username || 'Usuário',
                authorAvatar: post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.profiles?.full_name || 'U')}&background=random`,
                content: post.content,
                type: post.content_type || 'text',
                mediaUrl: post.media_urls?.[0],
                mediaType: post.media_urls?.[0]?.includes('video') ? 'video' : 'image',
                audioUrl: post.audio_url,
                styles: post.styles,
                likes: post.likes_count || 0,
                hasLiked: (post.user_like && post.user_like.length > 0) || false,
                comments: [],
                commentsCount: post.comments_count || 0,
                createdAt: new Date(post.created_at).getTime(),
                repostCount: post.shares_count || 0,
                userId: post.user_id
            }));

            if (append) {
                setPosts(prev => [...prev, ...transformedPosts]);
            } else {
                setPosts(transformedPosts);
            }

            setError(null);
        } catch (err: any) {
            console.error('Erro ao buscar feed:', err);
            setError(err.message);
            if (!err.message?.includes('JWT') && !err.message?.includes('auth')) {
                toast.error('Erro ao carregar feed');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Carregar mais posts (infinite scroll)
    const loadMore = useCallback(async () => {
        if (!hasMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchFeed(nextPage, true);
    }, [page, hasMore, loading, fetchFeed]);

    // Atualizar feed (pull-to-refresh)
    const refreshFeed = useCallback(async () => {
        setPage(0);
        setHasMore(true);
        await fetchFeed(0, false);
    }, [fetchFeed]);

    // Carregar feed inicial
    useEffect(() => {
        fetchFeed(0);
    }, [fetchFeed]);

    // Subscription para mudanças em tempo real
    useEffect(() => {
        const channel = supabase
            .channel('feed_changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'posts' },
                () => {
                    // Novo post criado: melhor recarregar o topo
                    refreshFeed();
                }
            )
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'posts' },
                (payload) => {
                    const updatedPost = payload.new;
                    setPosts(prev => prev.map(post =>
                        post.id === updatedPost.id
                            ? {
                                ...post,
                                content: updatedPost.content,
                                likes: updatedPost.likes_count,
                                commentsCount: updatedPost.comments_count,
                                repostCount: updatedPost.shares_count
                            }
                            : post
                    ));
                }
            )
            .on('postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'posts' },
                (payload) => {
                    setPosts(prev => prev.filter(post => post.id !== payload.old.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [refreshFeed]);

    return {
        posts,
        loading,
        error,
        hasMore,
        loadMore,
        refreshFeed
    };
};
