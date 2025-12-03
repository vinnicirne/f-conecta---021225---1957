import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Overview } from './components/Overview';
import { UsersList } from './components/Users';
import { ModerationPanel } from './components/Moderation';
import { AnalyticsAI } from './components/AnalyticsAI';
import { Menu, Bell, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'overview': return <Overview />;
      case 'users': return <UsersList />;
      case 'moderation': return <ModerationPanel />;
      case 'analytics': return <AnalyticsAI />;
      case 'settings': 
        return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <Settings className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg">Configurações do sistema em desenvolvimento.</p>
          </div>
        );
      default: return <Overview />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'overview': return 'Painel de Controle';
      case 'users': return 'Usuários';
      case 'moderation': return 'Moderação';
      case 'analytics': return 'Analytics & IA';
      case 'settings': return 'Configurações';
      default: return 'FéConecta';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{getTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-700">Admin</span>
              <span className="text-xs text-gray-500">Super User</span>
            </div>
            <img 
              src="https://picsum.photos/seed/admin/40/40" 
              alt="Profile" 
              className="w-9 h-9 rounded-full border border-gray-200 cursor-pointer"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;