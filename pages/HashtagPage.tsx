import React, { useRef, useEffect } from 'react';
import { useHashtag } from '../hooks/useHashtag';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePosts } from '../hooks/usePosts';

interface HashtagPageProps {
    hashtag: string;
    onBack: () => void;
}

const HashtagPage: React.FC<HashtagPageProps> = ({ hashtag, onBack }) => {
    const { hashtag: hashtagData, posts, loading, hasMore, loadMore } = useHashtag(hashtag);
    const { updatePost, deletePost, toggleLike } = usePosts();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Infinite scroll
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

    const handleRepost = (post: any) => {
        console.log('Repostar:', post);
    };

    return (
        <main className="max-w-2xl mx-auto px-4 pt-20 pb-24">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">Voltar</span>
                </button>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">#</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">#{hashtag}</h1>
                        {hashtagData && (
                            <p className="text-gray-600 mt-1">
                                {hashtagData.post_count.toLocaleString()} {hashtagData.post_count === 1 ? 'publicação' : 'publicações'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Posts */}
            {loading && posts.length === 0 ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhuma publicação encontrada
                    </h3>
                    <p className="text-gray-600">
                        Seja o primeiro a usar #{hashtag}!
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
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
                                Você chegou ao fim dos posts
                            </p>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};

export default HashtagPage;
