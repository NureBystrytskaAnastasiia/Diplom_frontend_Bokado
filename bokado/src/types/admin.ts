export interface UserDetailInfoDto {
  userId: number;
  username: string;
  email: string;
  birthDate: string;
  avatarUrl?: string;
  bio?: string;
  status?: string;
  level: number;
  city?: string;
  isPremium: boolean;
  isBanned: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastActive: string;
  userInterests: any[];
  friends: any[];
  swipes: any[];
  chatParticipants: any[];
  eventParticipants: any[];
  userChallenges: any[];
  messages: any[];
  createdEvents: any[];
}

export interface Challenge {
  challengeId: number;
  title: string;
  description: string;
  reward: number;
  createdAt: string;
  isActive: boolean;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  avatarUrl: string;
  isAdmin: boolean;
  isBanned: boolean;
  isPremium: boolean;
  // інші поля...
}

export interface Stats {
  [key: string]: number;  // Наприклад, {'2024-06': 10, '2024-07': 20}
}

// Добавляем типы для userStats
export interface UserInfo {
  userId: number;
  username: string;
  birthDate: string;
  city?: string;
  status?: string;
  level: number | string;
  isPremium: boolean;
}

export interface UserStat {
  [date: string]: UserInfo[];
}

// Тип для массива статистики пользователей
export type UserStatsArray = UserStat[];