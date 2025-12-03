import React, { useState } from 'react';
import { LayoutDashboard, Mic, MessageSquare, AlertCircle } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { LiveInterface } from './components/LiveInterface';

enum AppMode {
  CHAT = 'CHAT',
  LIVE = 'LIVE'
}

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-nexus-900 text-white p-6">
        <div className="max-w-md bg-nexus-800 p-8 rounded-xl border border-red-500/30 shadow-2xl">
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <AlertCircle size={32} />
            <h1 className="text-2xl font-bold">Configuration Missing</h1>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            The <code>API_KEY</code> environment variable is missing. 
            To run this app on Vercel, please add your Google Gemini API key in the project settings.
          </p>
          <div className="text-sm text-gray-400 bg-nexus-900 p-4 rounded border border-gray-700 font-mono">
            process.env.API_KEY is undefined
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-nexus-900 text-white overflow-hidden selection:bg-nexus-accent selection:text-white">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex-shrink-0 bg-nexus-800 border-r border-gray-700 flex flex-col items-center lg:items-stretch transition-all duration-300 z-20">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <span className="hidden lg:block ml-3 font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
            Gemini Nexus
          </span>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-2 lg:px-4">
          <NavButton 
            active={mode === AppMode.CHAT} 
            onClick={() => setMode(AppMode.CHAT)} 
            icon={<MessageSquare size={20} />} 
            label="Multimodal Chat" 
            desc="Text & Images"
          />
          <NavButton 
            active={mode === AppMode.LIVE} 
            onClick={() => setMode(AppMode.LIVE)} 
            icon={<Mic size={20} />} 
            label="Live Real-time" 
            desc="Low-latency Audio"
          />
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="hidden lg:flex items-center gap-3 p-3 rounded-lg bg-nexus-900/50 border border-gray-700/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-400 font-mono">System Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {mode === AppMode.CHAT ? <ChatInterface /> : <LiveInterface />}
      </main>
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  desc: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, desc }) => (
  <button
    onClick={onClick}
    className={`
      group flex items-center gap-3 p-3 rounded-xl transition-all duration-200
      ${active 
        ? 'bg-nexus-accent text-white shadow-lg shadow-blue-500/20' 
        : 'text-gray-400 hover:bg-nexus-700 hover:text-white'
      }
    `}
  >
    <div className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
      {icon}
    </div>
    <div className="hidden lg:block text-left">
      <div className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-200'}`}>{label}</div>
      <div className={`text-xs ${active ? 'text-blue-200' : 'text-gray-500'}`}>{desc}</div>
    </div>
  </button>
);