import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { CreatePostWidget } from '../components/CreatePostWidget';
import { MessageOfTheDay } from '../components/MessageOfTheDay';
import { FeedPost } from '../components/FeedPost';
import { Post } from '../types';
import { useApp } from '../context/AppContext';

export const FeedView: React.FC = () => {
  const { posts, addPost, currentUser, users } = useApp();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visiblePostsCount, setVisiblePostsCount] = useState(5);

  const handleNewPost = (newPost: Post) => {
    addPost(newPost);
  };

  // Filter Logic: Show posts from people I follow OR my own posts
  // 1. Get IDs of people I follow
  const followingIds = users
    .filter(u => u.isFollowing)
    .map(u => u.id);
  
  // 2. Add my own ID
  const allowedAuthorIds = [...followingIds, currentUser.id];

  // 3. Filter and Sort
  const feedPosts = posts
    .filter(p => allowedAuthorIds.includes(p.authorId))
    .sort((a, b) => b.timestamp - a.timestamp);

  const visiblePosts = feedPosts.slice(0, visiblePostsCount);

  // Simulate Infinite Scroll
  const loadMorePosts = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisiblePostsCount(prev => prev + 5);
      setIsLoadingMore(false);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto pb-20">
      
      <MessageOfTheDay />

      <CreatePostWidget onPostCreated={handleNewPost} />

      <div className="space-y-6">
        {visiblePosts.length > 0 ? (
          visiblePosts.map(post => (
            <FeedPost key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 p-6">
            <p className="text-slate-500 font-medium">Seu feed está silencioso.</p>
            <p className="text-sm text-slate-400 mt-2">Siga mais pessoas ou comunidades para ver publicações aqui.</p>
          </div>
        )}
      </div>

      {visiblePosts.length < feedPosts.length && (
        <div className="mt-8 text-center">
            <button 
            onClick={loadMorePosts}
            disabled={isLoadingMore}
            className="text-blue-600 font-medium text-sm flex items-center justify-center gap-2 mx-auto hover:bg-blue-50 px-4 py-2 rounded-full transition-colors"
            >
            {isLoadingMore ? <Loader2 className="animate-spin" /> : 'Carregar mais publicações'}
            </button>
        </div>
      )}
    </div>
  );
};
