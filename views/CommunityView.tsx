import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Video, 
  MessageCircle, 
  Share2, 
  MoreVertical,
  ArrowLeft,
  Plus,
  Heart,
  UserPlus,
  UserCheck,
  BadgeCheck,
  Gift,
  CreditCard,
  QrCode,
  TrendingUp,
  Loader2,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FeedPost } from '../components/FeedPost';
import { CreatePostWidget } from '../components/CreatePostWidget';

export const CommunityView: React.FC = () => {
  const { communities, selectedCommunityId, posts, joinCommunity, toggleEventRSVP, addPost, currentUser, processDonation, promoteCommunity } = useApp();
  const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'live' | 'about'>('feed');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);

  // Find the community
  const community = communities.find(c => c.id === selectedCommunityId);

  if (!community) {
    return <div className="p-8 text-center text-slate-500">Comunidade não encontrada.</div>;
  }

  const isMember = community.isJoined;
  const isAdmin = community.adminId === currentUser.id;

  // Filter posts for this community
  const communityPosts = posts.filter(p => p.communityId === community.id);

  const handleBack = () => {
      const event = new CustomEvent('navigate', { detail: 'search' }); // Go back to search/explore
      window.dispatchEvent(event);
  };

  const handleNewPost = (newPost: any) => {
      addPost({ ...newPost, communityId: community.id });
  };

  const renderHeader = () => (
      <div className="relative mb-4">
           {/* Cover Image */}
           <div className="h-48 md:h-64 bg-slate-200 relative">
               <img src={community.coverImage} className="w-full h-full object-cover" alt="Cover" />
               <div className="absolute inset-0 bg-black/20"></div>
               <button 
                  onClick={handleBack}
                  className="absolute top-4 left-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors"
               >
                   <ArrowLeft size={24} />
               </button>
               {/* Admin Badge */}
               {isAdmin && (
                   <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-slate-700">
                       <ShieldCheck size={14} className="text-blue-400" /> Modo Administrador
                   </div>
               )}
           </div>
           
           {/* Info Bar */}
           <div className="bg-white px-4 pb-4 pt-16 relative shadow-sm border-b border-slate-100">
               {/* Avatar overlapped */}
               <div className="absolute -top-12 left-4 p-1 bg-white rounded-xl shadow-md">
                   <img src={community.image} className="w-24 h-24 rounded-lg object-cover" alt="Avatar" />
               </div>
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center pl-2 md:pl-28 gap-4">
                   <div className="mt-12 md:mt-0">
                       <h1 className="text-2xl font-bold text-slate-900 leading-tight flex items-center gap-2">
                           {community.name}
                           {community.isVerified && <BadgeCheck size={20} className="text-blue-500" fill="currentColor" />}
                       </h1>
                       <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                           <Users size={14} /> {community.members} membros
                       </p>
                   </div>
                   
                   <div className="flex gap-2 w-full md:w-auto">
                        {community.isVerified && (
                           <button 
                                onClick={() => setShowDonateModal(true)}
                                className="flex-1 md:flex-none px-4 py-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
                           >
                                <Gift size={18} /> Ofertar
                           </button>
                        )}
                        <button 
                            onClick={() => joinCommunity(community.id)}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all
                                ${isMember 
                                    ? 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'}
                            `}
                        >
                            {isMember ? <UserCheck size={18} /> : <UserPlus size={18} />}
                            {isMember ? 'Participando' : 'Participar'}
                        </button>
                   </div>
               </div>

               {/* Tabs */}
               <div className="flex gap-6 mt-6 border-b border-slate-100 overflow-x-auto scrollbar-hide">
                   <button 
                      onClick={() => setActiveTab('feed')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'feed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                   >
                       Feed do Grupo
                   </button>
                   <button 
                      onClick={() => setActiveTab('events')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'events' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                   >
                       Eventos
                   </button>
                   <button 
                      onClick={() => setActiveTab('live')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'live' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                   >
                       <div className={`w-2 h-2 rounded-full ${community.activeLivestream?.isActive ? 'bg-red-600 animate-pulse' : 'bg-slate-300'}`}></div>
                       Ao Vivo
                   </button>
                   <button 
                      onClick={() => setActiveTab('about')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'about' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                   >
                       Sobre
                   </button>
               </div>
           </div>
      </div>
  );

  const renderFeed = () => (
      <div className="space-y-6">
          {!isMember ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center mx-4">
                  <h3 className="font-bold text-blue-900 mb-2">Este grupo é privado</h3>
                  <p className="text-blue-700 text-sm mb-4">Participe da comunidade para ver as publicações e interagir com os membros.</p>
                  <button onClick={() => joinCommunity(community.id)} className="text-blue-600 font-bold underline">Participar Agora</button>
              </div>
          ) : (
              <>
                <CreatePostWidget onPostCreated={handleNewPost} />
                {communityPosts.length === 0 ? (
                     <div className="text-center py-10 text-slate-400">
                         <MessageCircle size={48} className="mx-auto mb-2 opacity-20" />
                         <p>Nenhuma publicação ainda. Seja o primeiro!</p>
                     </div>
                ) : (
                    communityPosts.map(post => <FeedPost key={post.id} post={post} />)
                )}
              </>
          )}
      </div>
  );

  const renderEvents = () => (
      <div className="space-y-4 px-4 pb-20">
          <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-800">Próximos Eventos</h3>
              {currentUser.role === 'Administrador' && (
                  <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded-lg">
                      <Plus size={16} /> Criar Evento
                  </button>
              )}
          </div>
          
          {!community.events || community.events.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                   <Calendar size={48} className="mx-auto mb-2 text-slate-200" />
                   <p className="text-slate-500">Nenhum evento agendado.</p>
              </div>
          ) : (
              community.events.map(event => (
                  <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                      {/* Date Block */}
                      <div className="bg-blue-50 p-6 flex flex-col items-center justify-center md:w-32 border-b md:border-b-0 md:border-r border-slate-100">
                          <span className="text-3xl font-bold text-blue-600">{event.date.split('-')[2]}</span>
                          <span className="text-sm font-medium text-blue-800 uppercase">
                              {new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}
                          </span>
                      </div>
                      
                      {/* Details */}
                      <div className="p-4 flex-1">
                          <h4 className="font-bold text-slate-900 text-lg mb-2">{event.title}</h4>
                          <div className="space-y-2 text-sm text-slate-600 mb-4">
                              <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-slate-400" />
                                  {event.time}
                              </div>
                              <div className="flex items-center gap-2">
                                  <MapPin size={16} className="text-slate-400" />
                                  {event.location}
                              </div>
                          </div>
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{event.description}</p>
                          
                          <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                               <span className="text-xs text-slate-400 flex items-center gap-1">
                                   <Users size={14} /> {event.attendees} confirmados
                               </span>
                               <button 
                                  onClick={() => toggleEventRSVP(community.id, event.id)}
                                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border
                                      ${event.isUserAttending 
                                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                                  `}
                               >
                                   {event.isUserAttending ? 'Confirmado ✓' : 'Confirmar Presença'}
                               </button>
                          </div>
                      </div>
                  </div>
              ))
          )}
      </div>
  );

  const renderLive = () => (
      <div className="space-y-6 px-4 pb-20">
          {!community.activeLivestream?.isActive ? (
               <div className="text-center py-20 bg-slate-900 rounded-xl text-slate-400">
                   <Video size={48} className="mx-auto mb-4 opacity-50" />
                   <h3 className="text-white font-bold text-lg">Nenhuma transmissão agora</h3>
                   <p className="text-sm">Fique atento às notificações para o próximo culto.</p>
               </div>
          ) : (
               <div className="bg-black rounded-xl overflow-hidden shadow-lg animate-in zoom-in-95">
                   {/* Video Player Placeholder */}
                   <div className="aspect-video bg-slate-800 relative group cursor-pointer">
                       <img src={community.activeLivestream.thumbnailUrl} className="w-full h-full object-cover opacity-80" />
                       <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                               <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                           </div>
                       </div>
                       <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-2 animate-pulse">
                           <div className="w-2 h-2 bg-white rounded-full"></div> AO VIVO
                       </div>
                       <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 backdrop-blur-md">
                           <Users size={12} /> {community.activeLivestream.viewerCount} assistindo
                       </div>
                   </div>

                   {/* Live Info & Chat */}
                   <div className="flex flex-col h-[400px] md:h-auto">
                       <div className="p-4 bg-slate-900 border-b border-slate-800">
                           <h3 className="text-white font-bold">{community.activeLivestream.title}</h3>
                           <p className="text-slate-400 text-xs mt-1">Transmitido por {community.name}</p>
                       </div>
                       
                       {/* Chat Mock */}
                       <div className="flex-1 bg-slate-900 p-4 overflow-y-auto space-y-3">
                           <div className="text-sm">
                               <span className="font-bold text-blue-400">Maria Silva:</span> <span className="text-slate-300">A paz do Senhor! 🙏</span>
                           </div>
                           <div className="text-sm">
                               <span className="font-bold text-emerald-400">João Pedro:</span> <span className="text-slate-300">Glória a Deus por essa palavra.</span>
                           </div>
                           <div className="text-sm">
                               <span className="font-bold text-purple-400">Ana Souza:</span> <span className="text-slate-300">O som está ótimo hoje.</span>
                           </div>
                       </div>

                       <div className="p-4 bg-slate-800 flex gap-2">
                           <input type="text" placeholder="Digite uma mensagem..." className="flex-1 bg-slate-700 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500" />
                           <button className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700">
                               <MessageCircle size={18} />
                           </button>
                           <button className="p-2 bg-slate-700 rounded-full text-slate-300 hover:text-white hover:bg-slate-600">
                               <Heart size={18} />
                           </button>
                       </div>
                   </div>
               </div>
          )}
      </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen pb-20">
       {renderHeader()}
       
       <div className="pt-6">
           {activeTab === 'feed' && renderFeed()}
           {activeTab === 'events' && renderEvents()}
           {activeTab === 'live' && renderLive()}
           {activeTab === 'about' && (
               <div className="p-6 text-slate-600 leading-relaxed space-y-6">
                   <div>
                        <h3 className="font-bold text-slate-900 mb-2">Sobre Nós</h3>
                        <p>{community.description}</p>
                   </div>
                   
                   {/* Admin Promotion Section */}
                   {isAdmin && (
                       <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 rounded-xl p-5">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                                <TrendingUp className="text-orange-500" size={20} />
                                Impulsionar Comunidade
                            </h4>
                            <p className="text-sm text-slate-600 mb-4">
                                Destaque sua comunidade na página de busca para alcançar mais pessoas.
                            </p>
                            {community.isPromoted ? (
                                <div className="text-xs font-bold text-emerald-600 bg-white border border-emerald-100 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                                    <CheckCircle size={14} /> Ativo: Plano de Destaque
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setShowPromoteModal(true)}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-orange-200 hover:bg-orange-600 transition-colors"
                                >
                                    Promover Agora
                                </button>
                            )}
                       </div>
                   )}

                   <div className="border-t border-slate-100 pt-4">
                       <h4 className="font-bold text-slate-800 text-sm mb-2">Administrador</h4>
                       <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                <ShieldCheck size={16} className="text-slate-500"/>
                            </div>
                            <span className="text-sm">Liderança da Comunidade</span>
                       </div>
                   </div>
               </div>
           )}
       </div>

       {/* Donate Modal */}
       {showDonateModal && (
           <DonateModal 
               communityName={community.name} 
               onClose={() => setShowDonateModal(false)}
               onDonate={(amount, method) => {
                   processDonation(community.id, amount, method);
                   setShowDonateModal(false);
               }}
           />
       )}

       {/* Promote Modal */}
       {showPromoteModal && (
           <PromoteModal
               communityName={community.name}
               onClose={() => setShowPromoteModal(false)}
               onPromote={() => {
                   promoteCommunity(community.id);
                   setShowPromoteModal(false);
               }}
           />
       )}
    </div>
  );
};

