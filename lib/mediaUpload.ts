import { supabase } from './supabase';
import toast from 'react-hot-toast';

/**
 * Upload de arquivo para o Supabase Storage
 * @param file - Arquivo a ser enviado (imagem, vídeo ou áudio)
 * @param bucket - Nome do bucket ('posts-media' por padrão)
 * @returns URL pública do arquivo ou null em caso de erro
 */
export const uploadMedia = async (
    file: File,
    bucket: string = 'posts-media'
): Promise<string | null> => {
    try {
        // Validar tamanho do arquivo (máx 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            toast.error('Arquivo muito grande! Máximo 50MB');
            return null;
        }

        // Gerar nome único para o arquivo
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload do arquivo
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Erro no upload:', error);
            toast.error('Erro ao enviar arquivo');
            return null;
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Erro no upload de mídia:', error);
        toast.error('Erro ao processar arquivo');
        return null;
    }
};

/**
 * Deletar arquivo do Supabase Storage
 * @param url - URL do arquivo a ser deletado
 * @param bucket - Nome do bucket
 */
export const deleteMedia = async (
    url: string,
    bucket: string = 'posts-media'
): Promise<boolean> => {
    try {
        // Extrair o caminho do arquivo da URL
        const urlParts = url.split('/');
        const filePath = urlParts[urlParts.length - 1];

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Erro ao deletar arquivo:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao deletar mídia:', error);
        return false;
    }
};
