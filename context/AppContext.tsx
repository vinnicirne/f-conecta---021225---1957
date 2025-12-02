
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, Notification, UserRole, UserStatus, Community, Note, DraftPost, BibleVerse, StudyPlan, UserPlanProgress, CommunityEvent, Transaction } from '../types';

interface AppContextType {
  currentUser: User;
  users: User[];
  posts: Post[];
  notifications: Notification[];
  communities: Community[];
  notes: Note[];
  draftPost: DraftPost | null;
  selectedVerseForNote: BibleVerse | null;
  studyPlans: StudyPlan[];
  userPlanProgress: UserPlanProgress[];
  unreadNotifications: number;
  searchQuery: string;
  // Navigation
  selectedCommunityId: string | null;
  
  setSearchQuery: (query: string) => void;
  toggleFollow: (userId: string) => void;
  toggleLike: (postId: string) => void;
  addPost: (post: Post) => void;
  markNotificationsRead: () => void;
  getUserById: (id: string) => User | undefined;
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  setDraftPost: (draft: DraftPost | null) => void;
  setSelectedVerseForNote: (verse: BibleVerse | null) => void;
  // New Methods for Plans
  subscribeToPlan: (planId: string) => void;
  completePlanDay: (planId: string, dayNumber: number) => void;
  togglePlanReminder: (planId: string) => void;
  // New Methods for Community
  joinCommunity: (communityId: string) => void;
  viewCommunity: (communityId: string) => void;
  toggleEventRSVP: (communityId: string, eventId: string) => void;
  createCommunity: (name: string, description: string) => void;
  processDonation: (communityId: string, amount: number, method: string) => void;
  promoteCommunity: (communityId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Initial Data
const CURRENT_USER: User = {
  id: 'me',
  name: 'Admin User',
  handle: '@admin',
  email: 'admin@feconecta.com',
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  joinedDate: '2023-01-01',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
  reportsCount: 0,
  followers: 1205,
  following: 45,
  bio: 'Apaixonado por tecnologia e fé.'
};

const MOCK_USERS: User[] = [
  CURRENT_USER,
  { 
    id: 'u1', name: 'Pastor Marcos', handle: '@prmarcos', email: 'marcos@email.com', 
    role: UserRole.USER, status: UserStatus.ACTIVE, joinedDate: '2023-02-01', 
    avatar: 'https://ui-avatars.com/api/?name=Marcos&background=random', 
    reportsCount: 0, followers: 5000, following: 120, isFollowing: true,
    bio: 'Servindo ao Reino com alegria. 📖',
    isVerified: true
  },
  { 
    id: 'u2', name: 'Grupo de Jovens', handle: '@jovenszion', email: 'jovens@email.com', 
    role: UserRole.USER, status: UserStatus.ACTIVE, joinedDate: '2023-03-01', 
    avatar: 'https://ui-avatars.com/api/?name=Jovens&background=ffeb3b&color=333', 
    reportsCount: 0, followers: 800, following: 0, isFollowing: false,
    bio: 'Encontros todo sábado às 19h!',
    isVerified: true
  },
  { 
    id: 'u3', name: 'Ana Paula', handle: '@anap', email: 'ana@email.com', 
    role: UserRole.USER, status: UserStatus.ACTIVE, joinedDate: '2023-04-01', 
    avatar: 'https://ui-avatars.com/api/?name=Ana&background=pink&color=fff', 
    reportsCount: 0, followers: 300, following: 300, isFollowing: true,
    bio: 'Mãe, esposa e serva.'
  },
  { 
    id: 'u4', name: 'Lucas Tech', handle: '@lucas_dev', email: 'lucas@email.com', 
    role: UserRole.USER, status: UserStatus.ACTIVE, joinedDate: '2023-05-01', 
    avatar: 'https://ui-avatars.com/api/?name=Lucas&background=333&color=fff', 
    reportsCount: 0, followers: 150, following: 50, isFollowing: false,
    bio: 'Programando o futuro.'
  }
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p1', authorId: 'u1',
    content: 'Culto maravilhoso ontem à noite! A presença de Deus foi real. Quem estava lá? 🙏🔥 #FéConecta #Adoração',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    likes: 124, comments: 45, shares: 12, date: '2 horas atrás', timestamp: Date.now() - 7200000,
    isLikedByCurrentUser: true
  },
  {
    id: 'p2', authorId: 'u2',
    content: 'Não se esqueçam: Retiro de Verão as inscrições acabam amanhã! Link na bio.',
    type: 'text',
    style: { backgroundColor: 'bg-gradient-to-br from-orange-100 to-yellow-100', fontFamily: 'font-sans', isBold: true },
    likes: 56, comments: 12, shares: 5, date: '4 horas atrás', timestamp: Date.now() - 14400000,
    isLikedByCurrentUser: false
  },
  {
    id: 'p3', authorId: 'u3',
    content: 'O Senhor é o meu pastor e nada me faltará. Salmos 23:1',
    type: 'text',
    style: { backgroundColor: 'bg-white', fontFamily: 'font-serif', isItalic: true },
    likes: 230, comments: 89, shares: 45, date: '5 horas atrás', timestamp: Date.now() - 18000000,
    isLikedByCurrentUser: true
  },
  // Community Post Mock
  {
    id: 'p4', authorId: 'u1', communityId: 'c2',
    content: 'Amanhã iniciaremos nossa nova série de estudos. Preparem seus corações!',
    type: 'text',
    likes: 45, comments: 10, shares: 2, date: '1 dia atrás', timestamp: Date.now() - 86400000,
    isLikedByCurrentUser: false
  }
];

const MOCK_COMMUNITIES: Community[] = [
  { 
    id: 'c1', 
    name: 'Músicos de Alma', 
    members: 1240, 
    image: 'https://picsum.photos/id/2/200/200',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f5941b1b86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 
    description: 'Para quem ama louvar com instrumentos.', 
    isJoined: false,
    adminId: 'u4',
    events: [],
    isVerified: false
  },
  { 
    id: 'c2', 
    name: 'Estudo Bíblico Diário', 
    members: 5300, 
    image: 'https://picsum.photos/id/3/200/200', 
    coverImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Leitura e reflexão da palavra. Junte-se a nós diariamente.', 
    isJoined: true,
    adminId: 'me', // Owned by current user for demo
    isVerified: true,
    isPromoted: false,
    activeLivestream: {
        id: 'live1',
        communityId: 'c2',
        title: 'Estudo ao Vivo: Romanos 8',
        viewerCount: 243,
        isActive: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1490902931801-d6f80ca94fe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    events: [
        {
            id: 'e1',
            communityId: 'c2',
            title: 'Vigília de Oração',
            date: '2023-11-20',
            time: '22:00',
            location: 'Templo Principal - Sala 4',
            description: 'Uma noite de clamor e intercessão.',
            attendees: 45,
            isUserAttending: true
        },
        {
            id: 'e2',
            communityId: 'c2',
            title: 'Café com Pastores',
            date: '2023-11-25',
            time: '08:30',
            location: 'Cantina Comunitária',
            description: 'Momento de comunhão e partilha.',
            attendees: 12,
            isUserAttending: false
        }
    ]
  },
  { 
    id: 'c3', 
    name: 'Missões Urbanas', 
    members: 890, 
    image: 'https://picsum.photos/id/4/200/200', 
    coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Levando amor às ruas da cidade.', 
    isJoined: false,
    isVerified: true,
    isPromoted: true,
    events: []
  },
];

const MOCK_NOTES: Note[] = [
  {
    id: 'n1', title: 'Reflexão sobre a Fé', content: 'Fé é acreditar no que não se vê. É ter a certeza de que Deus está no controle de todas as coisas.',
    date: '2023-10-20', tags: ['Fé', 'Reflexão'], isPrivate: true
  }
];

// Mock Study Plans (kept same as before)
const MOCK_PLANS: StudyPlan[] = [
  {
    id: 'plan1',
    title: 'Paz em meio à Ansiedade',
    description: 'Uma jornada de 5 dias para encontrar a paz de Deus que excede todo entendimento, aprendendo a entregar suas preocupações.',
    authorId: 'u1',
    authorName: 'Pastor Marcos',
    coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalDays: 5,
    category: 'Ansiedade',
    subscribers: 1240,
    days: [
      { 
        dayNumber: 1, 
        title: 'Onde está seu foco?', 
        content: 'A ansiedade muitas vezes nasce quando tiramos os olhos de quem Deus é e focamos nos problemas. Hoje, vamos aprender a realinhar nossa visão.',
        bibleReference: 'Filipenses 4:6-7',
        verseText: 'Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus.'
      },
      { 
        dayNumber: 2, title: 'Entregando o Controle', content: 'Tentar controlar o incontrolável é a receita para o estresse. Deus convida você a soltar as rédeas hoje.', bibleReference: '1 Pedro 5:7' 
      },
      { dayNumber: 3, title: 'Descanso na Alma', content: 'Content 3...', bibleReference: 'Mateus 11:28' },
      { dayNumber: 4, title: 'A Paz que guarda', content: 'Content 4...', bibleReference: 'Isaías 26:3' },
      { dayNumber: 5, title: 'Confiança Renovada', content: 'Content 5...', bibleReference: 'Provérbios 3:5-6' },
    ]
  },
  {
    id: 'plan2',
    title: 'Sabedoria de Provérbios',
    description: 'Aprenda princípios práticos para a vida financeira, familiar e emocional com a sabedoria de Salomão.',
    authorId: 'c2',
    authorName: 'Estudo Bíblico Diário',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalDays: 30,
    category: 'Sabedoria',
    subscribers: 5420,
    days: [
      { dayNumber: 1, title: 'O Temor do Senhor', content: 'O princípio de toda sabedoria começa com o respeito e reverência a Deus.', bibleReference: 'Provérbios 1:7' }
    ]
  },
  {
    id: 'plan3',
    title: 'Fortalecendo a Família',
    description: 'Devocionais curtos para casais e pais que desejam edificar seu lar sobre a rocha.',
    authorId: 'u2',
    authorName: 'Grupo de Jovens Zion',
    coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalDays: 7,
    category: 'Família',
    subscribers: 890,
    days: []
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(MOCK_PLANS);
  const [userPlanProgress, setUserPlanProgress] = useState<UserPlanProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // States for integration
  const [draftPost, setDraftPost] = useState<DraftPost | null>(null);
  const [selectedVerseForNote, setSelectedVerseForNote] = useState<BibleVerse | null>(null);

  // Derived state
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const getUserById = (id: string) => users.find(u => u.id === id);

  const toggleFollow = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const isNowFollowing = !u.isFollowing;
        if (isNowFollowing) {
           addNotification('follow', userId, `${CURRENT_USER.name} começou a seguir você.`);
        }
        return { ...u, isFollowing: isNowFollowing, followers: u.followers + (isNowFollowing ? 1 : -1) };
      }
      return u;
    }));
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLikedByCurrentUser;
        return { ...p, isLikedByCurrentUser: isLiked, likes: p.likes + (isLiked ? 1 : -1) };
      }
      return p;
    }));
  };

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  const addNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (type: Notification['type'], userId: string, text: string) => {
      setTimeout(() => {
        const newNotif: Notification = {
            id: Date.now().toString(),
            type: type,
            userId: userId,
            read: false,
            date: 'Agora',
            text: text 
        };
        setNotifications(prev => [newNotif, ...prev]);
      }, 1000);
  };
  
  // Simulation: Add a fake notification on mount
  useEffect(() => {
      const timer = setTimeout(() => {
          setNotifications(prev => [
              { id: 'n1', type: 'follow', userId: 'u2', read: false, date: '2 min atrás', text: 'Grupo de Jovens começou a seguir você.' },
              { id: 'n2', type: 'like', userId: 'u1', read: false, date: '1 hora atrás', text: 'Pastor Marcos curtiu sua publicação.' }
          ]);
      }, 1000);
      return () => clearTimeout(timer);
  }, []);

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Plan Methods
  const subscribeToPlan = (planId: string) => {
    const existing = userPlanProgress.find(p => p.planId === planId);
    if (existing) return;
    
    setUserPlanProgress(prev => [...prev, {
      planId,
      completedDays: [],
      isCompleted: false,
      startedAt: new Date().toISOString(),
      remindersEnabled: true
    }]);
  };

  const completePlanDay = (planId: string, dayNumber: number) => {
    setUserPlanProgress(prev => prev.map(p => {
      if (p.planId === planId) {
        if (p.completedDays.includes(dayNumber)) return p;
        const newCompleted = [...p.completedDays, dayNumber];
        const plan = studyPlans.find(sp => sp.id === planId);
        const isCompleted = plan ? newCompleted.length === plan.totalDays : false;
        return { ...p, completedDays: newCompleted, isCompleted };
      }
      return p;
    }));
  };

  const togglePlanReminder = (planId: string) => {
    setUserPlanProgress(prev => prev.map(p => {
      if (p.planId === planId) return { ...p, remindersEnabled: !p.remindersEnabled };
      return p;
    }));
  };

  // Community Methods
  const joinCommunity = (communityId: string) => {
      setCommunities(prev => prev.map(c => 
          c.id === communityId ? { ...c, isJoined: !c.isJoined, members: c.members + (c.isJoined ? -1 : 1) } : c
      ));
  };

  const viewCommunity = (communityId: string) => {
      setSelectedCommunityId(communityId);
      // Dispatch nav event
      const event = new CustomEvent('navigate', { detail: 'community' });
      window.dispatchEvent(event);
  };

  const toggleEventRSVP = (communityId: string, eventId: string) => {
      setCommunities(prev => prev.map(c => {
          if (c.id !== communityId) return c;
          const updatedEvents = c.events?.map(e => {
              if (e.id === eventId) {
                  return {
                      ...e,
                      isUserAttending: !e.isUserAttending,
                      attendees: e.attendees + (e.isUserAttending ? -1 : 1)
                  };
              }
              return e;
          });
          return { ...c, events: updatedEvents };
      }));
  };

  const createCommunity = (name: string, description: string) => {
      const newCommunity: Community = {
          id: Date.now().toString(),
          name,
          description,
          members: 1,
          image: `https://ui-avatars.com/api/?name=${name}&background=random`,
          coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f5941b1b86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          isJoined: true,
          adminId: CURRENT_USER.id,
          events: []
      };
      setCommunities(prev => [...prev, newCommunity]);
      viewCommunity(newCommunity.id);
  };

  const processDonation = (communityId: string, amount: number, method: string) => {
    const tx: Transaction = {
        id: Date.now().toString(),
        user: CURRENT_USER.name,
        type: 'donation',
        amount: amount,
        date: new Date().toISOString(),
        status: 'completed',
        relatedCommunityId: communityId,
        note: `Doação via ${method}`
    };
    setTransactions(prev => [tx, ...prev]);
    // Optionally notify admin
  };

  const promoteCommunity = (communityId: string) => {
    setCommunities(prev => prev.map(c => 
        c.id === communityId ? { ...c, isPromoted: true } : c
    ));
    const tx: Transaction = {
        id: Date.now().toString(),
        user: CURRENT_USER.name,
        type: 'community_promotion',
        amount: 49.90, // Fixed mock price
        date: new Date().toISOString(),
        status: 'completed',
        relatedCommunityId: communityId,
        note: 'Destaque na Busca'
    };
    setTransactions(prev => [tx, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentUser: CURRENT_USER,
      users,
      posts,
      notifications,
      communities,
      notes,
      studyPlans,
      userPlanProgress,
      unreadNotifications,
      searchQuery,
      draftPost,
      selectedVerseForNote,
      selectedCommunityId,
      setSearchQuery,
      toggleFollow,
      toggleLike,
      addPost,
      addNote,
      deleteNote,
      setDraftPost,
      setSelectedVerseForNote,
      markNotificationsRead,
      getUserById,
      subscribeToPlan,
      completePlanDay,
      togglePlanReminder,
      joinCommunity,
      viewCommunity,
      toggleEventRSVP,
      createCommunity,
      processDonation,
      promoteCommunity
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
