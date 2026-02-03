import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useFollow = (targetUserId: string | undefined) => {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && targetUserId && user.id !== targetUserId) {
            checkFollowing();
        }
    }, [targetUserId, user]);

    const checkFollowing = async () => {
        if (!user || !targetUserId) return;

        try {
            const { data, error } = await supabase
                .from('follows')
                .select('id')
                .eq('follower_id', user.id)
                .eq('following_id', targetUserId)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking follow status:', error);
                return;
            }

            setIsFollowing(!!data);
        } catch (err) {
            console.error('Error checking follow:', err);
        }
    };

    const follow = async () => {
        if (!user || !targetUserId) return;

        setLoading(true);
        try {
            const { error } = await supabase.from('follows').insert({
                follower_id: user.id,
                following_id: targetUserId
            });

            if (error) throw error;

            setIsFollowing(true);
        } catch (err) {
            console.error('Error following user:', err);
            alert('Erro ao seguir usuário');
        } finally {
            setLoading(false);
        }
    };

    const unfollow = async () => {
        if (!user || !targetUserId) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('follower_id', user.id)
                .eq('following_id', targetUserId);

            if (error) throw error;

            setIsFollowing(false);
        } catch (err) {
            console.error('Error unfollowing user:', err);
            alert('Erro ao deixar de seguir');
        } finally {
            setLoading(false);
        }
    };

    const toggleFollow = async () => {
        if (isFollowing) {
            await unfollow();
        } else {
            await follow();
        }
    };

    return { isFollowing, loading, toggleFollow, refetch: checkFollowing };
};
