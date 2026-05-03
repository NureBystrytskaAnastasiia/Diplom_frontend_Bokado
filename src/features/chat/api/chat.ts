import axios from 'axios';
import type { Chat, User, Message, BackendMessage, TypingStatus } from '../types/chat';

const BASE_URL = 'https://localhost:7192';

let socket: WebSocket | null = null;
let onlineUsersCallback: ((users: number[]) => void) | null = null;
let typingCallback: ((typing: TypingStatus) => void) | null = null;
let messageCallback: ((message: Message) => void) | null = null;

export const initializeWebSocket = (
  onOnlineUsers: (users: number[]) => void,
  onTyping: (typing: TypingStatus) => void,
  onNewMessage: (message: Message) => void
) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  socket = new WebSocket(`ws://localhost:7192/ws?token=${token}`);
  
  onlineUsersCallback = onOnlineUsers;
  typingCallback = onTyping;
  messageCallback = onNewMessage;

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'onlineUsers':
          onlineUsersCallback?.(data.users);
          break;
        case 'typing':
          typingCallback?.(data);
          break;
        case 'newMessage':
          messageCallback?.(convertBackendMessage(data.message));
          break;
        case 'messageRead':
          break;
      }
    } catch (error) {
      console.error('WebSocket message parsing error:', error);
    }
  };

  socket.onclose = () => {
    setTimeout(() => {
      if (socket?.readyState === WebSocket.CLOSED) {
        initializeWebSocket(onOnlineUsers, onTyping, onNewMessage);
      }
    }, 3000);
  };
};

export const closeWebSocket = () => {
  socket?.close();
  socket = null;
};

export const sendTypingStatus = (chatId: number, isTyping: boolean) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'typing',
      chatId,
      isTyping
    }));
  }
};

const convertBackendMessage = (backendMsg: BackendMessage): Message => {
  return {
    messageId: backendMsg.messageId,
    chatId: backendMsg.chatId,
    senderId: backendMsg.senderId,
    senderUsername: backendMsg.sender?.username || 'Невідомий',
    text: backendMsg.text,
    attachedFileUrl: backendMsg.attachment ? `${BASE_URL}${backendMsg.attachment}` : undefined,
    sentAt: backendMsg.sentAt,
    isRead: backendMsg.isRead,
    deliveredAt: backendMsg.deliveredAt,
    readAt: backendMsg.readAt,
    attachment: backendMsg.attachment,
    sender: backendMsg.sender
  };
};

export const getChats = async (): Promise<Chat[]> => {
  const response = await axios.get(`${BASE_URL}/api/Chat/chats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  const chatsWithDetails = await Promise.all(
    response.data.map(async (chat: Chat) => {
      try {
        const messages = await getChatMessages(chat.chatId);
        const unreadMessages = messages.filter(msg => !msg.isRead && msg.senderId !== getCurrentUserId());
        const lastMessage = messages[messages.length - 1];
        
        return {
          ...chat,
          lastMessage: lastMessage ? {
            text: lastMessage.text || (lastMessage.attachedFileUrl ? '📎 Прикріплення' : ''),
            sentAt: lastMessage.sentAt,
            senderId: lastMessage.senderId,
            isRead: lastMessage.isRead
          } : undefined,
          unreadCount: unreadMessages.length
        };
      } catch (error) {
        return { ...chat, unreadCount: 0 };
      }
    })
  );
  
  return chatsWithDetails;
};

const getCurrentUserId = (): number => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload.userId || payload.sub || payload.id);
    } catch (error) {
      return 0;
    }
  }
  return 0;
};

export const createChat = async (withUserId: number): Promise<Chat> => {
  const response = await axios.post(
    `${BASE_URL}/api/Chat/Create?withUserId=${withUserId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: '*/*',
      },
    }
  );
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${BASE_URL}/api/User/all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

export const getOnlineUsers = async (): Promise<number[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/User/online`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get online users:', error);
    return [];
  }
};

export const getChatMessages = async (chatId: number): Promise<Message[]> => {
  const response = await axios.get<BackendMessage[]>(`${BASE_URL}/api/Chat/${chatId}/messages`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  return response.data.map(convertBackendMessage);
};

export const sendMessage = async (
  chatId: number,
  text: string,
  attachedFile?: File
): Promise<any> => {
  const formData = new FormData();
  formData.append('ChatId', chatId.toString());
  formData.append('Text', text.trim());

  if (attachedFile) {
    formData.append('attachedFile', attachedFile);
  }

  const response = await axios.post(`${BASE_URL}/api/Chat/send`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const markMessageAsRead = async (messageId: number): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/Chat/message/${messageId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    console.error('Failed to mark message as read:', error);
  }
};

export const markChatAsRead = async (chatId: number): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/Chat/${chatId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    console.error('Failed to mark chat as read:', error);
  }
};

export const deleteMessage = async (messageId: number): Promise<any> => {
  const response = await axios.delete(`${BASE_URL}/api/Chat/message/${messageId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

let onlineUsersCache: number[] = [];
export const checkUserOnlineStatus = (userId: number): boolean => {
  return onlineUsersCache.includes(userId);
};

export const updateOnlineUsersCache = (users: number[]) => {
  onlineUsersCache = users;
};

export const sendVoiceMessage = async (
  chatId: number,
  voiceFile: File
): Promise<any> => {
  const formData = new FormData();
  formData.append('ChatId', chatId.toString());
  formData.append('Text', '');
  formData.append('attachedFile', voiceFile);

  const response = await axios.post(`${BASE_URL}/api/Chat/send`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
export const deleteChat = async (chatId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/api/Chat/${chatId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
