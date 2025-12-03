import React, { useState } from 'react';
import { MOCK_REPORTS } from '../constants';
import { ReportStatus } from '../types';
import { AlertCircle, CheckCircle, XCircle, BrainCircuit, Loader2 } from 'lucide-react';
import { analyzeSentiment } from '../services/geminiService';

export const ModerationPanel: React.FC = () => {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, { sentiment: string; score: number; suggestion: string }>>({});

  const handleAction = (id: string, action: 'resolve' | 'dismiss') => {
    setReports(reports.map(r => r.id === id ? { ...r, status: action === 'resolve' ? ReportStatus.RESOLVED : ReportStatus.DISMISSED } : r));
  };

  const handleAnalyze = async (id: string, text: string) => {
    setAnalyzingId(id);
    const result = await analyzeSentiment(text);
    setAiAnalysis(prev => ({ ...prev, [id]: result }));
    setAnalyzingId(null);
  };

  const pendingReports = reports.filter(r => r.status === ReportStatus.PENDING || r.status === ReportStatus.REVIEWING);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800">Moderação de Conteúdo</h2>
        <p className="text-gray-500">Gerencie denúncias e mantenha a comunidade segura.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingReports.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-green-800">Tudo limpo!</h3>
            <p className="text-green-600">Nenhuma denúncia pendente no momento.</p>
          </div>
        ) : (
          pendingReports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Content Side */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${report.severity === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                    `}>
                      {report.severity} Priority
                    </span>
                    <span className="text-sm text-gray-500">
                      Reportado por <strong>{report.reporterName}</strong> • {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-800 font-medium font-serif italic">"{report.targetContent}"</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    Motivo: <span className="font-semibold">{report.type.replace('_', ' ')}</span>
                  </div>

                  {/* AI Analysis Result */}
                  {aiAnalysis[report.id] && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100 text-sm">
                      <div className="flex items-center gap-2 mb-2 text-purple-800 font-semibold">
                        <BrainCircuit className="w-4 h-4" />
                        Análise da IA
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-purple-900">
                        <div>
                          <span className="block text-xs text-purple-500">Sentimento</span>
                          {aiAnalysis[report.id].sentiment}
                        </div>
                        <div>
                          <span className="block text-xs text-purple-500">Score (0-10)</span>
                          {aiAnalysis[report.id].score}
                        </div>
                        <div>
                          <span className="block text-xs text-purple-500">Sugestão</span>
                          {aiAnalysis[report.id].suggestion}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Side */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 lg:w-48 lg:border-l lg:pl-6 lg:border-gray-100">
                  <button 
                    onClick={() => handleAction(report.id, 'resolve')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    Remover
                  </button>
                  <button 
                    onClick={() => handleAction(report.id, 'dismiss')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Manter
                  </button>
                  
                  <div className="w-full h-px bg-gray-200 my-1 hidden lg:block"></div>

                  <button 
                    onClick={() => handleAnalyze(report.id, report.targetContent)}
                    disabled={analyzingId === report.id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    {analyzingId === report.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <BrainCircuit className="w-4 h-4" />
                    )}
                    Analisar com IA
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};