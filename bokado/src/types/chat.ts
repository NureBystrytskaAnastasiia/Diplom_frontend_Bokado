// types/chat.ts
export interface User {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  avatarUrl?: string;
  bio?: string;
  status?: 'online' | 'offline' | 'typing';
  level?: number;
  city?: string;
  isPremium?: boolean;
  isBanned?: boolean;
  createdAt?: string;
  lastActive?: string;
  isOnline?: boolean;
  isTyping?: boolean;
}

export interface Chat {
  chatId: number;
  createdAt: string;
  secondMember: User;
  lastMessage?: {
    text: string;
    sentAt: string;
    senderId: number;
    isRead: boolean;
  };
  unreadCount?: number;
}

export interface Message {
  messageId: number;
  chatId: number;
  senderId: number;
  senderUsername: string;
  text: string;
  attachedFileUrl?: string;
  sentAt: string;
  isRead: boolean;
  deliveredAt?: string;
  readAt?: string;
  attachment?: string;
  sender?: User;
}

export interface BackendMessage {
  messageId: number;
  chatId: number;
  senderId: number;
  text: string;
  attachment: string;
  sentAt: string;
  isRead: boolean;
  deliveredAt?: string;
  readAt?: string;
  chat: any;
  sender: User;
}

export interface SendMessageRequest {
  chatId: number;
  text?: string;
  attachedFile?: File;
}

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  onlineUsers: number[];
  typingUsers: { [chatId: number]: number[] };
}

export type UserStatus = 'online' | 'offline' | 'typing';

export interface TypingStatus {
  chatId: number;
  userId: number;
  isTyping: boolean;
}