import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Edit3, 
  PenTool, 
  Bookmark,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BibleVerse } from '../types';

// Mock Bible Content to simulate API
const MOCK_BIBLE_CONTENT: Record<string, any> = {
  'Salmos': {
    23: [
      "O Senhor é o meu pastor, nada me faltará.",
      "Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.",
      "Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.",
      "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
      "Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.",
      "Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias."
    ]
  },
  'João': {
    3: [
        "E havia entre os fariseus um homem, chamado Nicodemos, príncipe dos judeus.",
        "Este foi ter de noite com Jesus, e disse-lhe: Rabi, bem sabemos que és Mestre, vindo de Deus; porque ninguém pode fazer estes sinais que tu fazes, se Deus não for com ele.",
        "Jesus respondeu, e disse-lhe: Na verdade, na verdade te digo que aquele que não nascer de novo, não pode ver o reino de Deus.",
        "Disse-lhe Nicodemos: Como pode um homem nascer, sendo velho? Pode, porventura, tornar a entrar no ventre de sua mãe, e nascer?",
        "Jesus respondeu: Na verdade, na verdade te digo que aquele que não nascer da água e do Espírito, não pode entrar no reino de Deus.",
        "O que é nascido da carne é carne, e o que é nascido do Espírito é espírito.",
        "Não te maravilhes de te ter dito: Necessário vos é nascer de novo.",
        "O vento assopra onde quer, e ouves a sua voz, mas não sabes de onde vem, nem para onde vai; assim é todo aquele que é nascido do Espírito.",
        "Nicodemos respondeu, e disse-lhe: Como pode ser isso?",
        "Jesus respondeu, e disse-lhe: Tu és mestre de Israel, e não sabes isto?",
        "Na verdade, na verdade te digo que nós dizemos o que sabemos, e testificamos o que vimos; e não aceitais o nosso testemunho.",
        "Se vos falei de coisas terrestres, e não crestes, como crereis, se vos falar das celestiais?",
        "Ora, ninguém subiu ao céu, senão o que desceu do céu, o Filho do homem, que está no céu.",
        "E, como Moisés levantou a serpente no deserto, assim importa que o Filho do homem seja levantado;",
        "Para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
        "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
    ]
  },
  'Gênesis': {
    1: [
      "No princípio criou Deus o céu e a terra.",
      "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.",
      "E disse Deus: Haja luz; e houve luz.",
      "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas."
    ]
  }
};

const VERSIONS = ['NVI - Nova Versão Internacional', 'ACF - Almeida Corrigida Fiel', 'NTLH - Nova Tradução'];

interface BibleViewProps {
  onChangeView: (view: string) => void;
}

// We need to pass the view switcher to this component to allow navigation to Feed/Notes
// Since the main view logic is in App.tsx, we can't easily pass props down without prop drilling.
// HACK: We will trigger a window event or use a global state approach, but for now let's assume 
// the user manually navigates or we extend the context.
// BETTER: The Sidebar handles view switching. Let's make a wrapper in App.tsx to pass the setter?
// ACTUALLY: I will modify App.tsx to pass the setter or use a custom event. 
// For this strict prompt, I'll rely on the context being updated, but context doesn't have `setCurrentView`.
// I will dispatch a custom event that App.tsx listens to, or better, keep it simple: 
// The prompt asked for "Create Post" to open the new post screen. I'll rely on the user navigating 
// to the feed, but the best UX is auto-navigation.
// I will add a `navigateTo` function to the window object for this demo or just show an alert instructing the user.

