export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  avatarUrl: string;
  reportCount: number;
}

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export enum ReportType {
  HATE_SPEECH = 'HATE_SPEECH',
  SPAM = 'SPAM',
  FAKE_NEWS = 'FAKE_NEWS',
  NUDITY = 'NUDITY'
}

export interface Report {
  id: string;
  targetId: string; // Post ID or User ID
  targetContent: string;
  reporterName: string;
  type: ReportType;
  status: ReportStatus;
  createdAt: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface StatMetric {
  label: string;
  value: string | number;
  change: number; // Percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  name: string;
  value: number;
  value2?: number;
}