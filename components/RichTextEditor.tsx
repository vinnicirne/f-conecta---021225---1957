
import React from 'react';
import { PostStyles, FontOption } from '../types';

interface RichTextEditorProps {
  content: string;
  setContent: (val: string) => void;
  styles: PostStyles;
  setStyles: (styles: PostStyles) => void;
  onPost: () => void;
  onCancel: () => void;
}

const FONTS: { label: string; value: FontOption; class: string }[] = [
  { label: 'Padrão', value: 'sans', class: 'font-sans' },
  { label: 'Serifa', value: 'serif', class: 'font-serif' },
  { label: 'Mono', value: 'mono', class: 'font-mono' },
  { label: 'Manuscrita', value: 'script', class: 'font-script' },
  { label: 'Destaque', value: 'display', class: 'font-display' },
];

const COLORS = [
  '#1a1a1a', '#ffffff', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'
];

const BACKGROUNDS = [
  { label: 'Puro', value: '#ffffff' },
  { label: 'Noite', value: '#1a1a1a' },
  { label: 'Céu', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: 'Pôr do Sol', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  { label: 'Oceano', value: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { label: 'Floresta', value: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, setContent, styles, setStyles, onPost, onCancel }) => {
  const toggleStyle = (key: keyof Pick<PostStyles, 'bold' | 'italic' | 'underline' | 'highlight'>) => {
    setStyles({ ...styles, [key]: !styles[key] });
  };

  const getPreviewClasses = () => {
    let classes = `w-full min-h-[150px] p-6 rounded-xl transition-all duration-300 flex items-center justify-center text-center text-lg `;
    classes += styles.font === 'serif' ? 'font-serif ' : 
               styles.font === 'mono' ? 'font-mono ' : 
               styles.font === 'script' ? 'font-script text-3xl ' : 
               styles.font === 'display' ? 'font-display uppercase tracking-wider ' : 'font-sans ';
    
    if (styles.bold) classes += 'font-bold ';
    if (styles.italic) classes += 'italic ';
    if (styles.underline) classes += 'underline ';
    
    return classes;
  };

  const textStyle = {
    color: styles.textColor,
    backgroundColor: styles.highlight ? '#fef08a' : 'transparent',
    padding: styles.highlight ? '0 4px' : '0'
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => toggleStyle('bold')}
            className={`p-1.5 rounded ${styles.bold ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
          ><b>B</b></button>
          <button 
            onClick={() => toggleStyle('italic')}
            className={`p-1.5 rounded ${styles.italic ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
          ><i>I</i></button>
          <button 
            onClick={() => toggleStyle('underline')}
            className={`p-1.5 rounded ${styles.underline ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
          ><u>U</u></button>
          <button 
            onClick={() => toggleStyle('highlight')}
            className={`p-1.5 rounded ${styles.highlight ? 'bg-yellow-200 text-black' : 'text-gray-600'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
          </button>
        </div>

        <select 
          value={styles.font}
          onChange={(e) => setStyles({ ...styles, font: e.target.value as FontOption })}
          className="bg-gray-100 border-none rounded-lg px-2 text-sm focus:ring-0"
        >
          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        <div className="flex space-x-1 items-center px-2 bg-gray-100 rounded-lg">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setStyles({ ...styles, textColor: c })}
              className={`w-4 h-4 rounded-full border border-gray-300 ${styles.textColor === c ? 'ring-2 ring-blue-400' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div 
        className={getPreviewClasses()}
        style={{ 
          background: styles.backgroundColor,
          boxShadow: styles.backgroundColor === '#ffffff' ? 'none' : 'inset 0 0 100px rgba(0,0,0,0.1)'
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva algo inspirador..."
          className="w-full bg-transparent border-none focus:ring-0 text-center resize-none placeholder-gray-400/50"
          style={textStyle}
          autoFocus
        />
      </div>

      {/* Background Options */}
      <div className="flex flex-wrap gap-2">
        {BACKGROUNDS.map(bg => (
          <button
            key={bg.value}
            onClick={() => setStyles({ ...styles, backgroundColor: bg.value })}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${styles.backgroundColor === bg.value ? 'border-blue-500 scale-105 shadow-sm' : 'border-gray-200 text-gray-600'}`}
            style={{ background: bg.value, color: bg.value === '#1a1a1a' ? 'white' : 'inherit' }}
          >
            {bg.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button 
          onClick={onCancel}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
        >
          Cancelar
        </button>
        <button 
          onClick={onPost}
          disabled={!content.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
        >
          Publicar
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;
