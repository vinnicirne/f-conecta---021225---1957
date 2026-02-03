
export type FontOption = 'sans' | 'serif' | 'mono' | 'script' | 'display';

export interface PostStyles {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  highlight: boolean;
  font: FontOption;
  textColor: string;
  backgroundColor: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: number;
}

export interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  type: 'text' | 'media' | 'audio';
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  audioUrl?: string;
  styles?: PostStyles;
  likes: number;
  hasLiked: boolean;
  comments: Comment[];
  commentsCount: number;
  createdAt: number;
  repostCount: number;
  isRepost?: boolean;
  originalAuthor?: string;
  userId?: string; // ID do autor do post
}

export enum PostTab {
  TEXT = 'TEXT',
  GALLERY = 'GALLERY',
  CAMERA = 'CAMERA',
  AUDIO = 'AUDIO'
}
