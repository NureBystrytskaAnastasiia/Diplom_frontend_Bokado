export interface ChatUser {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  avatarUrl?: string;
  lastActive?: string;
}

export interface Chat {
  chatId: number;
  createdAt: string;
  secondMember?: ChatUser;

  // Групові поля (після фіксу беку)
  isGroup?: boolean;
  groupId?: number;
  groupName?: string;

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
  text: string;
  attachment?: string;
  sentAt: string;
  isRead: boolean;
  sender?: ChatUser;
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
}