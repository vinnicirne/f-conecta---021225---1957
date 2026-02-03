import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatRelativeTime } from '../lib/utils';
import toast from 'react-hot-toast';

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles: {
        full_name: string;
        username: string;
        avatar_url: string;
    };
}

interface CommentSectionProps {
    postId: string;
    isOpen: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, isOpen }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<{
        username: string;
        fullName: string;
    } | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Buscar comentários
    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [postId, isOpen]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('comments')
                .select(`
          id,
          user_id,
          content,
          created_at,
          profiles:user_id (
            full_name,
            username,
            avatar_url
          )
        `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            setSubmitting(true);

            const { error } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    user_id: user.id,
                    content: newComment.trim()
                });

            if (error) throw error;

            setNewComment('');
            setReplyingTo(null); // Limpar estado de resposta
            await fetchComments();
            toast.success('Comentário adicionado!');
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
            toast.error('Erro ao comentar');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = (username: string, fullName: string) => {
        setReplyingTo({ username, fullName });
        setNewComment(`@${username} `);
        // Focus no input após um pequeno delay para garantir renderização
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setNewComment('');
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Excluir este comentário?')) return;

        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId);

            if (error) throw error;

            setComments(prev => prev.filter(c => c.id !== commentId));
            toast.success('Comentário excluído');
        } catch (error) {
            console.error('Erro ao excluir comentário:', error);
            toast.error('Erro ao excluir');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="border-t border-gray-100 pt-4 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Lista de comentários */}
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-4">
                        <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-4">
                        Seja o primeiro a comentar!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <img
                                src={comment.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.profiles.full_name)}&background=random`}
                                alt={comment.profiles.full_name}
                                className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="bg-gray-50 rounded-2xl px-4 py-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-sm text-gray-900">
                                            {comment.profiles.full_name}
                                        </h4>
                                        {user?.id === comment.user_id && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-500 hover:text-red-700 text-xs"
                                            >
                                                Excluir
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
                                        {comment.content}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 ml-4">
                                    <span>{formatRelativeTime(new Date(comment.created_at).getTime())}</span>
                                    <button
                                        onClick={() => handleReply(comment.profiles.username, comment.profiles.full_name)}
                                        className="text-gray-500 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        Responder
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Indicador de resposta */}
            {replyingTo && (
                <div className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg mb-2">
                    <span className="text-sm text-blue-700">
                        Respondendo a <strong>@{replyingTo.username}</strong>
                    </span>
                    <button
                        onClick={cancelReply}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Input para novo comentário */}
            {user && (
                <form onSubmit={handleAddComment} className="flex gap-2">
                    <img
                        src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || 'U')}&background=random`}
                        alt="Você"
                        className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva um comentário..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={submitting}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? '...' : 'Enviar'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CommentSection;
