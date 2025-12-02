import React from 'react';
import { Users, FileText, MessageCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '../components/StatCard';

const data = [
  { name: 'Jan', users: 4000, interactions: 2400 },
  { name: 'Fev', users: 3000, interactions: 1398 },
  { name: 'Mar', users: 2000, interactions: 9800 },
  { name: 'Abr', users: 2780, interactions: 3908 },
  { name: 'Mai', users: 1890, interactions: 4800 },
  { name: 'Jun', users: 2390, interactions: 3800 },
  { name: 'Jul', users: 3490, interactions: 4300 },
];

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
          <p className="text-slate-500">Bem-vindo ao painel de controle da FéConecta.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Sistema Operacional
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Usuários Ativos" value="12,345" trend="12%" trendUp={true} icon={Users} colorClass="bg-blue-600" />
        <StatCard title="Novos Posts" value="1,230" trend="5%" trendUp={true} icon={FileText} colorClass="bg-indigo-500" />
        <StatCard title="Interações" value="45.2K" trend="8%" trendUp={true} icon={MessageCircle} colorClass="bg-violet-500" />
        <StatCard title="Denúncias Pendentes" value="15" trend="2%" trendUp={false} icon={AlertTriangle} colorClass="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Crescimento da Comunidade</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver Relatório Completo</button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts / Tasks Widget */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Atenção Necessária</h3>
            <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3">
                    <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                    <div>
                        <h4 className="text-sm font-semibold text-red-800">Surto de Denúncias</h4>
                        <p className="text-xs text-red-600 mt-1">3 posts sinalizados como "Fake News" na última hora.</p>
                    </div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
                    <TrendingUp className="text-amber-500 flex-shrink-0" size={20} />
                    <div>
                        <h4 className="text-sm font-semibold text-amber-800">Alta Carga</h4>
                        <p className="text-xs text-amber-600 mt-1">Servidor de mensagens com 85% de uso.</p>
                    </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                    <Users className="text-blue-500 flex-shrink-0" size={20} />
                    <div>
                        <h4 className="text-sm font-semibold text-blue-800">Novos Cadastros</h4>
                        <p className="text-xs text-blue-600 mt-1">150 novos membros aguardando aprovação manual.</p>
                    </div>
                </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm text-slate-600 font-medium bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                Ver Central de Notificações
            </button>
        </div>
      </div>
    </div>
  );
};
