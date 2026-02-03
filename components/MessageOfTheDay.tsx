import React, { useEffect, useState } from 'react';
import { getDailyMessage, refreshDailyMessage } from '../lib/dailyMessage';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface DailyMessageData {
    title: string;
    message: string;
    verse: {
        text: string;
        reference: string;
    };
    date: string;
}

const MessageOfTheDay: React.FC = () => {
    const { user } = useAuth();
    const [dailyMessage, setDailyMessage] = useState<DailyMessageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDailyMessage();
    }, []);

    const fetchDailyMessage = async () => {
        try {
            setLoading(true);
            const message = await getDailyMessage();
            if (message) {
                setDailyMessage(message);
                setLikes(Math.floor(Math.random() * 150) + 50);
            }
        } catch (error) {
            console.error('Error fetching daily message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = () => {
        setHasLiked(!hasLiked);
        setLikes(hasLiked ? likes - 1 : likes + 1);
    };

    const handleShare = () => {
        if (navigator.share && dailyMessage) {
            navigator.share({
                title: dailyMessage.title,
                text: `${dailyMessage.message}`,
                url: window.location.href
            });
        } else if (dailyMessage) {
            const text = `${dailyMessage.title}\n\n${dailyMessage.message}`;
            navigator.clipboard.writeText(text);
            alert('Mensagem copiada para a área de transferência!');
        }
    };

    const handleRefresh = async () => {
        try {
            setLoading(true);
            const message = await refreshDailyMessage();
            if (message) {
                setDailyMessage(message);
                setLikes(Math.floor(Math.random() * 150) + 50);
            }
        } catch (error) {
            console.error('Error refreshing message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToNotes = async () => {
        if (!user || !dailyMessage) {
            alert('Você precisa estar logado para salvar em notas.');
            return;
        }

        try {
            setSaving(true);

            const noteContent = `📖 Mensagem do Dia - ${new Date().toLocaleDateString('pt-BR')}\n\n${dailyMessage.title}\n\n${dailyMessage.message}`;

            const { error } = await supabase
                .from('user_notes')
                .insert({
                    user_id: user.id,
                    title: dailyMessage.title,
                    content: noteContent,
                    category: 'Devocionais',
                    tags: ['Mensagem do Dia']
                });

            if (error) throw error;

            alert('✅ Mensagem salva em Notas!');
        } catch (error) {
            console.error('Error saving to notes:', error);
            alert('Erro ao salvar em notas. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="md" />
                </div>
            </div>
        );
    }

    if (!dailyMessage) return null;

    return (
        <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-6 text-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="text-sm font-semibold uppercase tracking-wide">Mensagem do Dia</span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        title="Nova mensagem"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-4">{dailyMessage.title}</h2>

                {/* Message */}
                <p className="text-white/95 leading-relaxed mb-4 text-base">{dailyMessage.message}</p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${hasLiked
                                ? 'bg-white/30 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white/80'
                                }`}
                        >
                            <svg className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-medium">{likes}</span>
                        </button>

                        <button
                            onClick={handleSaveToNotes}
                            disabled={saving}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white/80 text-sm disabled:opacity-50"
                            title="Salvar em Notas"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="font-medium">{saving ? 'Salvando...' : 'Salvar'}</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white/80 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span className="font-medium">Compartilhar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageOfTheDay;
