

import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Post } from './types';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import Feed from './components/Feed';
import Navigation from './components/Navigation';
import MessageOfTheDay from './components/MessageOfTheDay';
import LoadingSpinner from './components/LoadingSpinner';
import BiblePage from './pages/BiblePage';
import DevotionalsPage from './pages/DevotionalsPage';
import NotesPage from './pages/NotesPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import HashtagPage from './pages/HashtagPage';
import LoginPage from './pages/LoginPage';
import { usePosts } from './hooks/usePosts';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const { user, loading: authLoading } = useAuth();
  const { createPost } = usePosts();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  const handleAddPost = async (newPost: Post) => {
    await createPost(newPost.content, newPost.type, newPost.mediaUrl);
  };



  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
  };

  const handleNavigateToHashtag = (hashtag: string) => {
    setSelectedHashtag(hashtag);
    setCurrentPage('hashtag');
  };

  const handleNavigateToProfile = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentPage('profile');
  };

  const renderFeedPage = () => (
    <main className="max-w-2xl mx-auto px-4 pt-20 pb-24">
      <MessageOfTheDay />
      <CreatePost onPost={handleAddPost} />
      <div className="mt-6">
        <Feed />
      </div>
    </main>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'feed':
        return renderFeedPage();
      case 'bible':
        return <BiblePage />;
      case 'devotionals':
        return <DevotionalsPage />;
      case 'notes':
        return <NotesPage />;
      case 'profile':
        return <ProfilePage userId={selectedUserId} />;
      case 'search':
        return (
          <SearchPage
            initialQuery={searchQuery}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToHashtag={handleNavigateToHashtag}
          />
        );
      case 'hashtag':
        return (
          <HashtagPage
            hashtag={selectedHashtag}
            onBack={() => setCurrentPage('search')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onRefresh={() => { }}
        onNavigateToSearch={handleNavigateToSearch}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToHashtag={handleNavigateToHashtag}
      />
      {renderPage()}
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
};

export default App;
