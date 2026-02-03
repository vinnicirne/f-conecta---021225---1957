import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Post } from '../types';

interface UseRepostReturn {
    repostPost: (originalPost: Post) => Promise<void>;
    loading: boolean;
}

export const useRepost = (): UseRepostReturn => {
    const [loading, setLoading] = useState(false);

    const repostPost = async (originalPost: Post) => {
        try {
            setLoading(true);

            // Obter usuário atual
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Você precisa estar logado para repostar');
                return;
            }

            // Buscar perfil do usuário
            const { data: profile } = await supabase
                .from('profiles')
                .select('username, full_name')
                .eq('id', user.id)
                .single();

            if (!profile) {
                toast.error('Perfil não encontrado');
                return;
            }

            // Criar repost
            const repostContent = `🔄 Repostado de @${originalPost.author}\n\n${originalPost.content}`;

            const { error: insertError } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    content: repostContent,
                    content_type: originalPost.type,
                    media_urls: originalPost.mediaUrl ? [originalPost.mediaUrl] : null,
                    audio_url: originalPost.audioUrl,
                    styles: originalPost.styles,
                    is_repost: true,
                    original_post_id: originalPost.id,
                    original_author: originalPost.author
                });

            if (insertError) throw insertError;

            // Incrementar contador de shares no post original
            const { error: updateError } = await supabase
                .from('posts')
                .update({ shares_count: (originalPost.repostCount || 0) + 1 })
                .eq('id', originalPost.id);

            if (updateError) console.error('Erro ao atualizar contador:', updateError);

            toast.success('Post repostado com sucesso!');
        } catch (error: any) {
            console.error('Erro ao repostar:', error);
            toast.error('Erro ao repostar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        repostPost,
        loading
    };
};