export const BibleView: React.FC = () => {
  const { setDraftPost, setSelectedVerseForNote } = useApp();
  const [selectedBook, setSelectedBook] = useState('Salmos');
  const [selectedChapter, setSelectedChapter] = useState(23);
  const [selectedVersion, setSelectedVersion] = useState(VERSIONS[0]);
  const [highlightedVerses, setHighlightedVerses] = useState<number[]>([]);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState<number | null>(null);

  const currentVerses: string[] = MOCK_BIBLE_CONTENT[selectedBook]?.[selectedChapter] || ["Conteúdo não disponível nesta demonstração."];

  const handleVerseClick = (index: number) => {
    setSelectedVerseIndex(selectedVerseIndex === index ? null : index);
  };

  const handleHighlight = () => {
    if (selectedVerseIndex === null) return;
    if (highlightedVerses.includes(selectedVerseIndex)) {
        setHighlightedVerses(prev => prev.filter(v => v !== selectedVerseIndex));
    } else {
        setHighlightedVerses(prev => [...prev, selectedVerseIndex]);
    }
    setSelectedVerseIndex(null);
  };

  const handleCreateNote = () => {
    if (selectedVerseIndex === null) return;
    const verseText = currentVerses[selectedVerseIndex];
    const verseRef: BibleVerse = {
        book: selectedBook,
        chapter: selectedChapter,
        verse: selectedVerseIndex + 1,
        text: verseText,
        version: selectedVersion.split(' - ')[0]
    };
    setSelectedVerseForNote(verseRef);
    // Simulating navigation (In a real app, use router)
    const event = new CustomEvent('navigate', { detail: 'notes' });
    window.dispatchEvent(event);
  };

  const handleCreatePost = () => {
    if (selectedVerseIndex === null) return;
    const verseText = currentVerses[selectedVerseIndex];
    setDraftPost({
        content: `"${verseText}"\n\n— ${selectedBook} ${selectedChapter}:${selectedVerseIndex + 1}`,
        style: {
            fontFamily: 'font-serif',
            isItalic: true,
            backgroundColor: 'bg-gradient-to-br from-orange-100 to-yellow-100'
        }
    });
    // Simulating navigation
    const event = new CustomEvent('navigate', { detail: 'feed' });
    window.dispatchEvent(event);
  };

  return (
    <div className="pb-24 relative min-h-screen bg-white">
      {/* Header Controls */}
      <div className="bg-white sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <div className="p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
                <select 
                    value={selectedBook}
                    onChange={(e) => { setSelectedBook(e.target.value); setSelectedChapter(1); }}
                    className="appearance-none font-bold text-lg bg-transparent border-none focus:outline-none cursor-pointer"
                >
                    {Object.keys(MOCK_BIBLE_CONTENT).map(book => (
                        <option key={book} value={book}>{book}</option>
                    ))}
                </select>
                <ChevronDown size={16} className="text-slate-400" />
                
                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                <span className="text-lg font-medium text-slate-600">Cap.</span>
                <select 
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(Number(e.target.value))}
                    className="appearance-none font-bold text-lg bg-transparent border-none focus:outline-none cursor-pointer"
                >
                    {selectedBook === 'Salmos' && <option value={23}>23</option>}
                    {selectedBook === 'João' && <option value={3}>3</option>}
                    {selectedBook === 'Gênesis' && <option value={1}>1</option>}
                </select>
            </div>
            
            <div className="flex gap-2">
                 <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><ChevronLeft size={20}/></button>
                 <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><ChevronRight size={20}/></button>
            </div>
        </div>
        <div className="px-4 pb-2">
             <select 
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="text-xs text-slate-500 bg-slate-50 rounded px-2 py-1 border-none focus:outline-none w-full"
             >
                 {VERSIONS.map(v => <option key={v} value={v}>{v}</option>)}
             </select>
        </div>
      </div>

      {/* Bible Text */}
      <div className="p-6 max-w-2xl mx-auto">
         <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6 text-center">{selectedBook} {selectedChapter}</h2>
         <div className="space-y-4 font-serif text-lg leading-relaxed text-slate-800">
             {currentVerses.map((verse, index) => (
                 <p 
                    key={index}
                    onClick={() => handleVerseClick(index)}
                    className={`cursor-pointer transition-colors rounded px-2 py-1
                        ${selectedVerseIndex === index ? 'bg-blue-100 ring-2 ring-blue-200' : 'hover:bg-slate-50'}
                        ${highlightedVerses.includes(index) ? 'bg-yellow-100' : ''}
                    `}
                 >
                     <span className="text-xs font-sans text-slate-400 font-bold mr-2 select-none align-top pt-1">{index + 1}</span>
                     {verse}
                 </p>
             ))}
         </div>
      </div>

      {/* Floating Action Bar for Selected Verse */}
      {selectedVerseIndex !== null && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-30 animate-in slide-in-from-bottom-4">
              <button 
                onClick={handleHighlight}
                className="flex flex-col items-center gap-1 hover:text-yellow-400 transition-colors"
              >
                  <PenTool size={20} />
                  <span className="text-[10px] uppercase font-bold tracking-wide">Marcar</span>
              </button>
              <div className="w-px h-8 bg-slate-700"></div>
              <button 
                onClick={handleCreateNote}
                className="flex flex-col items-center gap-1 hover:text-blue-400 transition-colors"
              >
                  <Bookmark size={20} />
                  <span className="text-[10px] uppercase font-bold tracking-wide">Anotar</span>
              </button>
              <div className="w-px h-8 bg-slate-700"></div>
              <button 
                onClick={handleCreatePost}
                className="flex flex-col items-center gap-1 hover:text-emerald-400 transition-colors"
              >
                  <Edit3 size={20} />
                  <span className="text-[10px] uppercase font-bold tracking-wide">Postar</span>
              </button>
              <div className="w-px h-8 bg-slate-700"></div>
              <button className="flex flex-col items-center gap-1 hover:text-purple-400 transition-colors">
                  <Share2 size={20} />
                  <span className="text-[10px] uppercase font-bold tracking-wide">Enviar</span>
              </button>
          </div>
      )}
    </div>
  );
};