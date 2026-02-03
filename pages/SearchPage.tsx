import React, { useState, useEffect } from 'react';
import { useSearch } from '../hooks/useSearch';
import { useDebounce } from '../hooks/useDebounce';
import LoadingSpinner from '../components/LoadingSpinner';

interface SearchPageProps {
    initialQuery?: string;
    onNavigateToProfile: (userId: string) => void;
    onNavigateToHashtag: (hashtag: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({
    initialQuery = '',
    onNavigateToProfile,
    onNavigateToHashtag
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState<'users' | 'hashtags'>('users');
    const [users, setUsers] = useState<any[]>([]);
    const [hashtags, setHashtags] = useState<any[]>([]);
    const { searchUsers, searchHashtags, loading } = useSearch();
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.trim().length < 2) {
                setUsers([]);
                setHashtags([]);
                return;
            }

            const [usersResult, hashtagsResult] = await Promise.all([
                searchUsers(debouncedQuery),
                searchHashtags(debouncedQuery)
            ]);

            setUsers(usersResult);
            setHashtags(hashtagsResult);
        };

        performSearch();
    }, [debouncedQuery, searchUsers, searchHashtags]);

    return (
        <main className="max-w-2xl mx-auto px-4 pt-20 pb-24">
            {/* Search Input */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar usuários ou #hashtags..."
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        autoFocus
                    />
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'users'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Usuários ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('hashtags')}
                        className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'hashtags'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Hashtags ({hashtags.length})
                    </button>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <>
                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-4">
                            {users.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Nenhum usuário encontrado
                                    </h3>
                                    <p className="text-gray-600">
                                        Tente buscar por outro nome ou @username
                                    </p>
                                </div>
                            ) : (
                                users.map((user) => (
                                    <div key={user.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                                        <button onClick={() => onNavigateToProfile(user.id)}>
                                            <img
                                                src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`}
                                                alt={user.full_name}
                                                className="w-14 h-14 rounded-full"
                                            />
                                        </button>
                                        <div className="flex-1 min-w-0" onClick={() => onNavigateToProfile(user.id)}>
                                            <h3 className="font-bold text-gray-900 truncate cursor-pointer hover:underline">{user.full_name}</h3>
                                            <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                                            {user.bio && (
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
                                            )}
                                        </div>
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Hashtags Tab */}
                    {activeTab === 'hashtags' && (
                        <div className="space-y-4">
                            {hashtags.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Nenhuma hashtag encontrada
                                    </h3>
                                    <p className="text-gray-600">
                                        Tente buscar por outra hashtag
                                    </p>
                                </div>
                            ) : (
                                hashtags.map((hashtag) => (
                                    <button
                                        key={hashtag.id}
                                        onClick={() => onNavigateToHashtag(hashtag.name)}
                                        className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-blue-600 font-bold text-2xl">#</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">#{hashtag.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {hashtag.post_count.toLocaleString()} {hashtag.post_count === 1 ? 'post' : 'posts'}
                                            </p>
                                        </div>
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    );
};

export default SearchPage;
