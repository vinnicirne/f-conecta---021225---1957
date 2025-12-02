
import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, User as UserIcon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { UsersView } from './views/UsersView';
import { ModerationView } from './views/ModerationView';
import { AnalyticsView } from './views/AnalyticsView';
import { MonetizationView } from './views/MonetizationView';
import { FeedView } from './views/FeedView';
import { SearchView } from './views/SearchView';
import { NotificationsView } from './views/NotificationsView';
import { BibleView } from './views/BibleView';
import { NotesView } from './views/NotesView';
import { DevotionalsView } from './views/DevotionalsView';
import { CommunityView } from './views/CommunityView';
import { AppProvider, useApp } from './context/AppContext';

// Wrapper component to use the context
const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState('feed'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { unreadNotifications, setSearchQuery, currentUser } = useApp();

  // Listen for custom navigation events (e.g., from BibleView or Community Cards)
  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCurrentView(customEvent.detail);
      }
    };

    window.addEventListener('navigate', handleNavigation);
    return () => window.removeEventListener('navigate', handleNavigation);
  }, []);

  const handleSearchFocus = () => {
    setCurrentView('search');
  };

  const renderView = () => {
    switch (currentView) {
      case 'feed': return <FeedView />;
      case 'search': return <SearchView />;
      case 'notifications': return <NotificationsView />;
      case 'bible': return <BibleView />;
      case 'notes': return <NotesView />;
      case 'devotionals': return <DevotionalsView />;
      case 'community': return <CommunityView />;
      case 'dashboard': return <DashboardView />;
      case 'users': return <UsersView />;
      case 'moderation': return <ModerationView />;
      case 'analytics': return <AnalyticsView />;
      case 'finance': return <MonetizationView />;
      default:
        return (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <p className="text-lg font-medium">Módulo em desenvolvimento</p>
                <p className="text-sm">Selecione outra opção no menu.</p>
            </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20 relative">
          <div className="flex items-center gap-3">
            <button 
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Search Bar - Global Search that redirects to Search View */}
            <div className="flex items-center relative w-48 sm:w-64 lg:w-96">
                <Search className="absolute left-3 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar usuários..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    onFocus={handleSearchFocus}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => setCurrentView('notifications')}
             >
                 <Bell size={20} />
                 {unreadNotifications > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                 )}
             </button>
             <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                 <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                     <p className="text-xs text-slate-500">{currentUser.handle}</p>
                 </div>
                 <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-blue-200 object-cover" alt="Profile" />
             </div>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative" id="main-scroll">
            <div className={`mx-auto ${['feed', 'search', 'notifications', 'devotionals', 'community'].includes(currentView) ? 'max-w-xl' : 'max-w-7xl'}`}>
                {renderView()}
            </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
