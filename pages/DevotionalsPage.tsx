import React from 'react';

const DevotionalsPage: React.FC = () => {
    const devotionals = [
        {
            id: 1,
            title: 'A Fé que Move Montanhas',
            scripture: 'Mateus 17:20',
            excerpt: 'Hoje vamos refletir sobre o poder da fé em nossas vidas...',
            date: 'Hoje',
            image: 'https://picsum.photos/id/1015/400/250'
        },
        {
            id: 2,
            title: 'O Amor que Transforma',
            scripture: '1 João 4:19',
            excerpt: 'O amor de Deus é transformador e nos capacita...',
            date: 'Ontem',
            image: 'https://picsum.photos/id/1018/400/250'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">✨ Devocionais Diários</h1>
                    <p className="text-gray-600">Alimento espiritual para cada dia</p>
                </div>

                <div className="space-y-6">
                    {devotionals.map((devotional) => (
                        <div key={devotional.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <img
                                src={devotional.image}
                                alt={devotional.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-purple-600 uppercase">{devotional.date}</span>
                                    <span className="text-xs text-gray-500">{devotional.scripture}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{devotional.title}</h2>
                                <p className="text-gray-600 mb-4">{devotional.excerpt}</p>
                                <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors">
                                    Ler Devocional
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DevotionalsPage;