// Sub-components for Modals

const DonateModal: React.FC<{ communityName: string; onClose: () => void; onDonate: (amount: number, method: string) => void }> = ({ communityName, onClose, onDonate }) => {
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<'pix' | 'card'>('pix');
    const [step, setStep] = useState(1);

    const handleConfirm = () => {
        setStep(2);
        setTimeout(() => {
            onDonate(Number(amount), method === 'pix' ? 'PIX' : 'Cartão');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 relative z-10 animate-in slide-in-from-bottom-10">
                {step === 1 ? (
                    <>
                        <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <Gift className="text-pink-500" /> Ofertar para {communityName}
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">Sua oferta ajuda a manter este ministério.</p>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Valor da Oferta (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="0,00"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Forma de Pagamento</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => setMethod('pix')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'pix' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-200 text-slate-500'}`}
                                    >
                                        <QrCode size={24} />
                                        <span className="text-sm font-bold">PIX</span>
                                    </button>
                                    <button 
                                        onClick={() => setMethod('card')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-200 text-slate-500'}`}
                                    >
                                        <CreditCard size={24} />
                                        <span className="text-sm font-bold">Cartão</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 bg-slate-50 p-2 rounded">
                             <span>Taxa da Plataforma</span>
                             <span>2% + R$ 0,50</span>
                        </div>

                        <button 
                            onClick={handleConfirm}
                            disabled={!amount}
                            className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 disabled:opacity-50 transition-colors shadow-lg shadow-pink-200"
                        >
                            Confirmar Oferta
                        </button>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="animate-spin text-green-600" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Processando Pagamento...</h3>
                        <p className="text-slate-500 text-sm mt-2">Aguarde a confirmação do banco.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PromoteModal: React.FC<{ communityName: string; onClose: () => void; onPromote: () => void }> = ({ communityName, onClose, onPromote }) => {
    const [step, setStep] = useState(1);

    const handleConfirm = () => {
        setStep(2);
        setTimeout(() => {
            onPromote();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl w-full max-w-sm p-0 relative z-10 overflow-hidden animate-in zoom-in-95">
                {step === 1 ? (
                    <>
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white text-center">
                            <TrendingUp size={48} className="mx-auto mb-2 text-white/90" />
                            <h2 className="text-2xl font-bold">Plano de Destaque</h2>
                            <p className="text-white/80 text-sm">Alcance milhares de novas pessoas.</p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-3 text-sm text-slate-700">
                                    <CheckCircle size={18} className="text-emerald-500" />
                                    Topo da página de busca
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-700">
                                    <CheckCircle size={18} className="text-emerald-500" />
                                    Selo "Destaque" no card
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-700">
                                    <CheckCircle size={18} className="text-emerald-500" />
                                    Recomendação no Feed
                                </li>
                            </ul>
                            
                            <div className="text-center mb-6">
                                <span className="text-3xl font-bold text-slate-900">R$ 49,90</span>
                                <span className="text-slate-500 text-sm">/mês</span>
                            </div>

                            <button 
                                onClick={handleConfirm}
                                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-colors"
                            >
                                Assinar Destaque
                            </button>
                            <button onClick={onClose} className="w-full mt-3 text-slate-400 text-sm font-medium hover:text-slate-600">
                                Cancelar
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="animate-spin text-orange-600" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Ativando Destaque...</h3>
                    </div>
                )}
            </div>
        </div>
    );
};