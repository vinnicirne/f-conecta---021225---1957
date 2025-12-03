import React, { useState } from 'react';
import { generateCommunityInsights } from '../services/geminiService';
import { INITIAL_METRICS, GROWTH_DATA } from '../constants';
import { Sparkles, Loader2, FileText } from 'lucide-react';

export const AnalyticsAI: React.FC = () => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    // Combine data to send to AI
    const dataContext = {
      currentMetrics: INITIAL_METRICS,
      growthHistory: GROWTH_DATA.slice(-3) // Last 3 months
    };
    
    const result = await generateCommunityInsights(dataContext);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              Inteligência de Fé
            </h2>
            <p className="text-brand-100 text-lg mb-6">
              Use nossa inteligência artificial para identificar tendências espirituais, 
              prever engajamento e obter recomendações personalizadas para o crescimento da comunidade.
            </p>
            <button 
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-white text-brand-700 hover:bg-brand-50 font-bold py-3 px-6 rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando Relatório...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Gerar Relatório Executivo
                </>
              )}
            </button>
          </div>
          <div className="hidden lg:block opacity-20">
            <Sparkles className="w-48 h-48" />
          </div>
        </div>
      </div>

      {/* Result Area */}
      {insight && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-fade-in">
          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Relatório de Insights da Comunidade</h3>
          <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {insight}
          </div>
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end text-sm text-gray-400 italic">
            Gerado por Gemini AI • Apenas para uso interno
          </div>
        </div>
      )}

      {/* Placeholder for future trends chart if needed */}
      {!insight && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              1
            </div>
            <h4 className="font-semibold text-gray-900">Análise de Sentimento</h4>
            <p className="text-sm text-gray-500 mt-2">Monitore a saúde emocional e espiritual da comunidade em tempo real.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
              2
            </div>
            <h4 className="font-semibold text-gray-900">Tendências de Tópicos</h4>
            <p className="text-sm text-gray-500 mt-2">Descubra quais temas bíblicos ou sociais estão gerando mais debate.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
              3
            </div>
            <h4 className="font-semibold text-gray-900">Previsão de Retenção</h4>
            <p className="text-sm text-gray-500 mt-2">Identifique usuários em risco de churn antes que eles saiam.</p>
          </div>
        </div>
      )}
    </div>
  );
};