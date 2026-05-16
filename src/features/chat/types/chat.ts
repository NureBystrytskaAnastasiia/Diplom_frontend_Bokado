// src/features/chat/types/chat.ts

export interface ChatUser {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  avatarUrl?: string | null;
  lastActive?: string;
}

export interface Chat {
  chatId: number;
  createdAt: string;
  // Особистий чат
  isGroup?: boolean;        // false або відсутнє = особистий
  secondMember?: ChatUser;
  // Груповий чат (через Groups)
  groupId?: number;
  groupName?: string;
  groupAvatarUrl?: string | null;

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
  senderUsername?: string;
  senderAvatarUrl?: string | null;
  text: string;
  attachment?: string;
  sentAt: string;
  isRead: boolean;
  sender?: ChatUser;
}

export interface BackendMessage {
  messageId: number;
  chatId: number;
  senderId: number;
  text: string;
  attachment?: string;
  sentAt: string;
  isRead: boolean;
  deliveredAt?: string;
  readAt?: string;
  sender?: {
    userId: number;
    username: string;
    avatarUrl?: string | null;
    email: string;
    isAdmin: boolean;
  };
}

export interface SendMessageRequest {
  chatId: number;
  text?: string;
  attachedFile?: File;
}

export interface TypingStatus {
  chatId: number;
  userId: number;
  isTyping: boolean;
}

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  onlineUsers: number[];
  typingUsers: Record<number, boolean>;
}