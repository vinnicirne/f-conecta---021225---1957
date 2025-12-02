import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Tag, Lock, Globe, Trash2, X, BookOpen, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Note } from '../types';

export const NotesView: React.FC = () => {
  const { notes, addNote, deleteNote, selectedVerseForNote, setSelectedVerseForNote } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  // Initialize with verse if coming from Bible
  useEffect(() => {
    if (selectedVerseForNote) {
      setIsEditing(true);
      setTitle(`Reflexão: ${selectedVerseForNote.book} ${selectedVerseForNote.chapter}`);
      // Don't auto-fill content, let user write, but show the verse card
    }
  }, [selectedVerseForNote]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      isPrivate,
      linkedVerse: selectedVerseForNote || undefined
    };

    addNote(newNote);
    resetForm();
  };

  const resetForm = () => {
    setIsEditing(false);
    setTitle('');
    setContent('');
    setTags('');
    setIsPrivate(true);
    setSelectedVerseForNote(null);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Nova Nota</h2>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100">
                <X size={24} />
            </button>
         </div>

         <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
             {selectedVerseForNote && (
                 <div className="bg-blue-50 p-4 border-b border-blue-100 flex gap-3">
                     <div className="p-2 bg-white rounded-lg h-fit text-blue-600 shadow-sm">
                         <BookOpen size={20} />
                     </div>
                     <div>
                         <p className="text-sm font-bold text-blue-900 mb-1">
                             {selectedVerseForNote.book} {selectedVerseForNote.chapter}:{selectedVerseForNote.verse}
                         </p>
                         <p className="text-sm text-blue-800 italic">"{selectedVerseForNote.text}"</p>
                     </div>
                 </div>
             )}

             <div className="p-6 space-y-4">
                 <input 
                    type="text" 
                    placeholder="Título da sua reflexão..."
                    className="w-full text-xl font-bold placeholder:text-slate-300 border-none focus:outline-none focus:ring-0 text-slate-900"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                 />
                 
                 <div className="h-px bg-slate-100 w-full"></div>

                 <textarea 
                    placeholder="Escreva seus pensamentos, orações ou estudos..."
                    className="w-full h-64 resize-none border-none focus:outline-none focus:ring-0 text-slate-600 leading-relaxed text-lg"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                 />

                 <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                     <div className="flex-1 relative">
                         <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                         <input 
                            type="text" 
                            placeholder="Tags (separadas por vírgula)"
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                         />
                     </div>
                     <button 
                        onClick={() => setIsPrivate(!isPrivate)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPrivate ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}
                     >
                         {isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                         {isPrivate ? 'Privado' : 'Público'}
                     </button>
                 </div>
             </div>
             
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                 <button 
                    onClick={handleSave}
                    disabled={!title || !content}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     <Save size={18} /> Salvar Nota
                 </button>
             </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Diário Espiritual</h1>
           <p className="text-slate-500">Suas reflexões e estudos pessoais.</p>
        </div>
        <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-200"
        >
            <Plus size={18} /> Nova Nota
        </button>
      </div>

      {/* Search */}
      <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar em suas notas..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400">
                  <BookOpen size={48} className="mx-auto mb-2 opacity-20" />
                  <p>Você ainda não tem notas. Comece escrevendo hoje!</p>
              </div>
          ) : (
            filteredNotes.map(note => (
                <div key={note.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition-all group flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar size={14} />
                            {new Date(note.date).toLocaleDateString('pt-BR')}
                            {note.isPrivate ? <Lock size={12} className="ml-2 text-slate-300" /> : <Globe size={12} className="ml-2 text-emerald-400" />}
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{note.title}</h3>
                    
                    {note.linkedVerse && (
                        <div className="bg-blue-50 p-2 rounded-lg text-xs text-blue-800 mb-3 italic border border-blue-100">
                            📖 {note.linkedVerse.book} {note.linkedVerse.chapter}:{note.linkedVerse.verse}
                        </div>
                    )}

                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">{note.content}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {note.tags.map(tag => (
                            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">#{tag}</span>
                        ))}
                    </div>
                </div>
            ))
          )}
      </div>
    </div>
  );
};