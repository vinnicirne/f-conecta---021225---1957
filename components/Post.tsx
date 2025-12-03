import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';

interface PostProps {
  data: {
    id: number;
    user: {
      name: string;
      avatar: string;
      role?: string;
    };
    time: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
  }
}

export const Post: React.FC<PostProps> = ({ data }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(data.likes);

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Post Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={data.user.avatar} 
            alt={data.user.name} 
            className="w-10 h-10 rounded-full bg-gray-100 object-cover ring-2 ring-white"
          />
          <div>
            <h4 className="font-semibold text-sm text-gray-900 leading-tight">
              {data.user.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{data.time}</span>
              {data.user.role && (
                <>
                  <span>•</span>
                  <span className="text-indigo-600 font-medium">{data.user.role}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content (Text) */}
      <div className="px-3 pb-2">
        <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {data.content}
        </p>
      </div>

      {/* Post Image */}
      {data.image && (
        <div className="relative bg-gray-100 aspect-video w-full overflow-hidden">
          <img 
            src={data.image} 
            alt="Post content" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-500' : 'text-gray-600'}`}
            >
              <Heart size={22} className={liked ? 'fill-current' : ''} />
            </button>
            <button className="text-gray-600 hover:text-indigo-600 transition-colors">
              <MessageCircle size={22} />
            </button>
            <button className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Share2 size={22} />
            </button>
          </div>
          <button className="text-gray-600 hover:text-indigo-600 transition-colors">
            <Bookmark size={22} />
          </button>
        </div>
        
        <div className="text-xs font-semibold text-gray-900">
          {likesCount} curtidas
        </div>
        {data.comments > 0 && (
          <div className="text-xs text-gray-500 mt-1 cursor-pointer">
            Ver todos os {data.comments} comentários
          </div>
        )}
      </div>
    </div>
  );
};