import React, { useState } from 'react';
import { Users, Activity, MessageSquare, ArrowUp, AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { View } from '../App';

interface OverviewProps {
  onViewChange: (view: View) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onViewChange }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const generateAiReport = async () => {
    setLoadingAi(true);
    try {
      if (!process.env.API_KEY) {
        setAiAnalysis("Chave de API do Gemini não configurada. Configure a variável de ambiente para ver insights reais.");
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Atue como um analista de dados sênior para a rede social 'FéConecta'.
        Analise os seguintes dados simulados:
        - Total Usuários: 12.450 (+12% essa semana)
        - Usuários Ativos Diários: 8.200
        - Posts Diários: 3.500
        - Denúncias Pendentes: 5 (Baixo risco)
        
        Gere um relatório executivo curto (máximo 3 frases) com insights sobre o crescimento, sugestões para aumentar retenção e uma ação recomendada para a equipe de comunidade. Use formatação Markdown simples.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      setAiAnalysis(response.text || "Sem análise disponível.");
    } catch (e) {
      setAiAnalysis("Erro ao gerar análise de IA. Verifique a conexão.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-fe-900">Visão Geral</h1>
        <p className="text-fe-500 text-sm mt-1">Bem-vindo ao painel de controle do FéConecta.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total de Usuários" 
          value="12.450" 
          trend="+12%" 
          trendUp={true} 
          icon={<Users className="text-blue-600" size={24} />} 
          bg="bg-blue-50"
        />
        <KpiCard 
          title="Novos Cadastros" 
          value="148" 
          trend="+5.2%" 
          trendUp={true} 
          icon={<TrendingUp className="text-green-600" size={24} />} 
          bg="bg-green-50"
        />
        <KpiCard 
          title="Interações (24h)" 
          value="8.2k" 
          trend="-2.1%" 
          trendUp={false} 
          icon={<Activity className="text-purple-600" size={24} />} 
          bg="bg-purple-50"
        />
        <KpiCard 
          title="Denúncias" 
          value="5" 
          label="Pendentes"
          icon={<AlertTriangle className="text-orange-600" size={24} />} 
          bg="bg-orange-50"
          onClick={() => onViewChange(View.MODERATION)}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth Chart Area (Mock) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-fe-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-fe-800">Crescimento da Comunidade</h3>
            <select className="text-sm border border-fe-200 rounded-md px-2 py-1 text-fe-600 bg-transparent">
              <option>Últimos 30 dias</option>
              <option>Últimos 7 dias</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {[35, 42, 45, 40, 55, 60, 58, 65, 72, 68, 80, 85].map((h, i) => (
              <div key={i} className="w-full bg-fe-100 rounded-t-sm relative group overflow-hidden">
                <div 
                  style={{ height: `${h}%` }} 
                  className="absolute bottom-0 w-full bg-fe-primary opacity-80 group-hover:opacity-100 transition-all duration-300"
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-fe-400 font-mono">
            <span>01 Jan</span>
            <span>15 Jan</span>
            <span>30 Jan</span>
          </div>
        </div>

        {/* AI & Alerts */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-yellow-300" />
                <h3 className="font-semibold">FéConecta AI Insights</h3>
              </div>
              
              {!aiAnalysis ? (
                <div className="text-indigo-100 text-sm mb-6">
                  Utilize nossa IA para analisar padrões de engajamento e prever tendências da comunidade.
                </div>
              ) : (
                <div className="text-white text-sm mb-6 p-3 bg-white/10 rounded-lg leading-relaxed animate-in fade-in">
                  {aiAnalysis}
                </div>
              )}

              <button 
                onClick={generateAiReport}
                disabled={loadingAi}
                className="w-full bg-white text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                {loadingAi ? 'Analisando dados...' : 'Gerar Relatório IA'}
              </button>
            </div>
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-fe-100">
            <h3 className="font-semibold text-fe-800 mb-4">Status do Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-fe-600">Servidores</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">Operacional</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-fe-600">Banco de Dados</span>
                </div>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">Operacional</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-fe-600">Fila de Upload</span>
                </div>
                <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded">Alta demanda</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, trend, trendUp, icon, bg, label, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-sm border border-fe-100 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${bg}`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-medium flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
          {trendUp && <ArrowUp size={12} />}
        </span>
      )}
      {label && (
        <span className="text-xs font-medium text-fe-500 bg-fe-100 px-2 py-1 rounded">
          {label}
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-fe-900">{value}</h3>
    <p className="text-sm text-fe-500">{title}</p>
  </div>
);
