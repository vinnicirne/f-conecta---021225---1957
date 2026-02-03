import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Profile {
    id: string;
    username: string;
    full_name: string;
    bio: string | null;
    avatar_url: string | null;
    cover_url: string | null;
    location: string | null;
    church_name: string | null;
    followers_count: number;
    following_count: number;
    posts_count: number;
}

interface ProfileStats {
    posts: number;
    followers: number;
    following: number;
}

export const useProfile = (userId?: string) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState<ProfileStats>({ posts: 0, followers: 0, following: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const targetUserId = userId || user?.id;

    useEffect(() => {
        if (targetUserId) {
            fetchProfile();
            fetchStats();
        }
    }, [targetUserId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', targetUserId)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            setError(err.message);
            toast.error('Erro ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Count posts
            const { count: postsCount } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', targetUserId);

            // Count followers
            const { count: followersCount } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('following_id', targetUserId);

            // Count following
            const { count: followingCount } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('follower_id', targetUserId);

            setStats({
                posts: postsCount || 0,
                followers: followersCount || 0,
                following: followingCount || 0
            });
        } catch (err: any) {
            console.error('Error fetching stats:', err);
        }
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', targetUserId);

            if (error) throw error;

            toast.success('Perfil atualizado!');
            await fetchProfile();
        } catch (err: any) {
            console.error('Error updating profile:', err);
            toast.error('Erro ao atualizar perfil');
        }
    };

    return {
        profile,
        stats,
        loading,
        error,
        updateProfile,
        refreshProfile: fetchProfile,
        refreshStats: fetchStats
    };
};
