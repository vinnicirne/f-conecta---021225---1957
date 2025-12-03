import React, { useState } from 'react';
import { AlertTriangle, Check, X, Ban, MessageCircle, Image as ImageIcon, Flag } from 'lucide-react';

const MOCK_REPORTS = [
  { 
    id: 101, 
    type: 'Comment', 
    reporter: 'Maria Silva', 
    reportedUser: 'User_X99', 
    reason: 'Discurso de ódio', 
    content: 'Este comentário contém palavras ofensivas que violam as regras da comunidade.', 
    time: 'Há 10 min',
    severity: 'High'
  },
  { 
    id: 102, 
    type: 'Post', 
    reporter: 'João Santos', 
    reportedUser: 'FakeNewsBot', 
    reason: 'Spam / Propaganda', 
    content: 'Ganhe dinheiro rápido! Clique no link agora!!! [Link suspeito removido]', 
    time: 'Há 45 min',
    severity: 'Medium'
  },
  { 
    id: 103, 
    type: 'Image', 
    reporter: 'Ana B.', 
    reportedUser: 'Troll_01', 
    reason: 'Conteúdo Impróprio', 
    content: '[Imagem ocultada pelo filtro automático]', 
    time: 'Há 2 horas',
    severity: 'Critical'
  },
];

export const ModerationPanel: React.FC = () => {
  const [reports, setReports] = useState(MOCK_REPORTS);

  const handleAction = (id: number, action: string) => {
    // In a real app, this would call an API
    setReports(prev => prev.filter(r => r.id !== id));
    console.log(`Report ${id} action: ${action}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fe-900">Fila de Moderação</h1>
          <p className="text-fe-500 text-sm">Analise e resolva denúncias da comunidade.</p>
        </div>
        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-orange-100">
          <AlertTriangle size={18} />
          {reports.length} Pendentes
        </div>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center border border-fe-100">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-lg font-semibold text-fe-900">Tudo limpo!</h3>
            <p className="text-fe-500">Não há denúncias pendentes no momento.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-fe-200 overflow-hidden flex flex-col md:flex-row">
              
              {/* Severity Strip */}
              <div className={`w-full md:w-2 ${
                report.severity === 'Critical' ? 'bg-red-600' : 
                report.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-400'
              }`}></div>
              
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-fe-100 text-fe-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {report.type}
                    </span>
                    <span className="text-xs text-fe-400 font-mono">• {report.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                    <Flag size={12} />
                    {report.reason}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-fe-200"></div>
                    <span className="text-sm font-semibold text-fe-900">@{report.reportedUser}</span>
                  </div>
                  <div className="bg-fe-50 p-4 rounded-lg border border-fe-100 text-fe-700 text-sm leading-relaxed">
                    {report.content}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-fe-100">
                  <div className="text-xs text-fe-500">
                    Denunciado por <span className="font-medium text-fe-700">{report.reporter}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleAction(report.id, 'dismiss')}
                      className="px-4 py-2 text-sm font-medium text-fe-600 hover:bg-fe-100 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Check size={16} />
                      Manter
                    </button>
                    <button 
                      onClick={() => handleAction(report.id, 'remove')}
                      className="px-4 py-2 text-sm font-medium text-white bg-fe-primary hover:bg-fe-primaryHover rounded-lg transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Remover Conteúdo
                    </button>
                    <button 
                      onClick={() => handleAction(report.id, 'ban')}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 flex items-center gap-2"
                      title="Banir Usuário"
                    >
                      <Ban size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
