import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Camera, Mic, Type, X, Bold, Italic, Underline, Highlighter, Palette, Send, Smile } from 'lucide-react';

interface CreatePostProps {
  onPost: (postData: any) => void;
  currentUser: any;
}

const FONTS = [
  { name: 'Padrão', class: 'font-sans' },
  { name: 'Serifa', class: 'font-serif' },
  { name: 'Mono', class: 'font-mono' },
  { name: 'Elegante', class: 'font-[cursive]' },
  { name: 'Moderna', class: 'font-[system-ui]' }
];

const BACKGROUNDS = [
  'bg-white',
  'bg-gradient-to-r from-red-50 to-orange-50', // Warm
  'bg-gradient-to-r from-blue-50 to-indigo-50', // Cool
  'bg-gradient-to-r from-green-50 to-emerald-50', // Nature
  'bg-gray-900 text-white', // Dark
];

const TEXT_COLORS = ['text-gray-900', 'text-blue-600', 'text-purple-600', 'text-red-600', 'text-green-600'];

export const CreatePost: React.FC<CreatePostProps> = ({ onPost, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<string | null>(null);
  const [activeFont, setActiveFont] = useState(0);
  const [activeBg, setActiveBg] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result as string);
        setIsExpanded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeCommand = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const handlePost = () => {
    if (!editorRef.current?.innerText.trim() && !media) return;

    const newPost = {
      id: Date.now(),
      user: currentUser,
      time: 'Agora',
      content: editorRef.current?.innerHTML || '',
      image: media,
      likes: 0,
      comments: 0,
      shares: 0,
      style: {
        font: FONTS[activeFont].class,
        background: BACKGROUNDS[activeBg],
        color: activeBg === 4 ? 'text-white' : TEXT_COLORS[activeColor] // Force white text on dark bg
      }
    };

    onPost(newPost);
    
    // Reset
    if (editorRef.current) editorRef.current.innerHTML = '';
    setMedia(null);
    setIsExpanded(false);
    setActiveBg(0);
    setActiveFont(0);
    setActiveColor(0);
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm mb-2">
      {!isExpanded ? (
        <div className="p-4">
          <div className="flex gap-3 mb-4">
            <img src={currentUser.avatar} alt="Me" className="w-10 h-10 rounded-full" />
            <div 
              onClick={() => setIsExpanded(true)}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-gray-500 cursor-text hover:bg-gray-200 transition-colors"
            >
              No que você está pensando?
            </div>
          </div>
          <div className="flex justify-between px-2">
            <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <Type size={20} className="text-indigo-500" />
              <span className="text-xs font-medium">Texto</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <ImageIcon size={20} className="text-green-500" />
              <span className="text-xs font-medium">Galeria</span>
            </button>
            <button onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <Camera size={20} className="text-blue-500" />
              <span className="text-xs font-medium">Câmera</span>
            </button>
            <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <Mic size={20} className="text-red-500" />
              <span className="text-xs font-medium">Áudio</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col animate-in slide-in-from-top-2 duration-200 ${BACKGROUNDS[activeBg]} transition-colors duration-300 min-h-[300px]`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-black/5">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-black/5 rounded-full">
                <X size={24} className={activeBg === 4 ? 'text-white' : 'text-gray-600'} />
              </button>
              <span className={`font-semibold ${activeBg === 4 ? 'text-white' : 'text-gray-900'}`}>Criar Publicação</span>
            </div>
            <button 
              onClick={handlePost}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              Publicar <Send size={16} />
            </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-4">
            <div 
              ref={editorRef}
              contentEditable
              className={`w-full min-h-[150px] outline-none text-lg ${FONTS[activeFont].class} ${activeBg === 4 ? 'text-white' : TEXT_COLORS[activeColor]} placeholder:text-gray-400`}
              data-placeholder="Compartilhe sua fé..."
            />
            
            {media && (
              <div className="relative mt-4 rounded-xl overflow-hidden shadow-sm group">
                <img src={media} alt="Upload" className="max-h-80 w-full object-cover" />
                <button 
                  onClick={() => setMedia(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            {/* Recording UI Placeholder */}
            {isRecording && (
               <div className="mt-4 flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-lg animate-pulse">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-sm font-medium">Gravando áudio... 00:04</span>
                  <button onClick={() => setIsRecording(false)} className="ml-auto text-xs underline">Cancelar</button>
               </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="p-3 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            {/* Formatting */}
            <div className="flex items-center justify-between mb-3 overflow-x-auto pb-2 no-scrollbar gap-4">
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <ToolbarBtn onClick={() => executeCommand('bold')} icon={<Bold size={18} />} />
                <ToolbarBtn onClick={() => executeCommand('italic')} icon={<Italic size={18} />} />
                <ToolbarBtn onClick={() => executeCommand('underline')} icon={<Underline size={18} />} />
              </div>
              
              <div className="flex items-center gap-2">
                {TEXT_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveColor(i)}
                    className={`w-6 h-6 rounded-full border border-gray-200 ${c.replace('text', 'bg')} ${activeColor === i ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Tools */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  {BACKGROUNDS.map((bg, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveBg(i)}
                      className={`w-8 h-8 rounded-full border-2 border-white shadow-sm ${bg} ${activeBg === i ? 'transform -translate-y-1 z-10' : 'opacity-70'}`}
                    />
                  ))}
                </div>
                <div className="h-6 w-px bg-gray-300 mx-1"></div>
                <button onClick={() => setActiveFont((prev) => (prev + 1) % FONTS.length)} className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 uppercase w-16 text-center">
                  {FONTS[activeFont].name}
                </button>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                  onMouseDown={() => setIsRecording(true)}
                  onMouseUp={() => setIsRecording(false)}
                  className={`p-2 rounded-full ${isRecording ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    <Mic size={24} />
                 </button>
                 <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <ImageIcon size={24} />
                 </button>
                 <button onClick={() => cameraInputRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <Camera size={24} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Inputs */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleMediaSelect} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleMediaSelect} />
    </div>
  );
};

const ToolbarBtn = ({ onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-white rounded-md transition-all"
  >
    {icon}
  </button>
);
