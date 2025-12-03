import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Trash2, Edit2, UserPlus, UserCheck, Repeat } from 'lucide-react';

interface PostProps {
  data: {
    id: number;
    user: {
      id?: string;
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
    style?: {
      font: string;
      background: string;
      color: string;
    };
  };
  isOwner?: boolean;
  onDelete?: () => void;
}

export const Post: React.FC<PostProps> = ({ data, isOwner, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(data.likes);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsCount, setCommentsCount] = useState(data.comments);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FéConecta',
          text: `Confira este post de ${data.user.name}`,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      alert("Link copiado!");
    }
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      
      {/* Post Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={data.user.avatar} 
            alt={data.user.name} 
            className="w-10 h-10 rounded-full bg-gray-100 object-cover ring-2 ring-white"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                {data.user.name}
              </h4>
              {!isOwner && (
                <button 
                  onClick={handleFollow}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors flex items-center gap-1
                    ${isFollowing ? 'bg-gray-100 text-gray-600' : 'bg-indigo-50 text-indigo-600'}`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={10} /> Seguindo
                    </>
                  ) : (
                    <>
                      <UserPlus size={10} /> Seguir
                    </>
                  )}
                </button>
              )}
            </div>
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
        
        <div className="relative">
          <button onClick={toggleMenu} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <MoreHorizontal size={20} />
          </button>
          
          {showMenu && isOwner && (
            <div className="absolute right-0 top-8 bg-white shadow-xl rounded-lg border border-gray-100 py-1 w-32 z-10 animate-in fade-in zoom-in-95 duration-100">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Edit2 size={14} /> Editar
              </button>
              <button onClick={onDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content (Text with Style) */}
      <div className={`px-4 pb-3 ${data.style?.background || 'bg-white'}`}>
        <div 
          className={`text-sm whitespace-pre-line leading-relaxed ${data.style?.font || 'font-sans'} ${data.style?.color || 'text-gray-800'}`}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>

      {/* Post Image */}
      {data.image && (
        <div className="relative bg-gray-100 w-full overflow-hidden">
          <img 
            src={data.image} 
            alt="Post content" 
            className="w-full h-auto max-h-[500px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-3">
          <div className="flex items-center gap-1">
             <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${liked ? 'bg-red-50 text-red-500' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <Heart size={20} className={liked ? 'fill-current animate-[ping_0.2s_ease-in-out]' : ''} />
              <span className="text-sm font-semibold">{liked ? 'Fé!' : 'Fé'}</span>
            </button>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <MessageCircle size={20} />
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-50 text-gray-600 transition-colors">
              <Repeat size={20} />
            </button>
          </div>
          
          <div className="flex gap-1">
            <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-50 text-gray-600">
                <Share2 size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-50 text-gray-600">
                <Bookmark size={20} />
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 px-1 mb-2">
           <span className="font-medium text-gray-900">{likesCount} fés</span>
           <span>•</span>
           <span>{commentsCount} comentários</span>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mt-2">
               <input 
                 type="text"
                 placeholder="Deixe uma palavra de ânimo..."
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
                 className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-300"
               />
               <button 
                 disabled={!commentText.trim()}
                 onClick={() => { setCommentsCount(p => p + 1); setCommentText(''); }}
                 className="text-indigo-600 font-semibold text-sm disabled:opacity-50 px-2"
               >
                 Enviar
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
