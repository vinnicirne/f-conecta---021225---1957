import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreVertical, 
  Flag, 
  Trash2, 
  Edit2,
  Repeat
} from 'lucide-react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';

interface FeedPostProps {
  post: Post;
}

export const FeedPost: React.FC<FeedPostProps> = ({ post }) => {
  const { getUserById, toggleLike, currentUser } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const author = getUserById(post.authorId);
  const isAuthor = post.authorId === currentUser.id;

  if (!author) return null;

  const handleLike = () => {
    toggleLike(post.id);
  };

  const isRichText = post.style && post.style.backgroundColor && post.style.backgroundColor !== 'bg-white';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-10 h-10 rounded-full object-cover border border-slate-100"
          />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{author.name}</h4>
            <p className="text-xs text-slate-500">{post.date}</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-10 py-1">
              {isAuthor ? (
                <>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Edit2 size={16} /> Editar Post
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 size={16} /> Excluir
                    </button>
                </>
              ) : (
                <button className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 flex items-center gap-2">
                    <Flag size={16} /> Denunciar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className={`
        ${isRichText ? `min-h-[240px] flex items-center justify-center p-8 text-center text-xl` : 'p-4'}
        ${post.style?.backgroundColor || 'bg-white'}
        ${post.style?.fontFamily || 'font-sans'}
        ${post.style?.isBold ? 'font-bold' : ''}
        ${post.style?.isItalic ? 'italic' : ''}
        ${post.style?.isUnderline ? 'underline' : ''}
      `}>
        {post.type === 'image' && post.mediaUrl && (
          <img src={post.mediaUrl} alt="Post content" className="w-full h-auto rounded-lg mb-2" />
        )}
        <p className={`whitespace-pre-wrap ${isRichText ? 'text-slate-900' : 'text-slate-800'}`}>
          {post.content}
        </p>
      </div>

      {/* Action Bar */}
      <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${post.isLikedByCurrentUser ? 'text-red-500' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Heart size={20} className={post.isLikedByCurrentUser ? 'fill-current' : ''} />
            {post.isLikedByCurrentUser ? 'Amém' : 'Amém'} 
            {post.likes > 0 && <span className="ml-1 text-slate-400 font-normal">({post.likes})</span>}
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <MessageCircle size={20} />
            Comentar
            {post.comments > 0 && <span className="ml-1 text-slate-400 font-normal">({post.comments})</span>}
          </button>

          <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
            <Share2 size={20} />
            Compartilhar
          </button>
        </div>
        
        <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Repostar">
             <Repeat size={20} />
        </button>
      </div>

      {/* Comments Section (Expanded) */}
      {showComments && (
        <div className="bg-slate-50 p-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
           <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                 <img src="https://picsum.photos/32/32?random=1" className="w-8 h-8 rounded-full" />
                 <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-sm border border-slate-200">
                    <span className="font-bold text-slate-900 block text-xs mb-1">Irmão José</span>
                    Glória a Deus por essa palavra! 🙌
                 </div>
              </div>
           </div>
           
           <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Escreva um comentário abençoado..."
                className="flex-1 px-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
              <button className="text-blue-600 font-medium text-sm hover:underline">Enviar</button>
           </div>
        </div>
      )}
    </div>
  );
};
