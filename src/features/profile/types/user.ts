export interface UserProfile {
  userId: number;
  username: string;
  birthDate: string;
  avatarUrl: string | null;
  bio: string | null;
  status: string | null;
  level: number;
  city: string | null;
  userInterests?: Interest[];
  isPremium: boolean;
  isBanned: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastActive: string;
}

export interface UserDetailInfo {
  userId: number;
  username: string;
  email: string;
  birthDate: string;
  avatarUrl: string | null;
  bio: string | null;
  status: string | null;
  level: number;
  city: string | null;
  isPremium: boolean;
  isBanned: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastActive: string;
  userInterests: Interest[];
  friends: any[];
  swipes: any[];
  chatParticipants: any[];
  eventParticipants: any[];
  userChallenges: any[];
  messages: any[];
  createdEvents: any[];
}

export interface UpdateProfileRequest {
  userIcon?: File;
  username: string;
  birthDate: string;
  avatarUrl?: string | null;
  bio?: string;
  status?: string;
  password?: string;
  city?: string;
  userInterests?: string[];
}

export interface Interest {
  interestId: number;
  name: string;
  category: string;
}
export interface User {
  userId: number;
  username: string;
  isAdmin: boolean;
  isBanned: boolean;
}
