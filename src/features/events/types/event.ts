export interface EventParticipant {
  eventParticipantId: number;
  eventId: number;
  userId: number;
  joinedAt: string;
  user?: User;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  passwordHash?: string;
  birthDate?: string;
  avatarUrl?: string;
  bio?: string;
  status?: string;
  level?: number;
  city?: string;
  isPremium?: boolean;
  isBanned?: boolean;
  isAdmin?: boolean;
  createdAt?: string;
  lastActive?: string;
}

export interface Event {
  eventId: number;
  title: string;
  description?: string;
  date: string;
  city?: string;
  maximum: number;
  creatorId: number;
  createdAt: string;
  creator: User;
  participants?: EventParticipant[];
}

export interface EventDto {
  title: string;
  description?: string;
  date: string;
  city?: string;
  maximum: number;
  createdAt?: string;
}

// Для PUT /api/event/{eventId}
export interface UpdateEventDto {
  title?: string;
  description?: string;
  date?: string;
  city?: string;
}
