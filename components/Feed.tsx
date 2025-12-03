import React, { useState } from 'react';
import { MessageOfTheDay } from './MessageOfTheDay';
import { Post } from './Post';
import { CreatePost } from './CreatePost';

const CURRENT_USER = {
  name: 'Visitante',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Visitante',
  role: 'Membro',
  id: 'me'
};

const MOCK_POSTS = [
  {
    id: 1,
    user: {
      id: 'u1',
      name: 'Pr. Antônio Carlos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pastor',
      role: 'Pastor Sênior'
    },
    time: '2h atrás',
    content: 'Culto abençoado de hoje pela manhã! Que a paz de Cristo esteja com todos vocês nesta semana que se inicia. Não esqueçam de ler o Salmo 23 hoje.',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop',
    likes: 124,
    comments: 18,
    shares: 5
  },
  {
    id: 2,
    user: {
      id: 'u2',
      name: 'Grupo de Jovens - Águias',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Jovens',
      role: 'Grupo Oficial'
    },
    time: '4h atrás',
    content: 'Galera, sábado tem vigília! Tragam seus amigos. Vai ser power! 🔥🙏',
    likes: 56,
    comments: 42,
    shares: 12
  },
  {
    id: 3,
    user: {
      id: 'u3',
      name: 'Mariana Souza',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana',
    },
    time: '6h atrás',
    content: 'Agradecida por mais um dia. "O Senhor é a minha força e o meu escudo; nele o meu coração confia, e dele recebo ajuda." Salmos 28:7',
    likes: 89,
    comments: 7,
    shares: 2
  }
];

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleNewPost = (postData: any) => {
    setPosts([postData, ...posts]);
  };

  const handleDeletePost = (postId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  return (
    <div className="flex flex-col gap-2 pb-4 bg-gray-50 min-h-full">
      {/* Componente Hero Fixo no Topo do Feed */}
      <div className="px-4 pt-4 pb-2">
        <MessageOfTheDay />
      </div>

      <CreatePost onPost={handleNewPost} currentUser={CURRENT_USER} />

      <div className="flex flex-col gap-4 px-4 pb-4">
        {posts.map(post => (
          <Post 
            key={post.id} 
            data={post} 
            isOwner={post.user.id === CURRENT_USER.id}
            onDelete={() => handleDeletePost(post.id)}
          />
        ))}
        
        {/* Loading / End of Feed */}
        <div className="py-6 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Isso é tudo por enquanto
          </p>
          <div className="w-1 h-12 bg-gray-200 mx-auto mt-4 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
