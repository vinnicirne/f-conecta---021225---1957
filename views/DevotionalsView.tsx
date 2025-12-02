import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Users, 
  ChevronRight, 
  ArrowLeft,
  Bell,
  BellOff,
  MessageSquare,
  Share2,
  Heart,
  BadgeCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudyPlan } from '../types';

export const DevotionalsView: React.FC = () => {
  const { studyPlans, userPlanProgress, subscribeToPlan, completePlanDay, togglePlanReminder } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const getProgress = (planId: string) => {
    return userPlanProgress.find(p => p.planId === planId);
  };

  // Views Logic
  const renderPlanCatalog = () => (
    <div className="space-y-8 pb-20 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Planos e Devocionais</h1>
        <p className="text-slate-500">Cultive o hábito de estar na presença de Deus.</p>
      </div>

      {/* Featured Section */}
      <div className="relative h-64 rounded-2xl overflow-hidden shadow-md group cursor-pointer" onClick={() => setSelectedPlan(studyPlans[0])}>
        <img src={studyPlans[0].coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Featured" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Destaque da Semana</span>
            <h2 className="text-3xl font-bold mb-1">{studyPlans[0].title}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-200">
                <span className="flex items-center gap-1"><Users size={16}/> {studyPlans[0].subscribers} inscritos</span>
                <span className="flex items-center gap-1"><Calendar size={16}/> {studyPlans[0].totalDays} dias</span>
            </div>
        </div>
      </div>

      {/* Categories / Lists */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BadgeCheck className="text-blue-500" size={20} />
            Parceiros Verificados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studyPlans.map(plan => {
                const progress = getProgress(plan.id);
                return (
                    <div 
                        key={plan.id} 
                        onClick={() => setSelectedPlan(plan)}
                        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="w-1/3 relative">
                            <img src={plan.coverImage} className="w-full h-full object-cover" />
                            {progress && (
                                <div className="absolute bottom-0 left-0 w-full bg-black/50 h-1">
                                    <div 
                                        className="bg-emerald-400 h-full transition-all" 
                                        style={{ width: `${(progress.completedDays.length / plan.totalDays) * 100}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 w-2/3 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-slate-900 line-clamp-1">{plan.title}</h4>
                                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                    por {plan.authorName} 
                                    <BadgeCheck size={12} className="text-blue-500" />
                                </p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{plan.category}</span>
                                {progress ? (
                                    <span className="text-xs font-bold text-emerald-600">
                                        {Math.round((progress.completedDays.length / plan.totalDays) * 100)}%
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                        Começar <ChevronRight size={12}/>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );

  const renderPlanDetail = (plan: StudyPlan) => {
    const progress = getProgress(plan.id);
    const isSubscribed = !!progress;
    const completedCount = progress ? progress.completedDays.length : 0;
    const nextDay = progress ? Math.min(Math.max(...(progress.completedDays.length ? progress.completedDays : [0])) + 1, plan.totalDays) : 1;

    return (
        <div className="animate-in slide-in-from-right-4">
            <button 
                onClick={() => setSelectedPlan(null)}
                className="mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft size={20} /> Voltar para Planos
            </button>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <img src={plan.coverImage} className="w-32 h-32 rounded-lg object-cover shadow-md" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">{plan.title}</h1>
                                <p className="text-slate-600 mb-4">{plan.description}</p>
                             </div>
                             {isSubscribed && (
                                 <button 
                                    onClick={() => togglePlanReminder(plan.id)}
                                    className={`p-2 rounded-full ${progress.remindersEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
                                    title="Lembretes Diários"
                                 >
                                     {progress.remindersEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                                 </button>
                             )}
                        </div>
                        
                        {!isSubscribed ? (
                            <button 
                                onClick={() => subscribeToPlan(plan.id)}
                                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                            >
                                Iniciar Plano
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-600">Seu Progresso</span>
                                    <span className="text-blue-600">{completedCount}/{plan.totalDays} dias</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                        style={{ width: `${(completedCount / plan.totalDays) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Curriculum */}
            <h3 className="text-lg font-bold text-slate-800 mb-4">Cronograma</h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-50">
                {plan.days.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">Conteúdo do plano sendo carregado...</div>
                ) : (
                    Array.from({ length: plan.totalDays }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dayData = plan.days.find(d => d.dayNumber === dayNum);
                        const isDone = progress?.completedDays.includes(dayNum);
                        const isLocked = isSubscribed ? false : dayNum !== 1; // Demo: only day 1 unlocked if not subbed

                        return (
                            <div 
                                key={dayNum} 
                                className={`p-4 flex items-center justify-between ${isLocked ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50 cursor-pointer'}`}
                                onClick={() => {
                                    if(!isSubscribed) subscribeToPlan(plan.id);
                                    setActiveDay(dayNum);
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2
                                        ${isDone ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 
                                          dayNum === nextDay ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-400'}
                                    `}>
                                        {isDone ? <CheckCircle size={16} /> : dayNum}
                                    </div>
                                    <div>
                                        <h4 className={`font-medium ${isDone ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                            {dayData ? dayData.title : `Dia ${dayNum}`}
                                        </h4>
                                        {dayData && <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10}/> 5 min</p>}
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-slate-300" />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
  };

  const renderReadingMode = () => {
    if (!selectedPlan || activeDay === null) return null;
    const dayData = selectedPlan.days.find(d => d.dayNumber === activeDay);
    if (!dayData) return <div className="p-4">Conteúdo não encontrado.</div>;

    const progress = getProgress(selectedPlan.id);
    const isCompleted = progress?.completedDays.includes(activeDay);

    return (
        <div className="animate-in slide-in-from-bottom-8 bg-white min-h-screen -m-4 sm:-m-6 lg:-m-8 z-50 relative pb-20">
            {/* Reading Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-4 flex items-center justify-between z-10">
                <button 
                    onClick={() => setActiveDay(null)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-600"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dia {activeDay} de {selectedPlan.totalDays}</p>
                    <h3 className="font-bold text-slate-800">{selectedPlan.title}</h3>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                    <Share2 size={24} />
                </button>
            </div>

            {/* Reading Content */}
            <div className="max-w-2xl mx-auto p-6 md:p-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-6 text-center">{dayData.title}</h1>
                
                {dayData.bibleReference && (
                    <div className="bg-slate-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 italic text-slate-700 font-serif text-lg">
                        "{dayData.verseText || 'Versículo indisponível na demonstração.'}"
                        <span className="block text-right text-sm font-sans font-bold text-slate-900 mt-2 not-italic">
                            — {dayData.bibleReference}
                        </span>
                    </div>
                )}

                <div className="prose prose-lg prose-slate mx-auto leading-loose text-slate-700">
                    <p>{dayData.content}</p>
                    <p>Deus nos chama para um lugar de confiança. Quando abrimos mão do nosso desejo de controlar cada detalhe, damos espaço para Ele agir. A paz não é a ausência de problemas, é a presença de Deus no meio deles.</p>
                </div>

                {/* Action Footer */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                    {!isCompleted ? (
                        <button 
                            onClick={() => completePlanDay(selectedPlan.id, activeDay)}
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-full font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={24} /> Concluir Leitura do Dia
                        </button>
                    ) : (
                        <div className="text-emerald-600 font-bold flex items-center gap-2 bg-emerald-50 px-6 py-3 rounded-full">
                            <CheckCircle size={20} /> Leitura Concluída!
                        </div>
                    )}
                </div>

                {/* Group Study / Comments */}
                <div className="mt-16">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                        <MessageSquare size={20} className="text-blue-500" /> 
                        Grupo de Estudo ({activeDay})
                    </h3>
                    
                    {/* Fake Comment Input */}
                    <div className="flex gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                             {/* User avatar placeholder */}
                        </div>
                        <div className="flex-1">
                            <textarea 
                                placeholder="O que você aprendeu hoje? Compartilhe com o grupo..." 
                                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                            ></textarea>
                            <div className="flex justify-end mt-2">
                                <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium">Publicar</button>
                            </div>
                        </div>
                    </div>

                    {/* Mock Comments */}
                    <div className="space-y-6">
                        <div className="flex gap-3">
                            <img src="https://ui-avatars.com/api/?name=Julia&background=random" className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none">
                                    <p className="text-xs font-bold text-slate-900 mb-1">Julia Martins</p>
                                    <p className="text-sm text-slate-700">Exatamente o que eu precisava ler hoje. Estava tão preocupada com o trabalho, mas esse versículo me trouxe paz.</p>
                                </div>
                                <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-slate-400 font-medium">
                                    <span>2 horas atrás</span>
                                    <button className="hover:text-blue-600">Responder</button>
                                    <button className="flex items-center gap-1 hover:text-red-500"><Heart size={12}/> 5</button>
                                </div>
                            </div>
                        </div>
                         <div className="flex gap-3">
                            <img src="https://ui-avatars.com/api/?name=Carlos&background=random" className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none">
                                    <p className="text-xs font-bold text-slate-900 mb-1">Carlos Oliveira</p>
                                    <p className="text-sm text-slate-700">Amém! Entregar o controle é difícil, mas é libertador.</p>
                                </div>
                                <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-slate-400 font-medium">
                                    <span>4 horas atrás</span>
                                    <button className="hover:text-blue-600">Responder</button>
                                    <button className="flex items-center gap-1 hover:text-red-500"><Heart size={12}/> 12</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  if (activeDay !== null) return renderReadingMode();
  if (selectedPlan) return renderPlanDetail(selectedPlan);
  return renderPlanCatalog();
};