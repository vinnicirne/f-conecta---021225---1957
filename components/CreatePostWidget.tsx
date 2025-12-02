import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Camera, 
  Mic, 
  Type, 
  X, 
  Send,
  Bold,
  Italic,
  Underline,
  Palette,
  Smile
} from 'lucide-react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';

interface CreatePostWidgetProps {
  onPostCreated: (post: Post) => void;
}

const BACKGROUNDS = [
  { id: 'none', class: 'bg-white', label: 'Padrão' },
  { id: 'sunrise', class: 'bg-gradient-to-br from-orange-100 to-yellow-100', label: 'Manhã' },
  { id: 'peace', class: 'bg-gradient-to-br from-blue-100 to-cyan-100', label: 'Paz' },
  { id: 'worship', class: 'bg-gradient-to-br from-violet-100 to-purple-200', label: 'Louvor' },
  { id: 'love', class: 'bg-gradient-to-br from-pink-100 to-rose-200', label: 'Amor' },
];

const FONTS = [
  { id: 'sans', class: 'font-sans', label: 'Moderna' },
  { id: 'serif', class: 'font-serif', label: 'Clássica' },
  { id: 'mono', class: 'font-mono', label: 'Máquina' },
];

export const CreatePostWidget: React.FC<CreatePostWidgetProps> = ({ onPostCreated }) => {
  const { currentUser, draftPost, setDraftPost } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'gallery' | 'camera' | 'audio'>('text');
  const [content, setContent] = useState('');
  
  // Rich Text States
  const [currentBg, setCurrentBg] = useState(BACKGROUNDS[0]);
  const [currentFont, setCurrentFont] = useState(FONTS[0]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for Drafts (e.g., from Bible)
  useEffect(() => {
    if (draftPost) {
      setIsOpen(true);
      setActiveTab('text');
      setContent(draftPost.content);
      
      if (draftPost.style) {
          // Attempt to map style back to local state if needed, 
          // or we could just set properties directly.
          if (draftPost.style.backgroundColor) {
             const bg = BACKGROUNDS.find(b => b.class === draftPost.style?.backgroundColor);
             if (bg) setCurrentBg(bg);
          }
          if (draftPost.style.isItalic) setIsItalic(true);
          if (draftPost.style.fontFamily) {
             const font = FONTS.find(f => f.class === draftPost.style?.fontFamily);
             if (font) setCurrentFont(font);
          }
      }

      // Clear draft so it doesn't reappear
      setDraftPost(null);
    }
  }, [draftPost, setDraftPost]);

  const handlePost = () => {
    if (!content.trim() && activeTab === 'text') return;

    const newPost: Post = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      content: content,
      type: 'text', // Simplification for demo
      style: activeTab === 'text' ? {
        backgroundColor: currentBg.class,
        fontFamily: currentFont.class,
        isBold,
        isItalic,
        isUnderline
      } : undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      date: 'Agora mesmo',
      timestamp: Date.now(),
      isLikedByCurrentUser: false
    };

    onPostCreated(newPost);
    setContent('');
    setIsOpen(false);
    // Reset styles
    setCurrentBg(BACKGROUNDS[0]);
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
  };

  if (!isOpen) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6 flex items-center gap-4 transition-all hover:shadow-md cursor-pointer" onClick={() => setIsOpen(true)}>
        <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-blue-200 flex-shrink-0" alt="Me" />
        <div className="flex-1 bg-slate-100 rounded-full h-10 flex items-center px-4 text-slate-500 text-sm hover:bg-slate-200 transition-colors">
          Compartilhe uma palavra de fé...
        </div>
        <div className="flex gap-2 text-slate-400">
          <ImageIcon size={20} />
          <Camera size={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-0 mb-6 overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-700">Criar Publicação</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Type size={18} /> Texto
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'gallery' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <ImageIcon size={18} /> Galeria
        </button>
        <button 
          onClick={() => setActiveTab('camera')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'camera' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Camera size={18} /> Câmera
        </button>
        <button 
          onClick={() => setActiveTab('audio')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'audio' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Mic size={18} /> Áudio
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {activeTab === 'text' && (
          <div className="space-y-4">
             {/* Rich Editor Toolbar */}
             <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                <button 
                  onClick={() => setIsBold(!isBold)}
                  className={`p-1.5 rounded hover:bg-white ${isBold ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500'}`}
                >
                  <Bold size={16} />
                </button>
                <button 
                   onClick={() => setIsItalic(!isItalic)}
                   className={`p-1.5 rounded hover:bg-white ${isItalic ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500'}`}
                >
                  <Italic size={16} />
                </button>
                <button 
                   onClick={() => setIsUnderline(!isUnderline)}
                   className={`p-1.5 rounded hover:bg-white ${isUnderline ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500'}`}
                >
                  <Underline size={16} />
                </button>
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                {FONTS.map(f => (
                   <button 
                    key={f.id}
                    onClick={() => setCurrentFont(f)}
                    className={`px-2 py-1 text-xs rounded border ${currentFont.id === f.id ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-transparent text-slate-500 hover:bg-white'}`}
                   >
                     {f.label}
                   </button>
                ))}
             </div>

             {/* Background Selector */}
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {BACKGROUNDS.map(bg => (
                 <button 
                  key={bg.id}
                  onClick={() => setCurrentBg(bg)}
                  className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${bg.class} ${currentBg.id === bg.id ? 'border-blue-500 scale-110' : 'border-slate-200'}`}
                  title={bg.label}
                 />
               ))}
             </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que Deus colocou no seu coração hoje?"
              className={`w-full h-40 p-4 rounded-lg resize-none focus:outline-none transition-all duration-300
                ${currentBg.class} 
                ${currentFont.class}
                ${isBold ? 'font-bold' : ''}
                ${isItalic ? 'italic' : ''}
                ${isUnderline ? 'underline' : ''}
                ${currentBg.id !== 'none' ? 'text-slate-800 text-lg text-center flex items-center justify-center border-none shadow-inner' : 'border border-slate-200'}
              `}
            />
          </div>
        )}

        {activeTab === 'gallery' && (
           <div className="h-40 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => fileInputRef.current?.click()}
           >
             <ImageIcon size={32} className="mb-2" />
             <span className="text-sm">Clique para adicionar foto ou vídeo</span>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" />
           </div>
        )}

        {activeTab === 'camera' && (
          <div className="h-64 bg-black rounded-lg relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
             <p className="text-white/70 text-sm absolute top-4">Câmera Frontal</p>
             <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center z-10 hover:scale-110 transition-transform">
               <div className="w-14 h-14 bg-red-500 rounded-full border-2 border-black"></div>
             </button>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="h-40 bg-slate-50 rounded-lg flex flex-col items-center justify-center gap-4">
             <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                <Mic size={32} className="text-red-500" />
             </div>
             <p className="text-sm text-slate-500">Toque para gravar</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <div className="flex gap-2">
           <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Smile size={20}/></button>
           <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Palette size={20}/></button>
        </div>
        <button 
          onClick={handlePost}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!content && activeTab === 'text'}
        >
          Publicar <Send size={16} />
        </button>
      </div>
    </div>
  );
};