import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { useFollow } from '../hooks/useFollow';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EditProfileModal from '../components/EditProfileModal';
import PostCard from '../components/PostCard';
import SocialLinks from '../components/SocialLinks';

interface ProfilePageProps {
    username?: string; // Se fornecido, mostra perfil público; senão, mostra perfil próprio
}

const ProfilePage: React.FC<ProfilePageProps> = ({ username: propUsername }) => {
    const { user } = useAuth();
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

    // Determinar qual username usar (prop ou do usuário logado)
    const targetUsername = propUsername || user?.username || '';
    const isOwnProfile = !propUsername || propUsername === user?.username;

    // Usar hook apropriado
    const ownProfileData = useProfile();
    const publicProfileData = usePublicProfile(targetUsername);

    const { profile, stats, loading } = isOwnProfile ? ownProfileData : publicProfileData;

    // Hook de follow (apenas para perfis de outros)
    const { isFollowing, loading: followLoading, toggleFollow } = useFollow(
        !isOwnProfile ? profile?.id : undefined
    );

    useEffect(() => {
        if (profile?.id) {
            fetchUserPosts(profile.id);

            // Subscription para mudanças em tempo real no perfil
            const channel = supabase
                .channel(`profile_posts_${profile.id}`)
                .on('postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'posts', filter: `user_id=eq.${profile.id}` },
                    (payload) => {
                        const updatedPost = payload.new;
                        setUserPosts(prev => prev.map(post =>
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
                    { event: 'INSERT', schema: 'public', table: 'posts', filter: `user_id=eq.${profile.id}` },
                    () => fetchUserPosts(profile.id)
                )
                .on('postgres_changes',
                    { event: 'DELETE', schema: 'public', table: 'posts', filter: `user_id=eq.${profile.id}` },
                    (payload) => {
                        setUserPosts(prev => prev.filter(post => post.id !== payload.old.id));
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [profile?.id]);

    const fetchUserPosts = async (userId: string) => {
        try {
            setLoadingPosts(true);
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
          comments_count
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const transformedPosts: Post[] = (data || []).map((post: any) => ({
                id: post.id,
                author: post.profiles?.full_name || post.profiles?.username || 'Usuário',
                authorAvatar: post.profiles?.avatar_url || 'https://ui-avatars.com/api/?background=random',
                content: post.content,
                type: post.content_type || 'text',
                mediaUrl: post.media_urls?.[0],
                mediaType: post.media_urls?.[0]?.includes('video') ? 'video' : 'image',
                likes: post.likes_count || 0,
                hasLiked: false,
                comments: [],
                commentsCount: post.comments_count || 0,
                createdAt: new Date(post.created_at).getTime(),
                repostCount: post.shares_count || 0
            }));

            setUserPosts(transformedPosts);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoadingPosts(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfil não encontrado</h3>
                    <p className="text-gray-600">Este usuário não existe ou foi removido</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                    {/* Cover Photo */}
                    <div
                        className="h-32 bg-cover bg-center"
                        style={{
                            backgroundImage: profile.cover_url
                                ? `url(${profile.cover_url})`
                                : 'linear-gradient(to right, #2563eb, #4f46e5)'
                        }}
                    />

                    <div className="px-6 pb-6">
                        <div className="flex items-end justify-between -mt-16 mb-4">
                            <img
                                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`}
                                alt={profile.full_name}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                            />

                            {/* Action Button */}
                            {isOwnProfile ? (
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                >
                                    Editar Perfil
                                </button>
                            ) : (
                                <button
                                    onClick={toggleFollow}
                                    disabled={followLoading}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${isFollowing
                                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        } disabled:opacity-50`}
                                >
                                    {followLoading ? 'Carregando...' : isFollowing ? 'Seguindo' : 'Seguir'}
                                </button>
                            )}
                        </div>

                        {/* Profile Info */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.full_name}</h1>
                        <p className="text-gray-600 mb-2">@{profile.username}</p>

                        {profile.bio && (
                            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{profile.bio}</p>
                        )}

                        {/* Location & Church */}
                        {(profile.location || profile.church_name) && (
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                                {profile.location && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {profile.location}
                                    </span>
                                )}
                                {profile.church_name && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        {profile.church_name}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Social Links */}
                        <SocialLinks socialLinks={profile.social_links} />

                        {/* Stats */}
                        <div className="flex gap-6 text-sm mt-4">
                            <div>
                                <span className="font-bold text-gray-900">{stats.posts}</span>
                                <span className="text-gray-600 ml-1">Publicações</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900">{stats.followers}</span>
                                <span className="text-gray-600 ml-1">Seguidores</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900">{stats.following}</span>
                                <span className="text-gray-600 ml-1">Seguindo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'posts'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Publicações
                        </button>
                        {isOwnProfile && (
                            <button
                                onClick={() => setActiveTab('saved')}
                                className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'saved'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Salvos
                            </button>
                        )}
                    </div>
                </div>

                {/* Posts Grid */}
                {activeTab === 'posts' && (
                    <div>
                        {loadingPosts ? (
                            <div className="flex justify-center py-12">
                                <LoadingSpinner size="md" />
                            </div>
                        ) : userPosts.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {isOwnProfile ? 'Nenhuma publicação ainda' : 'Sem publicações'}
                                </h3>
                                <p className="text-gray-600">
                                    {isOwnProfile ? 'Comece compartilhando sua fé!' : 'Este usuário ainda não publicou nada'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {userPosts.map(post => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onUpdate={() => { }}
                                        onDelete={() => fetchUserPosts(profile.id)}
                                        onRepost={() => { }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Saved Posts */}
                {activeTab === 'saved' && isOwnProfile && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum post salvo</h3>
                        <p className="text-gray-600">Posts que você salvar aparecerão aqui</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isOwnProfile && (
                <EditProfileModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </div>
    );
};

export default ProfilePage;
