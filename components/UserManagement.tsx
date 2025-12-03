import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Shield, UserX, CheckCircle } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, name: "Ana Clara Silva", email: "ana.silva@email.com", role: "Usuário", status: "Active", joined: "12 Jan 2024", posts: 45 },
  { id: 2, name: "Pr. João Marcos", email: "joao.marcos@igreja.com", role: "Moderador", status: "Active", joined: "03 Dez 2023", posts: 128 },
  { id: 3, name: "Roberto Campos", email: "beto.campos@email.com", role: "Usuário", status: "Banned", joined: "15 Fev 2024", posts: 2 },
  { id: 4, name: "Maria Helena", email: "maria.h@email.com", role: "Usuário", status: "Active", joined: "20 Mar 2024", posts: 89 },
  { id: 5, name: "Carlos Eduardo", email: "carlos.edu@email.com", role: "Admin", status: "Active", joined: "01 Nov 2023", posts: 12 },
  { id: 6, name: "Fernanda Lima", email: "fer.lima@email.com", role: "Usuário", status: "Suspended", joined: "10 Abr 2024", posts: 15 },
];

export const UserManagement: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesFilter = filter === 'Todos' || user.role === filter || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-fe-900">Gestão de Usuários</h1>
          <p className="text-fe-500 text-sm">Gerencie os membros da comunidade FéConecta.</p>
        </div>
        <button className="bg-fe-primary hover:bg-fe-primaryHover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Novo Usuário
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-fe-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-fe-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-fe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fe-primary/20 focus:border-fe-primary text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter size={18} className="text-fe-500" />
          {['Todos', 'Usuário', 'Moderador', 'Banned'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                ${filter === f 
                  ? 'bg-fe-800 text-white' 
                  : 'bg-fe-100 text-fe-600 hover:bg-fe-200'}
              `}
            >
              {f === 'Banned' ? 'Banidos' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-fe-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fe-50 border-b border-fe-200">
                <th className="px-6 py-4 text-xs font-semibold text-fe-500 uppercase">Usuário</th>
                <th className="px-6 py-4 text-xs font-semibold text-fe-500 uppercase">Papel</th>
                <th className="px-6 py-4 text-xs font-semibold text-fe-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-fe-500 uppercase">Cadastro</th>
                <th className="px-6 py-4 text-xs font-semibold text-fe-500 uppercase">Atividade</th>
                <th className="px-6 py-4 text-xs font-semibold text-fe-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fe-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-fe-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-fe-700 font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-fe-900">{user.name}</div>
                        <div className="text-xs text-fe-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.role === 'Admin' && <Shield size={14} className="text-indigo-600" />}
                      {user.role === 'Moderador' && <Shield size={14} className="text-blue-500" />}
                      <span className="text-sm text-fe-700">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${user.status === 'Active' ? 'bg-green-100 text-green-700' : ''}
                      ${user.status === 'Banned' ? 'bg-red-100 text-red-700' : ''}
                      ${user.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {user.status === 'Active' && <CheckCircle size={12} />}
                      {user.status === 'Banned' && <UserX size={12} />}
                      {user.status === 'Active' ? 'Ativo' : user.status === 'Banned' ? 'Banido' : 'Suspenso'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-fe-600">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-sm text-fe-600">
                    {user.posts} posts
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-fe-400 hover:text-fe-900 transition-colors p-1">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-fe-500">
            Nenhum usuário encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
};
