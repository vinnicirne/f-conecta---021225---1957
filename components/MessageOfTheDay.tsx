import React, { useState } from 'react';
import { Sparkles, X, Share2, Heart, MessageCircle } from 'lucide-react';

export const MessageOfTheDay: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="mb-6 sticky top-0 z-10 pt-2 pb-2 bg-slate-50/95 backdrop-blur-sm">
        <div 
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg cursor-pointer transform transition-all hover:scale-[1.01] hover:shadow-xl relative overflow-hidden group"
        >
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-blue-100 text-sm font-medium uppercase tracking-wider">
              <Sparkles size={16} className="text-yellow-300" />
              Mensagem do Dia
            </div>
            <h2 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:underline decoration-white/30 underline-offset-4">
              "A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos."
            </h2>
            <p className="text-blue-100 text-sm font-medium">Hebreus 11:1 • Toque para refletir</p>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsExpanded(false)}
          />
          
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full z-20 backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header Image/Gradient */}
            <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center relative">
                 <div className="text-center p-6 text-white">
                    <Sparkles size={48} className="mx-auto mb-4 text-yellow-300 opacity-80" />
                    <span className="uppercase tracking-[0.2em] text-xs font-bold opacity-70">Devocional Diário</span>
                 </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">A Certeza do Invisível</h2>
              <div className="prose prose-slate prose-lg mx-auto text-slate-600 leading-relaxed mb-8">
                <p>
                  Muitas vezes, buscamos provas tangíveis antes de dar o próximo passo. Mas a jornada espiritual funciona de maneira inversa: primeiro cremos, depois vemos.
                </p>
                <p>
                  A fé não é um salto no escuro, mas um salto nos braços de Deus. Hoje, qual área da sua vida precisa dessa certeza inabalável? Não olhe para as circunstâncias, olhe para a Promessa.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex gap-4">
                  <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-red-500 transition-colors">
                    <div className="p-3 rounded-full bg-slate-50 hover:bg-red-50">
                        <Heart size={24} />
                    </div>
                    <span className="text-xs">Amém</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-blue-500 transition-colors">
                    <div className="p-3 rounded-full bg-slate-50 hover:bg-blue-50">
                        <MessageCircle size={24} />
                    </div>
                    <span className="text-xs">Comentar</span>
                  </button>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-1">
                  <Share2 size={18} /> Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};