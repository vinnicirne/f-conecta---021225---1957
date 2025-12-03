import { User, UserRole, UserStatus, Report, ReportType, ReportStatus, ChartData, StatMetric } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    joinedAt: '2023-01-15',
    avatarUrl: 'https://picsum.photos/seed/ana/150/150',
    reportCount: 0
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    email: 'carlos.o@email.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    joinedAt: '2023-03-10',
    avatarUrl: 'https://picsum.photos/seed/carlos/150/150',
    reportCount: 1
  },
  {
    id: '3',
    name: 'Marcos Souza',
    email: 'marcos.souza@email.com',
    role: UserRole.USER,
    status: UserStatus.SUSPENDED,
    joinedAt: '2023-05-22',
    avatarUrl: 'https://picsum.photos/seed/marcos/150/150',
    reportCount: 5
  },
  {
    id: '4',
    name: 'Julia Santos',
    email: 'julia.s@email.com',
    role: UserRole.MODERATOR,
    status: UserStatus.ACTIVE,
    joinedAt: '2023-02-01',
    avatarUrl: 'https://picsum.photos/seed/julia/150/150',
    reportCount: 0
  },
  {
    id: '5',
    name: 'Roberto Firmino',
    email: 'beto@email.com',
    role: UserRole.USER,
    status: UserStatus.BANNED,
    joinedAt: '2023-06-15',
    avatarUrl: 'https://picsum.photos/seed/roberto/150/150',
    reportCount: 12
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'r1',
    targetId: 'p101',
    targetContent: 'Isso é tudo mentira, não acreditem neles! [Fake News Content...]',
    reporterName: 'Maria Clara',
    type: ReportType.FAKE_NEWS,
    status: ReportStatus.PENDING,
    createdAt: '2023-10-25T10:30:00Z',
    severity: 'HIGH'
  },
  {
    id: 'r2',
    targetId: 'c202',
    targetContent: 'Compre seguidores baratos agora! Link na bio.',
    reporterName: 'Sistema Automático',
    type: ReportType.SPAM,
    status: ReportStatus.PENDING,
    createdAt: '2023-10-26T08:15:00Z',
    severity: 'MEDIUM'
  },
  {
    id: 'r3',
    targetId: 'u5',
    targetContent: 'Comentário ofensivo sobre religião.',
    reporterName: 'João Pedro',
    type: ReportType.HATE_SPEECH,
    status: ReportStatus.RESOLVED,
    createdAt: '2023-10-24T14:20:00Z',
    severity: 'HIGH'
  }
];

export const GROWTH_DATA: ChartData[] = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 800 },
  { name: 'Mar', value: 1400 },
  { name: 'Abr', value: 2100 },
  { name: 'Mai', value: 2800 },
  { name: 'Jun', value: 3500 },
  { name: 'Jul', value: 4200 },
];

export const ENGAGEMENT_DATA: ChartData[] = [
  { name: 'Seg', value: 120, value2: 80 },
  { name: 'Ter', value: 132, value2: 90 },
  { name: 'Qua', value: 101, value2: 120 },
  { name: 'Qui', value: 134, value2: 100 },
  { name: 'Sex', value: 190, value2: 150 },
  { name: 'Sab', value: 230, value2: 180 },
  { name: 'Dom', value: 210, value2: 160 },
];

export const INITIAL_METRICS: StatMetric[] = [
  { label: 'Usuários Totais', value: '12,450', change: 12.5, trend: 'up' },
  { label: 'Novos Cadastros (7d)', value: '843', change: 8.2, trend: 'up' },
  { label: 'Denúncias Pendentes', value: '24', change: -5.0, trend: 'down' },
  { label: 'Receita Mensal', value: 'R$ 45.2k', change: 2.1, trend: 'up' },
];