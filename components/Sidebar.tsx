import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  FileText, 
  BarChart2, 
  Settings, 
  LogOut,
  Heart,
  Wallet,
  Smartphone,
  Search,
  Bell,
  Book,
  BookOpen,
  Coffee
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'feed', label: 'Simular App (Feed)', icon: Smartphone },
    { id: 'search', label: 'Buscar / Explorar', icon: Search },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'bible', label: 'Bíblia Sagrada', icon: Book },
    { id: 'devotionals', label: 'Planos e Devocionais', icon: Coffee },
    { id: 'notes', label: 'Diário Espiritual', icon: BookOpen },
    { id: 'dashboard', label: 'Visão Geral (Admin)', icon: LayoutDashboard },
    { id: 'users', label: 'Gestão Usuários', icon: Users },
    { id: 'content', label: 'Conteúdo', icon: FileText },
    { id: 'moderation', label: 'Moderação', icon: ShieldAlert },
    { id: 'analytics', label: 'Analytics & IA', icon: BarChart2 },
    { id: 'finance', label: 'Financeiro', icon: Wallet },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleNav = (id: string) => {
    setCurrentView(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
      `}>
        <div className="h-16 flex items-center justify-center border-b border-slate-100">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                <Heart className="fill-current" size={24} />
                <span>FéConecta</span>
            </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${currentView === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                ${item.id === 'feed' ? 'mb-1 border border-blue-100 bg-gradient-to-r from-blue-50 to-white shadow-sm' : ''}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}

          <div className="pt-8 mt-8 border-t border-slate-100">
             <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut size={20} />
              Sair do Sistema
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};