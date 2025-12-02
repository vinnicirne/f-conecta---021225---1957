import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Gift, 
  Download,
  Target,
  Users
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Transaction } from '../types';
import { StatCard } from '../components/StatCard';

const REVENUE_DATA = [
  { name: 'Jan', assinaturas: 12500, doacoes: 4000, anuncios: 1500 },
  { name: 'Fev', assinaturas: 13200, doacoes: 3800, anuncios: 2100 },
  { name: 'Mar', assinaturas: 14800, doacoes: 6200, anuncios: 2400 },
  { name: 'Abr', assinaturas: 15500, doacoes: 4500, anuncios: 2800 },
  { name: 'Mai', assinaturas: 16900, doacoes: 5100, anuncios: 3200 },
  { name: 'Jun', assinaturas: 18400, doacoes: 7800, anuncios: 3500 },
];

const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 't1', user: 'Igreja Batista Central', type: 'subscription', amount: 299.90, date: 'Hoje, 14:30', status: 'completed' },
  { id: 't2', user: 'Ana Paula Souza', type: 'donation', amount: 50.00, date: 'Hoje, 13:15', status: 'completed' },
  { id: 't3', user: 'Editora Vida', type: 'ad', amount: 1500.00, date: 'Ontem, 16:45', status: 'completed' },
  { id: 't4', user: 'Carlos Mendes', type: 'subscription', amount: 19.90, date: 'Ontem, 09:20', status: 'failed' },
  { id: 't5', user: 'Grupo Jovem Zion', type: 'donation', amount: 120.00, date: '23/10, 18:00', status: 'completed' },
];

export const MonetizationView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financeiro & Sustentabilidade</h1>
          <p className="text-slate-500">Gestão de recursos, assinaturas e ofertas da comunidade.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={18} />
          Relatório Fiscal
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Receita Total (Mês)" 
            value="R$ 29.700" 
            trend="14%" 
            trendUp={true} 
            icon={DollarSign} 
            colorClass="bg-emerald-600" 
        />
        <StatCard 
            title="Assinantes Pro" 
            value="842" 
            trend="24 novos" 
            trendUp={true} 
            icon={Users} 
            colorClass="bg-violet-600" 
        />
        <StatCard 
            title="Doações Voluntárias" 
            value="R$ 7.800" 
            trend="5%" 
            trendUp={true} 
            icon={Gift} 
            colorClass="bg-pink-500" 
        />
        <StatCard 
            title="Ticket Médio" 
            value="R$ 35,20" 
            trend="2%" 
            trendUp={false} 
            icon={TrendingUp} 
            colorClass="bg-blue-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Evolução de Receita</h3>
            <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Assinaturas</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-500"></div>Doações</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Parcerias</span>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAssinaturas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDoacoes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => [`R$ ${value}`, '']}
                />
                <Area type="monotone" dataKey="assinaturas" stackId="1" stroke="#10b981" fill="url(#colorAssinaturas)" />
                <Area type="monotone" dataKey="doacoes" stackId="1" stroke="#ec4899" fill="url(#colorDoacoes)" />
                <Area type="monotone" dataKey="anuncios" stackId="1" stroke="#3b82f6" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sustainability Goal & Transactions */}
        <div className="space-y-6">
            
            {/* Sustainability Widget */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg text-white">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Target className="text-emerald-400" size={20} />
                            Meta de Sustentabilidade
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">Cobertura de custos operacionais</p>
                    </div>
                    <span className="text-2xl font-bold text-emerald-400">85%</span>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                    <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700">
                    <div>
                        <p className="text-xs text-slate-400">Custos (Servidor/Equipe)</p>
                        <p className="font-semibold">R$ 35.000</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Receita Atual</p>
                        <p className="font-semibold text-emerald-400">R$ 29.700</p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Últimas Transações</h3>
                <div className="space-y-4">
                    {RECENT_TRANSACTIONS.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                    tx.type === 'subscription' ? 'bg-violet-100 text-violet-600' :
                                    tx.type === 'donation' ? 'bg-pink-100 text-pink-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                    {tx.type === 'subscription' ? <CreditCard size={16} /> :
                                     tx.type === 'donation' ? <Gift size={16} /> : <DollarSign size={16} />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{tx.user}</p>
                                    <p className="text-xs text-slate-500 capitalize">{tx.type === 'ad' ? 'Parceria' : tx.type === 'subscription' ? 'Assinatura' : 'Doação'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${tx.status === 'failed' ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {tx.status === 'failed' ? 'Falhou' : `+ R$ ${tx.amount.toFixed(2)}`}
                                </p>
                                <p className="text-xs text-slate-400">{tx.date.split(',')[0]}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline">
                    Ver todo o histórico
                </button>
            </div>
        </div>
      </div>

      {/* Subscription Plans Overview */}
      <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">Planos Ativos na Plataforma</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-100 px-3 py-1 rounded-bl-lg text-xs font-bold text-slate-500">Gratuito</div>
              <h4 className="font-bold text-slate-800 text-lg mb-1">Membro Comum</h4>
              <p className="text-sm text-slate-500 mb-4">Acesso básico à comunidade</p>
              <div className="text-3xl font-bold text-slate-900 mb-4">R$ 0<span className="text-sm font-normal text-slate-400">/mês</span></div>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>Posts e Comentários</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>Grupos Públicos</li>
              </ul>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full w-[85%]"></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">85% dos usuários</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-violet-100 relative overflow-hidden ring-1 ring-violet-500/20">
              <div className="absolute top-0 right-0 bg-violet-100 px-3 py-1 rounded-bl-lg text-xs font-bold text-violet-700">Popular</div>
              <h4 className="font-bold text-violet-800 text-lg mb-1">Apoiador da Fé</h4>
              <p className="text-sm text-slate-500 mb-4">Recursos de estudo e sem anúncios</p>
              <div className="text-3xl font-bold text-slate-900 mb-4">R$ 19,90<span className="text-sm font-normal text-slate-400">/mês</span></div>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>Devocionais Exclusivos</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>Destaque no Perfil</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>Apoia a plataforma</li>
              </ul>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-violet-600 h-full w-[12%]"></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">12% dos usuários</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-100 px-3 py-1 rounded-bl-lg text-xs font-bold text-emerald-700">Institucional</div>
              <h4 className="font-bold text-slate-800 text-lg mb-1">Igreja Parceira</h4>
              <p className="text-sm text-slate-500 mb-4">Para organizações e lideranças</p>
              <div className="text-3xl font-bold text-slate-900 mb-4">R$ 299,90<span className="text-sm font-normal text-slate-400">/mês</span></div>
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Página Verificada</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Transmissões ao Vivo HD</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Gestão de Membros</li>
              </ul>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[3%]"></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">3% dos usuários</p>
          </div>
      </div>
    </div>
  );
};
