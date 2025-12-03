import React, { useState } from 'react';
import { Share2, MessageCircle, Heart, X, Maximize2, Quote } from 'lucide-react';

export const MessageOfTheDay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const message = {
    title: "Palavra do Dia",
    verse: "Tudo posso naquele que me fortalece.",
    reference: "Filipenses 4:13",
    devotional: "Não importa o tamanho do desafio que você enfrenta hoje, lembre-se que sua força não vem de si mesmo, mas Daquele que criou o universo. Em momentos de fraqueza, a graça d'Ele nos basta. Respire fundo, ore e avance com confiança.",
    author: "FéConecta Devocionais",
    image: "https://images.unsplash.com/photo-1507692049790-de58293a469d?q=80&w=1000&auto=format&fit=crop"
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mensagem do Dia - FéConecta',
          text: `${message.verse} - ${message.reference}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <>
      {/* Card Compacto (No Feed) */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group transform transition-all hover:scale-[1.01] active:scale-95"
      >
        <div className="absolute inset-0">
          <img src={message.image} alt="Background" className="w-full h-full object-cover brightness-75 group-hover:brightness-50 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>

        <div className="relative p-6 text-white flex flex-col items-center text-center h-48 justify-end">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-1.5 rounded-full">
            <Maximize2 size={16} className="text-white" />
          </div>
          
          <span className="uppercase tracking-widest text-[10px] font-bold bg-indigo-500/80 px-2 py-1 rounded mb-3 backdrop-blur-md">
            {message.title}
          </span>
          
          <h2 className="text-xl font-serif font-medium leading-tight mb-2">
            "{message.verse}"
          </h2>
          <p className="text-sm font-medium text-gray-200">{message.reference}</p>
        </div>
      </div>

      {/* Modal Expandido */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-300">
            
            {/* Header Image */}
            <div className="relative h-56 shrink-0">
              <img src={message.image} alt="Devotional" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-center -mt-12 mb-4">
                <div className="bg-white p-3 rounded-full shadow-lg">
                  <Quote size={24} className="text-indigo-600 fill-current" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif text-gray-900 mb-1 leading-snug">
                  "{message.verse}"
                </h2>
                <p className="text-indigo-600 font-semibold">{message.reference}</p>
              </div>

              <div className="prose prose-sm text-gray-600 leading-relaxed mb-8 text-justify">
                <p>{message.devotional}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <Heart size={24} className={liked ? 'fill-current' : ''} />
                    <span className="text-xs font-medium">{liked ? 'Amém!' : 'Amém'}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors">
                    <MessageCircle size={24} />
                    <span className="text-xs font-medium">Comentar</span>
                  </button>
                </div>
                
                <button 
                  onClick={handleShare}
                  className="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};