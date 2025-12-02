import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { generateAIInsights } from '../services/geminiService';

const DEMOGRAPHICS_DATA = [
  { name: '18-24', value: 20 },
  { name: '25-34', value: 35 },
  { name: '35-44', value: 25 },
  { name: '45+', value: 20 },
];

const ENGAGEMENT_DATA = [
  { name: 'Seg', likes: 4000, comments: 2400 },
  { name: 'Ter', likes: 3000, comments: 1398 },
  { name: 'Qua', likes: 2000, comments: 9800 },
  { name: 'Qui', likes: 2780, comments: 3908 },
  { name: 'Sex', likes: 1890, comments: 4800 },
  { name: 'Sáb', likes: 2390, comments: 3800 },
  { name: 'Dom', likes: 3490, comments: 4300 },
];

const COLORS = ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'];

export const AnalyticsView: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerateInsights = async () => {
    setLoading(true);
    // Simulate formatting data for context
    const context = `
      Usuários Ativos: 12.345 (Crescimento de 12% MoM)
      Faixa etária principal: 25-34 anos (35%)
      Dia de maior engajamento: Domingo (devido a transmissões de cultos)
      Taxa de retenção: 68%
      Conteúdo mais reportado: Discurso político (não permitido nas regras da comunidade)
    `;
    
    const result = await generateAIInsights(context);
    setAiInsight(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Avançado</h1>
          <p className="text-slate-500">Métricas detalhadas de crescimento e comportamento.</p>
        </div>
        <button 
          onClick={handleGenerateInsights}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {loading ? 'Analisando...' : 'Gerar Insights com IA'}
        </button>
      </div>

      {/* AI Insights Section */}
      {aiInsight && (
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-6 rounded-xl animate-fade-in relative">
            <div className="absolute top-4 right-4 text-indigo-200">
                <Sparkles size={48} strokeWidth={1} />
            </div>
            <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-600"/>
                Análise Inteligente
            </h3>
            <div className="prose prose-indigo text-slate-700 text-sm max-w-none whitespace-pre-line">
                {aiInsight}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Engajamento Semanal</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENGAGEMENT_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="likes" name="Curtidas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" name="Comentários" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics Pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Demografia da Comunidade</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEMOGRAPHICS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DEMOGRAPHICS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
             {DEMOGRAPHICS_DATA.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2 text-xs text-slate-500">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                     {entry.name}
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
