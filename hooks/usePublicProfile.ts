import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
    id: string;
    username: string;
    full_name: string;
    bio: string | null;
    avatar_url: string | null;
    cover_url: string | null;
    location: string | null;
    church_name: string | null;
    denomination: string | null;
    website: string | null;
    is_verified: boolean;
    is_private: boolean;
    social_links: {
        whatsapp?: string;
        instagram?: string;
        facebook?: string;
        twitter?: string;
        youtube?: string;
    } | null;
}

interface Stats {
    posts: number;
    followers: number;
    following: number;
}

export const usePublicProfile = (username: string) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState<Stats>({ posts: 0, followers: 0, following: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (username) {
            fetchProfile();
        }
    }, [username]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // Buscar perfil por username
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (profileError) {
                if (profileError.code === 'PGRST116') {
                    setError('Perfil não encontrado');
                } else {
                    throw profileError;
                }
                return;
            }

            setProfile(profileData);

            // Buscar estatísticas em paralelo
            const [postsResult, followersResult, followingResult] = await Promise.all([
                supabase
                    .from('posts')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', profileData.id),
                supabase
                    .from('follows')
                    .select('id', { count: 'exact', head: true })
                    .eq('following_id', profileData.id),
                supabase
                    .from('follows')
                    .select('id', { count: 'exact', head: true })
                    .eq('follower_id', profileData.id)
            ]);

            setStats({
                posts: postsResult.count || 0,
                followers: followersResult.count || 0,
                following: followingResult.count || 0
            });
        } catch (err) {
            console.error('Error fetching public profile:', err);
            setError('Erro ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    return { profile, stats, loading, error, refetch: fetchProfile };
};
