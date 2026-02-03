import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    bio?: string;
}

interface Hashtag {
    id: string;
    name: string;
    post_count: number;
}

interface UseSearchReturn {
    searchUsers: (query: string) => Promise<Profile[]>;
    searchHashtags: (query: string) => Promise<Hashtag[]>;
    loading: boolean;
    error: string | null;
}

export const useSearch = (): UseSearchReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchUsers = useCallback(async (query: string): Promise<Profile[]> => {
        if (!query.trim()) return [];

        try {
            setLoading(true);
            setError(null);

            // Remover @ se presente
            const searchQuery = query.startsWith('@') ? query.slice(1) : query;
            const searchTerm = searchQuery.toLowerCase();

            const { data, error: searchError } = await supabase
                .from('profiles')
                .select('id, username, full_name, avatar_url, bio')
                .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
                .limit(10);

            if (searchError) throw searchError;

            return data || [];
        } catch (err: any) {
            console.error('Erro ao buscar usuários:', err);
            setError(err.message);
            toast.error('Erro ao buscar usuários');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const searchHashtags = useCallback(async (query: string): Promise<Hashtag[]> => {
        if (!query.trim()) return [];

        try {
            setLoading(true);
            setError(null);

            // Remover # se presente
            const searchQuery = query.startsWith('#') ? query.slice(1) : query;
            const searchTerm = searchQuery.toLowerCase();

            const { data, error: searchError } = await supabase
                .from('hashtags')
                .select('id, name, post_count')
                .ilike('name', `%${searchTerm}%`)
                .order('post_count', { ascending: false })
                .limit(10);

            if (searchError) throw searchError;

            return data || [];
        } catch (err: any) {
            console.error('Erro ao buscar hashtags:', err);
            setError(err.message);
            toast.error('Erro ao buscar hashtags');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        searchUsers,
        searchHashtags,
        loading,
        error
    };
};
