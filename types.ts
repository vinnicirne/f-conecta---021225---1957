
export enum UserRole {
  USER = 'Usuário',
  MODERATOR = 'Moderador',
  ADMIN = 'Administrador'
}

export enum UserStatus {
  ACTIVE = 'Ativo',
  SUSPENDED = 'Suspenso',
  BANNED = 'Banido'
}

export interface User {
  id: string;
  name: string;
  handle: string; // @username
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  avatar: string;
  cover?: string;
  reportsCount: number;
  followers: number;
  following: number;
  isFollowing?: boolean; // Se o usuário logado segue este usuário
  bio?: string;
  isVerified?: boolean; // Para comunidades/parceiros oficiais
}

export interface PostStyle {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
}

export interface Post {
  id: string;
  authorId: string; // Link to User
  communityId?: string; // Optional: If post belongs to a community
  content: string;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  style?: PostStyle;
  likes: number;
  comments: number;
  shares: number;
  date: string; // ISO string or timestamp
  timestamp: number; // For sorting
  isLikedByCurrentUser?: boolean;
}

export interface Report {
  id: string;
  type: 'Spam' | 'Discurso de Ódio' | 'Fake News' | 'Assédio';
  targetId: string;
  targetType: 'Post' | 'User' | 'Message';
  reporter: string;
  status: 'Pendente' | 'Em Análise' | 'Resolvido';
  date: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'donation';
  userId: string; // Quem gerou a notificação
  postId?: string;
  read: boolean;
  date: string;
  text: string;
}

// Community & Events Types

export interface CommunityEvent {
  id: string;
  communityId: string;
  title: string;
  date: string; // ISO Date
  time: string;
  location: string;
  description: string;
  coverImage?: string;
  attendees: number;
  isUserAttending: boolean;
}

export interface Livestream {
  id: string;
  communityId: string;
  title: string;
  viewerCount: number;
  isActive: boolean;
  thumbnailUrl: string;
}

export interface Community {
  id: string;
  name: string;
  members: number;
  image: string;
  coverImage?: string; 
  description: string;
  isJoined?: boolean;
  adminId?: string; // Creator
  isVerified?: boolean; // Verified Badge for donations
  isPromoted?: boolean; // Paid promotion
  events?: CommunityEvent[];
  activeLivestream?: Livestream;
}

export interface ChartData {
  name: string;
  value: number;
  value2?: number;
}

export interface Transaction {
  id: string;
  user: string;
  type: 'subscription' | 'donation' | 'ad' | 'community_promotion';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  relatedCommunityId?: string;
  note?: string;
}

// Bible and Notes Types

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  linkedVerse?: BibleVerse;
  isPrivate: boolean;
}

export interface DraftPost {
  content: string;
  style?: PostStyle;
}

// Devotionals and Study Plans Types

export interface PlanDay {
  dayNumber: number;
  title: string;
  content: string;
  bibleReference?: string; // e.g. "Filipenses 4:6-7"
  verseText?: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  authorId: string; // Community or Partner
  authorName: string;
  coverImage: string;
  totalDays: number;
  category: 'Ansiedade' | 'Família' | 'Sabedoria' | 'Oração' | 'Bíblia';
  subscribers: number;
  days: PlanDay[];
}

export interface UserPlanProgress {
  planId: string;
  completedDays: number[]; // Array of day numbers
  isCompleted: boolean;
  startedAt: string;
  remindersEnabled: boolean;
}
