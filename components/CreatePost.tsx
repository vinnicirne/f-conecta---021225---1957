

import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Post, PostTab, PostStyles, FontOption } from '../types';
import RichTextEditor from './RichTextEditor';
import MediaCapture from './MediaCapture';
import AudioRecorder from './AudioRecorder';

import { useAuth } from '../contexts/AuthContext';

interface CreatePostProps {
  onPost: (post: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPost }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<PostTab | null>(null);
  const [content, setContent] = useState('');
  const [styles, setStyles] = useState<PostStyles>({
    bold: false,
    italic: false,
    underline: false,
    highlight: false,
    font: 'sans',
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setActiveTab(null);
    setContent('');
    setStyles({
      bold: false,
      italic: false,
      underline: false,
      highlight: false,
      font: 'sans',
      textColor: '#1a1a1a',
      backgroundColor: '#ffffff'
    });
  };

  const handlePostSubmit = (mediaData?: { url: string; type: 'image' | 'video' | 'audio' }) => {
    if (!content && !mediaData) return;

    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      author: user?.user_metadata?.full_name || user?.user_metadata?.username || 'Você',
      authorAvatar: user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'U')}&background=random`,
      content,
      type: mediaData?.type === 'audio' ? 'audio' : (mediaData ? 'media' : 'text'),
      mediaUrl: mediaData?.type !== 'audio' ? mediaData?.url : undefined,
      mediaType: mediaData?.type === 'image' || mediaData?.type === 'video' ? mediaData.type : undefined,
      audioUrl: mediaData?.type === 'audio' ? mediaData.url : undefined,
      styles: activeTab === PostTab.TEXT ? styles : undefined,
      likes: 0,
      hasLiked: false,
      comments: [],
      commentsCount: 0,
      createdAt: Date.now(),
      repostCount: 0
    };

    onPost(newPost);
    reset();
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar loading
    const loadingToast = toast.loading('Enviando arquivo...');

    try {
      // Upload para Supabase Storage
      const { uploadMedia } = await import('../lib/mediaUpload');
      const publicUrl = await uploadMedia(file);

      toast.dismiss(loadingToast);

      if (!publicUrl) {
        toast.error('Erro ao enviar arquivo');
        return;
      }

      // Determinar tipo de mídia
      const type = file.type.startsWith('video') ? 'video' : 'image';

      // Criar post com URL permanente
      handlePostSubmit({ url: publicUrl, type });
      toast.success('Arquivo enviado!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Erro ao processar arquivo');
      console.error('Erro no upload:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="p-4 flex items-start space-x-3">
        <img
          src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || 'U')}&background=random`}
          alt="Avatar"
          className="w-10 h-10 rounded-full border border-gray-100 object-cover"
        />
        <div className="flex-1">
          {!activeTab ? (
            <button
              onClick={() => setActiveTab(PostTab.TEXT)}
              className="w-full text-left py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              No que você está pensando?
            </button>
          ) : (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              {activeTab === PostTab.TEXT && (
                <RichTextEditor
                  content={content}
                  setContent={setContent}
                  styles={styles}
                  setStyles={setStyles}
                  onCancel={reset}
                  onPost={() => handlePostSubmit()}
                />
              )}
              {activeTab === PostTab.CAMERA && (
                <MediaCapture
                  onCapture={(url, type) => handlePostSubmit({ url, type })}
                  onCancel={reset}
                />
              )}
              {activeTab === PostTab.AUDIO && (
                <AudioRecorder
                  onComplete={(url) => handlePostSubmit({ url, type: 'audio' })}
                  onCancel={reset}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {!activeTab && (
        <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
          <div className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab(PostTab.TEXT)}
              className="flex items-center space-x-2 px-3 py-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Texto</span>
            </button>

            <button
              onClick={handleGalleryClick}
              className="flex items-center space-x-2 px-3 py-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Galeria</span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </button>

            <button
              onClick={() => setActiveTab(PostTab.CAMERA)}
              className="flex items-center space-x-2 px-3 py-1.5 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Câmera</span>
            </button>

            <button
              onClick={() => setActiveTab(PostTab.AUDIO)}
              className="flex items-center space-x-2 px-3 py-1.5 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>Áudio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
