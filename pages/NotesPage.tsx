import React from 'react';

const NotesPage: React.FC = () => {
    const notes = [
        {
            id: 1,
            title: 'Estudo sobre Fé',
            scripture: 'Hebreus 11',
            content: 'A fé é a certeza daquilo que esperamos...',
            date: '2 dias atrás',
            color: 'bg-yellow-100'
        },
        {
            id: 2,
            title: 'Reflexões sobre Amor',
            scripture: '1 Coríntios 13',
            content: 'O amor é paciente, o amor é bondoso...',
            date: '1 semana atrás',
            color: 'bg-pink-100'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 Minhas Notas</h1>
                    <p className="text-gray-600">Registre suas reflexões e estudos bíblicos</p>
                </div>

                <button className="w-full mb-6 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nova Nota
                </button>

                <div className="space-y-4">
                    {notes.map((note) => (
                        <div key={note.id} className={`${note.color} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="flex items-start justify-between mb-2">
                                <h2 className="text-lg font-bold text-gray-900">{note.title}</h2>
                                <button className="text-gray-500 hover:text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-sm text-blue-600 font-semibold mb-3">{note.scripture}</p>
                            <p className="text-gray-700 mb-3">{note.content}</p>
                            <p className="text-xs text-gray-500">{note.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotesPage;
