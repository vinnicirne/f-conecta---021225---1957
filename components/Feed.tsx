import React, { useRef, useEffect } from 'react';
import { useFeed } from '../hooks/useFeed';
import PostCard from './PostCard';
import LoadingSpinner from './LoadingSpinner';
import { usePosts } from '../hooks/usePosts';
import { useRepost } from '../hooks/useRepost';

const Feed: React.FC = () => {
    const { posts, loading, hasMore, loadMore, refreshFeed } = useFeed();
    const { updatePost, deletePost, toggleLike } = usePosts();
    const { repostPost } = useRepost();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Infinite scroll usando IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [hasMore, loading, loadMore]);

    const handleRepost = async (post: any) => {
        await repostPost(post);
        refreshFeed(); // Refresh feed after repost
    };

    if (loading && posts.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Seu feed está vazio
                </h3>
                <p className="text-gray-600 mb-4">
                    Siga outros usuários para ver suas publicações aqui!
                </p>
                <button
                    onClick={refreshFeed}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                    Atualizar Feed
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Posts */}
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onUpdate={updatePost}
                    onDelete={deletePost}
                    onRepost={handleRepost}
                    onLike={() => toggleLike(post.id)}
                />
            ))}

            {/* Loading indicator para infinite scroll */}
            <div ref={loadMoreRef} className="py-8">
                {loading && (
                    <div className="flex justify-center">
                        <LoadingSpinner size="md" />
                    </div>
                )}
                {!hasMore && posts.length > 0 && (
                    <p className="text-center text-gray-500 text-sm">
                        Você chegou ao fim do feed
                    </p>
                )}
            </div>
        </div>
    );
};

export default Feed;
