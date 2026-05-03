export interface EventParticipant {
  eventParticipantId: number;
  eventId: number;
  userId: number;
  joinedAt: string;
  user?: User; // Додано для отримання інформації про користувача
  
}

export interface User {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
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
  creator: User; // Бекенд повертає об'єкт створювача
  participants?: EventParticipant[]; // Можливо буде додано пізніше
}

export interface EventDto {
  title: string;
  description?: string;
  date: string;
  city?: string;
  maximum: number;
  createdAt?: string; // Бекенд очікує це поле
}