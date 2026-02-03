import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import toast from 'react-hot-toast';

interface Hashtag {
    id: string;
    name: string;
    post_count: number;
    created_at: string;
}

interface UseHashtagReturn {
    hashtag: Hashtag | null;
    posts: Post[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
}

const POSTS_PER_PAGE = 10;

export const useHashtag = (hashtagName: string): UseHashtagReturn => {
    const [hashtag, setHashtag] = useState<Hashtag | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Buscar informações da hashtag
    const fetchHashtag = useCallback(async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('hashtags')
                .select('*')
                .eq('name', hashtagName.toLowerCase())
                .single();

            if (fetchError) throw fetchError;
            setHashtag(data);
        } catch (err: any) {
            console.error('Erro ao buscar hashtag:', err);
            setError(err.message);
        }
    }, [hashtagName]);

    // Buscar posts da hashtag
    const fetchPosts = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            setLoading(true);

            // Buscar hashtag ID
            const { data: hashtagData } = await supabase
                .from('hashtags')
                .select('id')
                .eq('name', hashtagName.toLowerCase())
                .single();

            if (!hashtagData) {
                setPosts([]);
                setHasMore(false);
                return;
            }

            // Buscar IDs dos posts com essa hashtag
            const { data: postHashtags } = await supabase
                .from('post_hashtags')
                .select('post_id')
                .eq('hashtag_id', hashtagData.id);

            const postIds = postHashtags?.map(ph => ph.post_id) || [];

            if (postIds.length === 0) {
                setPosts([]);
                setHasMore(false);
                return;
            }

            // Buscar posts com paginação
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
          )
        `)
                .in('id', postIds)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (fetchError) throw fetchError;

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
                hasLiked: false,
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
            console.error('Erro ao buscar posts da hashtag:', err);
            setError(err.message);
            toast.error('Erro ao carregar posts');
        } finally {
            setLoading(false);
        }
    }, [hashtagName]);

    // Carregar mais posts
    const loadMore = useCallback(async () => {
        if (!hasMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchPosts(nextPage, true);
    }, [page, hasMore, loading, fetchPosts]);

    // Carregar dados iniciais
    useEffect(() => {
        fetchHashtag();
        fetchPosts(0);

        // Subscription para mudanças em tempo real
        const channel = supabase
            .channel(`hashtag_${hashtagName}`)
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
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
                // Para novos posts, melhor recarregar o topo (embora precise verificar se tem a hashtag)
                fetchPosts(0);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
                setPosts(prev => prev.filter(post => post.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [hashtagName, fetchHashtag, fetchPosts]);

    return {
        hashtag,
        posts,
        loading,
        error,
        hasMore,
        loadMore
    };
};
