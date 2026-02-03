

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';

interface HeaderProps {
  onRefresh: () => void;
  onNavigateToSearch: (query: string) => void;
  onNavigateToProfile: (userId: string) => void;
  onNavigateToHashtag: (hashtag: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, onNavigateToSearch, onNavigateToProfile, onNavigateToHashtag }) => {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className={`flex items-center space-x-2 transition-all duration-300 ${showMobileSearch ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            F
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 truncate">
            FéConecta
          </h1>
        </div>

        {/* SearchBar */}
        <div className={`flex-1 transition-all duration-300 ${showMobileSearch ? 'mx-0' : 'mx-4 hidden md:block'}`}>
          {(showMobileSearch || window.innerWidth >= 768) && (
            <div className="flex items-center gap-2">
              <SearchBar
                onNavigateToSearch={(q) => {
                  onNavigateToSearch(q);
                  setShowMobileSearch(false);
                }}
                onNavigateToProfile={(id) => {
                  onNavigateToProfile(id);
                  setShowMobileSearch(false);
                }}
                onNavigateToHashtag={(h) => {
                  onNavigateToHashtag(h);
                  setShowMobileSearch(false);
                }}
              />
              {showMobileSearch && (
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 md:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 transition-all duration-300 ${showMobileSearch ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          <button
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Buscar"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            onClick={onRefresh}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Recarregar"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.user_metadata?.full_name}</p>
                    <p className="text-xs text-gray-500">@{user.user_metadata?.username}</p>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
