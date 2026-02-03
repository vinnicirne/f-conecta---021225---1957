import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import toast from 'react-hot-toast';

export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch posts from Supabase
    const fetchPosts = async () => {
        try {
            setLoading(true);

            // Check if user is authenticated
            const { data: { user } } = await supabase.auth.getUser();

            // If no user, don't fetch posts (will show login page)
            if (!user) {
                setPosts([]);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          ),
          likes:likes(count),
          comments_count
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform Supabase data to Post type
            const transformedPosts: Post[] = (data || []).map((post: any) => ({
                id: post.id,
                author: post.profiles?.full_name || post.profiles?.username || 'Usuário',
                authorAvatar: post.profiles?.avatar_url || 'https://ui-avatars.com/api/?background=random',
                content: post.content,
                type: post.content_type || 'text',
                mediaUrl: post.media_urls?.[0],
                mediaType: post.media_urls?.[0]?.includes('video') ? 'video' : 'image',
                likes: post.likes_count || 0,
                hasLiked: false, // TODO: Check if current user liked
                comments: [], // TODO: Fetch comments
                commentsCount: post.comments_count || 0,
                createdAt: new Date(post.created_at).getTime(),
                repostCount: post.shares_count || 0
            }));

            setPosts(transformedPosts);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching posts:', err);
            setError(err.message);
            // Only show error toast if it's not an auth error
            if (!err.message?.includes('JWT') && !err.message?.includes('auth')) {
                toast.error('Erro ao carregar publicações');
            }
        } finally {
            setLoading(false);
        }
    };

    // Create new post
    const createPost = async (content: string, type: string = 'text', mediaUrl?: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Você precisa estar logado');
                return null;
            }

            // Map type to valid content_type values
            // Database constraint: 'text', 'image', 'video', 'audio', 'gallery'
            const contentTypeMap: Record<string, string> = {
                'text': 'text',
                'media': 'image', // Default media to image
                'image': 'image',
                'video': 'video',
                'audio': 'audio',
                'gallery': 'gallery'
            };

            const validContentType = contentTypeMap[type] || 'text';

            const { data, error } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    content,
                    content_type: validContentType,
                    media_urls: mediaUrl ? [mediaUrl] : null
                })
                .select()
                .single();

            if (error) throw error;

            toast.success('Publicação criada!');
            await fetchPosts(); // Refresh posts
            return data;
        } catch (err: any) {
            console.error('Error creating post:', err);
            toast.error('Erro ao criar publicação');
            return null;
        }
    };

    // Update post
    const updatePost = async (postId: string, content: string) => {
        try {
            const { error } = await supabase
                .from('posts')
                .update({ content, updated_at: new Date().toISOString() })
                .eq('id', postId);

            if (error) throw error;

            toast.success('Publicação atualizada!');
            await fetchPosts();
        } catch (err: any) {
            console.error('Error updating post:', err);
            toast.error('Erro ao atualizar publicação');
        }
    };

    // Delete post
    const deletePost = async (postId: string) => {
        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);

            if (error) throw error;

            toast.success('Publicação excluída!');
            await fetchPosts();
        } catch (err: any) {
            console.error('Error deleting post:', err);
            toast.error('Erro ao excluir publicação');
        }
    };

    // Like/Unlike post
    const toggleLike = async (postId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Você precisa estar logado');
                return;
            }

            // Check if already liked
            const { data: existingLike } = await supabase
                .from('likes')
                .select('id')
                .eq('post_id', postId)
                .eq('user_id', user.id)
                .single();

            if (existingLike) {
                // Unlike
                await supabase.from('likes').delete().eq('id', existingLike.id);
            } else {
                // Like
                await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
            }

            await fetchPosts();
        } catch (err: any) {
            console.error('Error toggling like:', err);
        }
    };

    // Subscribe to realtime changes
    useEffect(() => {
        fetchPosts();

        const channel = supabase
            .channel('posts_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
                fetchPosts();
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload) => {
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
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
                setPosts(prev => prev.filter(post => post.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return {
        posts,
        loading,
        error,
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
        toggleLike
    };
};
