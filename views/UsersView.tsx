import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, UserX, CheckCircle } from 'lucide-react';
import { User, UserRole, UserStatus } from '../types';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Maria Silva', handle: '@mariasilva', email: 'maria@example.com', role: UserRole.MODERATOR, status: UserStatus.ACTIVE, joinedDate: '2023-10-15', avatar: 'https://picsum.photos/40/40?1', reportsCount: 0, followers: 120, following: 80 },
  { id: '2', name: 'João Santos', handle: '@joaos', email: 'joao@example.com', role: UserRole.USER, status: UserStatus.ACTIVE, joinedDate: '2023-11-02', avatar: 'https://picsum.photos/40/40?2', reportsCount: 1, followers: 45, following: 30 },
  { id: '3', name: 'Pedro Oliveira', handle: '@pedroo', email: 'pedro@example.com', role: UserRole.USER, status: UserStatus.BANNED, joinedDate: '2023-09-10', avatar: 'https://picsum.photos/40/40?3', reportsCount: 15, followers: 10, following: 5 },
  { id: '4', name: 'Ana Costa', handle: '@anacosta', email: 'ana@example.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE, joinedDate: '2023-01-20', avatar: 'https://picsum.photos/40/40?4', reportsCount: 0, followers: 5000, following: 200 },
  { id: '5', name: 'Carlos Souza', handle: '@carloss', email: 'carlos@example.com', role: UserRole.USER, status: UserStatus.SUSPENDED, joinedDate: '2023-12-05', avatar: 'https://picsum.photos/40/40?5', reportsCount: 4, followers: 85, following: 120 },
];

export const UsersView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Gestão de Usuários</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Novo Usuário
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <Filter className="text-slate-400" size={20} />
            <select 
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
            >
                <option value="all">Todas as Funções</option>
                <option value={UserRole.USER}>Usuários</option>
                <option value={UserRole.MODERATOR}>Moderadores</option>
                <option value={UserRole.ADMIN}>Administradores</option>
            </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Função</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Entrou em</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 
                          user.role === UserRole.MODERATOR ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}
                    `}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.status === UserStatus.ACTIVE ? 'bg-emerald-100 text-emerald-800' : 
                          user.status === UserStatus.BANNED ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}
                    `}>
                        {user.status === UserStatus.ACTIVE && <CheckCircle size={12} />}
                        {user.status === UserStatus.BANNED && <UserX size={12} />}
                        {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(user.joinedDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100">
                        <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};