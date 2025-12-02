import React, { useEffect } from 'react';
import { Heart, UserPlus, MessageCircle, Bell, AtSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { notifications, users, markNotificationsRead } = useApp();

  useEffect(() => {
    markNotificationsRead();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={16} className="text-white fill-current" />;
      case 'comment': return <MessageCircle size={16} className="text-white fill-current" />;
      case 'follow': return <UserPlus size={16} className="text-white" />;
      case 'mention': return <AtSign size={16} className="text-white" />;
      default: return <Bell size={16} className="text-white" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'like': return 'bg-red-500';
      case 'comment': return 'bg-blue-500';
      case 'follow': return 'bg-violet-500';
      case 'mention': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  const getUser = (userId: string) => {
      return users.find(u => u.id === userId) || { name: 'Usuário', avatar: '' };
  };

  return (
    <div className="pb-20">
      <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">Notificações</h1>
      </div>

      <div className="divide-y divide-slate-100 bg-white">
        {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Bell size={48} className="mb-4 opacity-20" />
                <p>Nenhuma notificação por enquanto.</p>
            </div>
        ) : (
            notifications.map(notification => {
            const user = getUser(notification.userId);
            return (
                <div key={notification.id} className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                <div className="relative flex-shrink-0">
                    <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white ${getColor(notification.type)}`}>
                        {getIcon(notification.type)}
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-slate-800">
                    <span className="font-bold">{user.name}</span> {notification.text.replace(user.name, '')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{notification.date}</p>
                </div>
                {!notification.read && (
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                )}
                </div>
            );
            })
        )}
      </div>
    </div>
  );
};
