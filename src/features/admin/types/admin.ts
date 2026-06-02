export interface UserDetailInfoDto {
  userId:           number;
  username:         string;
  email:            string;
  birthDate:        string;
  createdAt:        string;
  isPremium:        boolean;
  isBanned:         boolean;
  isAdmin:          boolean;
  avatarUrl:        string | null;
  userInterests:    unknown[];
  friends:          unknown[];
  swipes:           unknown[];
  chatParticipants: unknown[];
  eventParticipants:unknown[];
  userChallenges:   unknown[];
  messages:         unknown[];
  createdEvents:    unknown[];
}

export interface Challenge {
  challengeId: number;
  title: string;
  description: string;
  reward: number;
  createdAt: string;
  isActive?: boolean
}

export interface User {
  userId: number;
  username: string;
  email: string;
  avatarUrl: string;
  isAdmin: boolean;
  isBanned: boolean;
  isPremium: boolean;
}

export interface Stats {
  [key: string]: number;
}

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

export type UserStatsArray = UserStat[];