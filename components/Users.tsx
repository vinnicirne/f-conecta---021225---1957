import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { UserRole, UserStatus } from '../types';
import { Search, MoreHorizontal, Filter, ShieldCheck, Ban, UserCheck } from 'lucide-react';

export const UsersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE: return 'bg-green-100 text-green-800';
      case UserStatus.SUSPENDED: return 'bg-yellow-100 text-yellow-800';
      case UserStatus.BANNED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search & Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="ALL">Todas Funções</option>
            <option value={UserRole.ADMIN}>Administradores</option>
            <option value={UserRole.MODERATOR}>Moderadores</option>
            <option value={UserRole.USER}>Usuários</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                <th className="p-4">Usuário</th>
                <th className="p-4">Função</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data Cadastro</th>
                <th className="p-4">Denúncias</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {user.role === UserRole.ADMIN && <ShieldCheck className="w-4 h-4 text-brand-600" />}
                      <span className="text-sm text-gray-700 capitalize">{user.role.toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === UserStatus.ACTIVE ? 'Ativo' : user.status === UserStatus.BANNED ? 'Banido' : 'Suspenso'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(user.joinedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                     <span className={`text-sm font-medium ${user.reportCount > 5 ? 'text-red-600' : 'text-gray-600'}`}>
                       {user.reportCount}
                     </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       {user.status !== UserStatus.BANNED ? (
                         <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Banir">
                           <Ban className="w-4 h-4" />
                         </button>
                       ) : (
                         <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Restaurar">
                            <UserCheck className="w-4 h-4" />
                         </button>
                       )}
                       <button className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                         <MoreHorizontal className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum usuário encontrado com os filtros atuais.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};