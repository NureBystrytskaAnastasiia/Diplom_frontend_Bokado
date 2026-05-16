// src/features/chat/api/chat.ts
import axiosInstance, { BASE_URL } from '../../../shared/api/axiosInstance';
import type { Chat, Message, BackendMessage, TypingStatus } from '../types/chat';

/* ── WebSocket ─────────────────────────────────────────────── */
let socket: WebSocket | null = null;
let onlineUsersCallback: ((users: number[]) => void) | null = null;
let typingCallback:      ((t: TypingStatus) => void) | null = null;
let messageCallback:     ((m: Message) => void) | null = null;

export const initializeWebSocket = (
  onOnlineUsers: (users: number[]) => void,
  onTyping:      (t: TypingStatus) => void,
  onNewMessage:  (m: Message) => void
) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  const wsUrl = BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://');
  socket = new WebSocket(`${wsUrl}/ws?token=${token}`);
  onlineUsersCallback = onOnlineUsers;
  typingCallback      = onTyping;
  messageCallback     = onNewMessage;

  socket.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.type === 'onlineUsers') onlineUsersCallback?.(data.users);
      if (data.type === 'typing')      typingCallback?.(data);
      if (data.type === 'newMessage')  messageCallback?.(convertMsg(data.message));
    } catch {}
  };
  socket.onclose = () => {
    setTimeout(() => {
      if (socket?.readyState === WebSocket.CLOSED)
        initializeWebSocket(onOnlineUsers, onTyping, onNewMessage);
    }, 3000);
  };
};

export const closeWebSocket = () => { socket?.close(); socket = null; };
export const sendTypingStatus = (chatId: number, isTyping: boolean) => {
  if (socket?.readyState === WebSocket.OPEN)
    socket.send(JSON.stringify({ type: 'typing', chatId, isTyping }));
};

/* ── Helpers ────────────────────────────────────────────────── */
export const resolveUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${BASE_URL}${path}`;
};

const convertMsg = (m: BackendMessage): Message => ({
  messageId:       m.messageId,
  chatId:          m.chatId,
  senderId:        m.senderId,
  senderUsername:  m.sender?.username ?? 'Невідомий',
  senderAvatarUrl: resolveUrl(m.sender?.avatarUrl),
  text:            m.text ?? '',
  attachment:      m.attachment ? resolveUrl(m.attachment) ?? undefined : undefined,
  sentAt:          m.sentAt,
  isRead:          m.isRead,
  sender:          m.sender ? { ...m.sender, avatarUrl: resolveUrl(m.sender.avatarUrl) } : undefined,
});

/* ── REST ───────────────────────────────────────────────────── */

/**
 * Бек тепер сам повертає особисті + групові чати,
 * avatarUrl, lastMessage, unreadCount — нічого не підвантажуємо окремо.
 */
export const getChats = async (): Promise<Chat[]> => {
  const { data } = await axiosInstance.get<Chat[]>('/api/Chat/chats');
  // Виправляємо avatarUrl якщо прийшов без хоста
  return data.map(chat => ({
    ...chat,
    secondMember: chat.secondMember
      ? { ...chat.secondMember, avatarUrl: resolveUrl(chat.secondMember.avatarUrl) }
      : undefined,
  }));
};

export const createChat = async (withUserId: number): Promise<Chat> => {
  const { data } = await axiosInstance.post(`/api/Chat/Create?withUserId=${withUserId}`, {});
  return {
    ...data,
    secondMember: data.secondMember
      ? { ...data.secondMember, avatarUrl: resolveUrl(data.secondMember.avatarUrl) }
      : undefined,
  };
};

export const getChatMessages = async (chatId: number): Promise<Message[]> => {
  const { data } = await axiosInstance.get<BackendMessage[]>(`/api/Chat/${chatId}/messages`);
  return data.map(convertMsg);
};

export const sendMessage = async (chatId: number, text: string, attachedFile?: File) => {
  const form = new FormData();
  form.append('ChatId', chatId.toString());
  form.append('Text', text.trim());
  if (attachedFile) form.append('attachedFile', attachedFile);
  await axiosInstance.post('/api/Chat/send', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ← ВИПРАВЛЕНО: тепер реально викликає бек PUT /{chatId}/read
export const markChatAsRead = async (chatId: number): Promise<void> => {
  try { await axiosInstance.put(`/api/Chat/${chatId}/read`, {}); } catch {}
};

export const deleteMessage = async (messageId: number) =>
  axiosInstance.delete(`/api/Chat/message/${messageId}`);

export const deleteChat = async (chatId: number) =>
  axiosInstance.delete(`/api/Chat/${chatId}`);

export const sendVoiceMessage = async (chatId: number, voiceFile: File) => {
  const form = new FormData();
  form.append('ChatId', chatId.toString());
  form.append('Text', '');
  form.append('attachedFile', voiceFile);
  await axiosInstance.post('/api/Chat/send', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Зворотна сумісність з chatSlice
export const getUsers    = async () => [];
export const getOnlineUsers = async (): Promise<number[]> => {
  try { const { data } = await axiosInstance.get('/api/User/online'); return data; } catch { return []; }
};

let onlineUsersCache: number[] = [];
export const checkUserOnlineStatus  = (userId: number) => onlineUsersCache.includes(userId);
export const updateOnlineUsersCache = (users: number[]) => { onlineUsersCache = users; };