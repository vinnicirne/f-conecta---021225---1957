
import React, { useState } from 'react';
import { Post, Comment } from '../types';
import { formatRelativeTime } from '../lib/utils';
import { parsePostContent } from '../lib/postUtils';
import CommentSection from './CommentSection';
import ShareMenu from './ShareMenu';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onUpdate: (post: Post) => void;
  onDelete: (id: string) => void;
  onRepost: (post: Post) => void;
  onLike?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate, onDelete, onRepost, onLike }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const isOwnPost = user?.id === post.userId;

  const handleLike = () => {
    if (onLike) {
      onLike();
    } else {
      onUpdate({
        ...post,
        likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
        hasLiked: !post.hasLiked
      });
    }
  };



  const handleSaveEdit = () => {
    onUpdate({ ...post, content: editContent });
    setIsEditing(false);
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Repost Header */}
      {post.isRepost && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center space-x-2 text-xs font-medium text-gray-500">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span>Repostado por {post.author}</span>
        </div>
      )}

      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h3 className="font-bold text-gray-900">{post.author}</h3>
            <p className="text-xs text-gray-400">{formatRelativeTime(post.createdAt)}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-10 py-1 overflow-hidden">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                <span>Editar</span>
              </button>
              <button
                onClick={() => onDelete(post.id)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <span>Excluir</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="px-4 pb-4">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditing(false)} className="text-sm px-3 py-1 text-gray-500">Cancelar</button>
              <button onClick={handleSaveEdit} className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg">Salvar</button>
            </div>
          </div>
        ) : post.type === 'text' ? (
          <div
            className={`p-8 rounded-xl flex items-center justify-center text-center shadow-inner ${post.styles?.font === 'serif' ? 'font-serif' : post.styles?.font === 'mono' ? 'font-mono' : post.styles?.font === 'script' ? 'font-script text-3xl' : post.styles?.font === 'display' ? 'font-display uppercase' : ''}`}
            style={{
              background: post.styles?.backgroundColor || '#ffffff',
              color: post.styles?.textColor || '#000000',
              fontWeight: post.styles?.bold ? 'bold' : 'normal',
              fontStyle: post.styles?.italic ? 'italic' : 'normal',
              textDecoration: post.styles?.underline ? 'underline' : 'none'
            }}
          >
            <span style={{ backgroundColor: post.styles?.highlight ? '#fef08a' : 'transparent', color: post.styles?.highlight ? 'black' : 'inherit' }}>
              {post.content}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-800 leading-relaxed">{parsePostContent(post.content)}</p>
            {post.mediaUrl && post.mediaType === 'image' && (
              <div className="relative min-h-[200px] bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={post.mediaUrl}
                  className="w-full rounded-xl object-cover max-h-96"
                  alt="Post content"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            {post.mediaUrl && post.mediaType === 'video' && (
              <video src={post.mediaUrl} controls className="w-full rounded-xl bg-black aspect-video" />
            )}
            {post.audioUrl && (
              <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3 border border-gray-100">
                <div className="p-2 bg-blue-600 text-white rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                </div>
                <audio src={post.audioUrl} controls className="h-8 flex-1" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-around text-gray-500 font-medium text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1.5 px-2 py-2 rounded-lg transition-all active:scale-90 ${post.hasLiked ? 'text-red-500 bg-red-50' : 'hover:bg-gray-50'}`}
        >
          <svg className={`w-5 h-5 flex-shrink-0 ${post.hasLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="whitespace-nowrap">{post.likes} Fé</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-all"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span className="whitespace-nowrap">{post.commentsCount} Comentar</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center space-x-1.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="whitespace-nowrap">Compartilhar</span>
          </button>

          {showShareMenu && (
            <ShareMenu
              postId={post.id}
              onRepost={() => onRepost(post)}
              onClose={() => setShowShareMenu(false)}
            />
          )}
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection postId={post.id} isOpen={showComments} />
    </div>
  );
};

export default PostCard;
