import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '../hooks/useSearch';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
    onNavigateToSearch: (query: string) => void;
    onNavigateToProfile: (userId: string) => void;
    onNavigateToHashtag: (hashtag: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onNavigateToSearch,
    onNavigateToProfile,
    onNavigateToHashtag
}) => {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [hashtags, setHashtags] = useState<any[]>([]);
    const { searchUsers, searchHashtags, loading } = useSearch();
    const debouncedQuery = useDebounce(query, 300);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Buscar quando query mudar (debounced)
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.trim().length < 2) {
                setUsers([]);
                setHashtags([]);
                setShowDropdown(false);
                return;
            }

            const [usersResult, hashtagsResult] = await Promise.all([
                searchUsers(debouncedQuery),
                searchHashtags(debouncedQuery)
            ]);

            setUsers(usersResult);
            setHashtags(hashtagsResult);
            setShowDropdown(true);
        };

        performSearch();
    }, [debouncedQuery, searchUsers, searchHashtags]);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onNavigateToSearch(query);
            setShowDropdown(false);
        }
    };

    const handleUserClick = (userId: string) => {
        setQuery('');
        setShowDropdown(false);
        onNavigateToProfile(userId);
    };

    const handleHashtagClick = (hashtag: string) => {
        setQuery('');
        setShowDropdown(false);
        onNavigateToHashtag(hashtag);
    };

    const hasResults = users.length > 0 || hashtags.length > 0;

    return (
        <div className="relative w-full max-w-md" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                    placeholder="Buscar usuários ou #hashtags..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </form>

            {/* Dropdown de resultados */}
            {showDropdown && hasResults && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Usuários */}
                    {users.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase">Usuários</h3>
                            </div>
                            {users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleUserClick(user.id)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <img
                                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`}
                                        alt={user.full_name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{user.full_name}</p>
                                        <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Hashtags */}
                    {hashtags.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase">Hashtags</h3>
                            </div>
                            {hashtags.map((hashtag) => (
                                <button
                                    key={hashtag.id}
                                    onClick={() => handleHashtagClick(hashtag.name)}
                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-lg">#</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">#{hashtag.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {hashtag.post_count} {hashtag.post_count === 1 ? 'post' : 'posts'}
                                            </p>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
