import { supabase } from './supabase';
import toast from 'react-hot-toast';

/**
 * Comprime uma imagem no lado do cliente usando Canvas
 * @param file - Arquivo original
 * @param maxWidth - Largura máxima
 * @param maxHeight - Altura máxima
 * @param quality - Qualidade (0.0 a 1.0)
 */
const compressImage = (file: File, maxWidth: number = 1200, maxHeight: number = 1200, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calcular proporções
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Falha na compressão da imagem'));
                    }
                }, 'image/jpeg', quality);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

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
        let fileToUpload = file;

        // Comprimir se for imagem
        if (file.type.startsWith('image/')) {
            try {
                fileToUpload = await compressImage(file);
                console.log(`Imagem comprimida: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
            } catch (err) {
                console.warn('Falha ao comprimir imagem, enviando original:', err);
            }
        }

        // Validar tamanho do arquivo (máx 50MB)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (fileToUpload.size > maxSize) {
            toast.error('Arquivo muito grande! Máximo 50MB');
            return null;
        }

        // Gerar nome único para o arquivo
        const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload do arquivo
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, fileToUpload, {
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
