
import React, { useState } from 'react';
import { Search, UserPlus, UserCheck, Users, Hash, Plus, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SearchView: React.FC = () => {
  const { users, communities, searchQuery, setSearchQuery, toggleFollow, joinCommunity, viewCommunity, createCommunity } = useApp();
  const [activeTab, setActiveTab] = useState<'people' | 'communities'>('people');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');

  const filteredUsers = users.filter(u => 
    u.id !== 'me' && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.handle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => (Number(b.isPromoted || 0) - Number(a.isPromoted || 0)));

  const handleCreate = () => {
      if(!newCommName) return;
      createCommunity(newCommName, newCommDesc);
      setShowCreateModal(false);
      setNewCommName('');
      setNewCommDesc('');
  };

  return (
    <div className="pb-20">
      <div className="bg-white sticky top-0 z-10 p-4 shadow-sm mb-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar pessoas, igrejas ou grupos..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('people')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'people' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
          >
            Pessoas
          </button>
          <button 
            onClick={() => setActiveTab('communities')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'communities' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
          >
            Comunidades
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {activeTab === 'people' && (
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                    <Search size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Nenhum usuário encontrado para "{searchQuery}"</p>
                </div>
            ) : (
                filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <h4 className="font-bold text-slate-900">{user.name}</h4>
                        <p className="text-xs text-slate-500">{user.handle}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{user.bio}</p>
                    </div>
                    </div>
                    <button 
                    onClick={() => toggleFollow(user.id)}
                    className={`p-2 rounded-full transition-all ${
                        user.isFollowing 
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                    }`}
                    >
                    {user.isFollowing ? <UserCheck size={20} /> : <UserPlus size={20} />}
                    </button>
                </div>
                ))
            )}
          </div>
        )}

        {activeTab === 'communities' && (
           <div className="space-y-4">
             <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-slate-700">Explorar</h3>
                 <button 
                    onClick={() => setShowCreateModal(true)}
                    className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                 >
                     <Plus size={16} /> Nova Comunidade
                 </button>
             </div>
             
             {filteredCommunities.map(community => (
               <div 
                  key={community.id} 
                  className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative ${community.isPromoted ? 'border-2 border-orange-200 ring-2 ring-orange-50' : 'border border-slate-100'}`}
                  onClick={() => viewCommunity(community.id)}
                >
                 {community.isPromoted && (
                     <div className="absolute top-0 right-0 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow flex items-center gap-1">
                         <Star size={10} fill="currentColor" /> Destaque
                     </div>
                 )}
                 <div className="h-24 bg-slate-200 relative">
                    <img src={community.coverImage || community.image} className="w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 </div>
                 <div className="p-4 -mt-10 relative z-10">
                    <div className="flex justify-between items-end mb-2">
                        <div className="bg-white p-1 rounded-lg shadow-sm">
                             <img src={community.image} className="w-16 h-16 rounded-lg object-cover" />
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); joinCommunity(community.id); }}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${community.isJoined ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white'}`}
                        >
                            {community.isJoined ? 'Participando' : 'Participar'}
                        </button>
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-1">
                        {community.name}
                        {community.isVerified && <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">✓</div>}
                    </h4>
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                        <Users size={12}/> {community.members} membros
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-2">{community.description}</p>
                    
                    {community.activeLivestream?.isActive && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded w-fit">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                            AO VIVO AGORA
                        </div>
                    )}
                 </div>
               </div>
             ))}
           </div>
        )}
      </div>

      {/* Simple Create Modal */}
      {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
              <div className="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Criar Nova Comunidade</h2>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Grupo / Igreja</label>
                          <input type="text" className="w-full border border-slate-300 rounded-lg p-2" value={newCommName} onChange={e => setNewCommName(e.target.value)} placeholder="Ex: Igreja Jovem Central" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                          <textarea className="w-full border border-slate-300 rounded-lg p-2 h-24 resize-none" value={newCommDesc} onChange={e => setNewCommDesc(e.target.value)} placeholder="Descreva o propósito da comunidade..." />
                      </div>
                      <button onClick={handleCreate} disabled={!newCommName} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                          Criar Comunidade
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
