import React from 'react';
import { AlertTriangle, Check, X, Eye, Flag } from 'lucide-react';
import { Report } from '../types';

const MOCK_REPORTS: Report[] = [
  { id: '101', type: 'Discurso de Ódio', targetId: 'post-55', targetType: 'Post', reporter: 'João Santos', status: 'Pendente', date: '2023-10-25 14:30' },
  { id: '102', type: 'Spam', targetId: 'comment-23', targetType: 'Post', reporter: 'Maria Silva', status: 'Pendente', date: '2023-10-25 15:15' },
  { id: '103', type: 'Fake News', targetId: 'post-58', targetType: 'Post', reporter: 'Sistema (AI)', status: 'Em Análise', date: '2023-10-25 16:00' },
];

export const ModerationView: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Central de Moderação</h1>
            <p className="text-slate-500">Analise denúncias e mantenha a comunidade segura.</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>3 Pendentes</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 px-1">Fila de Denúncias</h2>
            {MOCK_REPORTS.map(report => (
                <div key={report.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                            report.type === 'Discurso de Ódio' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>{report.type}</span>
                        <span className="text-xs text-slate-400">{report.date.split(' ')[1]}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 mb-1">Tipo: {report.targetType}</p>
                    <p className="text-xs text-slate-500">Reportado por: {report.reporter}</p>
                </div>
            ))}
        </div>

        {/* Detailed Review Area */}
        <div className="lg:col-span-2">
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Flag size={16} className="text-red-500" />
                            Denúncia #101 - Discurso de Ódio
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">ID do Conteúdo: post-55</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">Pendente</span>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <img src="https://picsum.photos/40/40?10" className="w-8 h-8 rounded-full" alt="User" />
                            <div>
                                <p className="text-sm font-bold text-slate-900">Usuário Suspeito</p>
                                <p className="text-xs text-slate-400">Postado há 2 horas</p>
                            </div>
                        </div>
                        <p className="text-slate-800 mb-4">
                            [Conteúdo Oculto pelo Sistema] Este post contém palavras que violam as diretrizes da comunidade sobre respeito e amor ao próximo. O texto original sugeria intolerância religiosa contra grupo X.
                        </p>
                        {/* Mock Image Content */}
                         <div className="relative h-48 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                             <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-slate-600 font-medium flex items-center gap-2"><Eye size={16}/> Mídia Oculta</span>
                             </div>
                             <img src="https://picsum.photos/600/300" className="w-full h-full object-cover" alt="Content" />
                         </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="text-sm font-bold text-slate-700 mb-2">Histórico do Usuário</h4>
                        <div className="flex gap-4 text-sm">
                            <div className="flex flex-col">
                                <span className="text-slate-400 text-xs">Denúncias</span>
                                <span className="font-medium text-red-600">3 (últimos 30 dias)</span>
                            </div>
                             <div className="flex flex-col">
                                <span className="text-slate-400 text-xs">Posts Aprovados</span>
                                <span className="font-medium text-emerald-600">142</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">
                        Ignorar
                    </button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                        <X size={16} />
                        Remover Conteúdo
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm">
                        <Check size={16} />
                        Manter (Falso Positivo)
                    </button>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
