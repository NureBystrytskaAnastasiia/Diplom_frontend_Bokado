import { useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { BASE_URL } from '../../../shared/api/axiosInstance';


let globalConnection: signalR.HubConnection | null = null;
const typingListeners:      Set<(chatId: number, userId: number, isTyping: boolean) => void> = new Set();
const onlineStatusListeners: Set<(userId: number, isOnline: boolean) => void> = new Set();

const getOrCreateConnection = (token: string): signalR.HubConnection => {
  if (globalConnection) return globalConnection;

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URL}/hubs/chat?access_token=${token}`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  connection.on('ReceiveTyping', (chatId: number, userId: number, isTyping: boolean) => {
    typingListeners.forEach(fn => fn(chatId, userId, isTyping));
  });

  connection.on('UserOnlineStatus', (userId: number, isOnline: boolean) => {
    onlineStatusListeners.forEach(fn => fn(userId, isOnline));
  });

  globalConnection = connection;
  return connection;
};

// ── Глобальний хук — викликати в App.tsx ─────────────────────────────────────
export const useChatHubGlobal = (token: string | null) => {
  useEffect(() => {
    if (!token) return;

    const connection = getOrCreateConnection(token);

    if (connection.state === signalR.HubConnectionState.Disconnected) {
      connection.start().catch(err => console.warn('[ChatHub] connection error:', err));
    }

    return () => {
      // Не зупиняємо при розмонтуванні — з'єднання глобальне
    };
  }, [token]);
};

// ── Хук для сторінки чату — підписується на події і відправляє typing ────────
interface UseChatHubOptions {
  chatId: number | null;
  onTyping: (chatId: number, userId: number, isTyping: boolean) => void;
  onUserOnlineStatus: (userId: number, isOnline: boolean) => void;
}

export const useChatHub = ({
  chatId,
  onTyping,
  onUserOnlineStatus,
}: UseChatHubOptions) => {
  useEffect(() => {
    typingListeners.add(onTyping);
    onlineStatusListeners.add(onUserOnlineStatus);
    return () => {
      typingListeners.delete(onTyping);
      onlineStatusListeners.delete(onUserOnlineStatus);
    };
  }, [onTyping, onUserOnlineStatus]);

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const conn = globalConnection;
      if (!conn || conn.state !== signalR.HubConnectionState.Connected || !chatId) return;
      conn.invoke('SendTyping', chatId, isTyping).catch(() => {});
    },
    [chatId]
  );

  return { sendTyping };
};