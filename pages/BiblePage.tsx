import React, { useState, useEffect } from 'react';
import { getRandomVerse, getVerse, BIBLE_BOOKS, BibleVerse } from '../lib/bibleApi';
import LoadingSpinner from '../components/LoadingSpinner';

const BiblePage: React.FC = () => {
    const [verseOfDay, setVerseOfDay] = useState<BibleVerse | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<BibleVerse | null>(null);
    const [searching, setSearching] = useState(false);
    const [activeTestament, setActiveTestament] = useState<'old' | 'new'>('old');

    useEffect(() => {
        fetchVerseOfDay();
    }, []);

    const fetchVerseOfDay = async () => {
        try {
            setLoading(true);
            const verse = await getRandomVerse();
            setVerseOfDay(verse);
        } catch (error) {
            console.error('Error fetching verse:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setSearching(true);
            const result = await getVerse(searchQuery);
            setSearchResult(result);
        } catch (error) {
            console.error('Error searching verse:', error);
        } finally {
            setSearching(false);
        }
    };

    const oldTestamentBooks = BIBLE_BOOKS.filter(b => b.testament === 'old');
    const newTestamentBooks = BIBLE_BOOKS.filter(b => b.testament === 'new');
    const displayBooks = activeTestament === 'old' ? oldTestamentBooks : newTestamentBooks;

    return (
        <main className="max-w-2xl mx-auto px-4 pt-20 pb-24">
            {/* Verse of the Day */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <span className="text-sm font-semibold uppercase tracking-wide">Versículo do Dia</span>
                </div>

                {loading ? (
                    <div className="py-8">
                        <LoadingSpinner size="md" className="mx-auto" />
                    </div>
                ) : verseOfDay ? (
                    <>
                        <p className="text-lg leading-relaxed mb-4">{verseOfDay.text}</p>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-white/90">{verseOfDay.reference}</p>
                            <button
                                onClick={fetchVerseOfDay}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                            >
                                Novo Versículo
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-white/80">Erro ao carregar versículo</p>
                )}
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ex: João 3:16 ou Salmos 23"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={searching}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                    >
                        {searching ? <LoadingSpinner size="sm" /> : 'Buscar'}
                    </button>
                </form>

                {searchResult && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-gray-800 leading-relaxed mb-2">{searchResult.text}</p>
                        <p className="text-sm font-semibold text-blue-600">{searchResult.reference}</p>
                    </div>
                )}
            </div>

            {/* Books List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Testament Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTestament('old')}
                        className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTestament === 'old'
                                ? 'text-amber-600 bg-amber-50 border-b-2 border-amber-600'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                        Antigo Testamento
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                            {oldTestamentBooks.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTestament('new')}
                        className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTestament === 'new'
                                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Novo Testamento
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {newTestamentBooks.length}
                        </span>
                    </button>
                </div>

                {/* Books Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-2">
                        {displayBooks.map((book) => (
                            <button
                                key={book.abbrev}
                                className={`text-left px-4 py-3 bg-gray-50 hover:border-2 border border-gray-200 rounded-lg transition-all ${activeTestament === 'old'
                                        ? 'hover:bg-amber-50 hover:border-amber-300'
                                        : 'hover:bg-blue-50 hover:border-blue-300'
                                    }`}
                            >
                                <p className="font-medium text-gray-900">{book.name}</p>
                                <p className="text-xs text-gray-500">{book.chapters} capítulos</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Footer */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 text-center">
                    📖 <strong>Tradução:</strong> João Ferreira de Almeida • <strong>{displayBooks.length} livros</strong>
                </p>
            </div>
        </main>
    );
};

export default BiblePage;
