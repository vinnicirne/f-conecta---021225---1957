import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface ShareMenuProps {
    postId: string;
    onRepost: () => void;
    onClose: () => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ postId, onRepost, onClose }) => {
    const [copying, setCopying] = useState(false);

    const handleCopyLink = async () => {
        try {
            setCopying(true);
            const link = `${window.location.origin}/post/${postId}`;
            await navigator.clipboard.writeText(link);
            toast.success('Link copiado!');
            onClose();
        } catch (error) {
            toast.error('Erro ao copiar link');
        } finally {
            setCopying(false);
        }
    };

    const handleRepost = () => {
        onRepost();
        onClose();
    };

    return (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button
                onClick={handleCopyLink}
                disabled={copying}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors disabled:opacity-50"
            >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copying ? 'Copiando...' : 'Copiar link'}</span>
            </button>

            <button
                onClick={handleRepost}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Repostar</span>
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <button
                onClick={onClose}
                className="w-full text-left px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
            </button>
        </div>
    );
};

export default ShareMenu;
