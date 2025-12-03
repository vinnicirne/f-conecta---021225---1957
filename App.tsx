import React, { useState } from 'react';
import { Home, BookOpen, Users, User, Bell, Menu } from 'lucide-react';
import { Feed } from './components/Feed';

export enum View {
  HOME = 'home',
  BIBLE = 'bible',
  COMMUNITY = 'community',
  PROFILE = 'profile',
  MODERATION = 'moderation',
}

export default function App() {
  const [activeTab, setActiveTab] = useState<View>(View.HOME);

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans text-slate-900">
      
      {/* Header Mobile */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-20 shrink-0 sticky top-0">
        <div className="flex items-center gap-2">
          <button className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
            <Menu size={24} />
          </button>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            FéConecta
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full relative">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
            AM
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth overscroll-contain pb-20 no-scrollbar">
        {activeTab === View.HOME && <Feed />}
        
        {activeTab !== View.HOME && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
            <BookOpen size={48} className="mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-gray-600">Em Breve</h3>
            <p className="text-sm">Estamos construindo esta área de {activeTab}.</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 absolute bottom-0 w-full z-30 pb-safe">
        <NavButton 
          active={activeTab === View.HOME} 
          onClick={() => setActiveTab(View.HOME)} 
          icon={<Home size={24} />} 
          label="Início" 
        />
        <NavButton 
          active={activeTab === View.BIBLE} 
          onClick={() => setActiveTab(View.BIBLE)} 
          icon={<BookOpen size={24} />} 
          label="Bíblia" 
        />
        <NavButton 
          active={activeTab === View.COMMUNITY} 
          onClick={() => setActiveTab(View.COMMUNITY)} 
          icon={<Users size={24} />} 
          label="Grupos" 
        />
        <NavButton 
          active={activeTab === View.PROFILE} 
          onClick={() => setActiveTab(View.PROFILE)} 
          icon={<User size={24} />} 
          label="Perfil" 
        />
      </nav>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
      active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <div className={`transform transition-transform ${active ? '-translate-y-1' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-medium mt-1 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {label}
    </span>
  </button>
);