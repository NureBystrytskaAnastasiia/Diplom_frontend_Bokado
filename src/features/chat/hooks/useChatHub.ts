import { useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

const BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://bokadoserver-production.up.railway.app';

interface UseChatHubOptions {
  token: string | null;
  chatId: number | null;
  onTyping: (chatId: number, userId: number, isTyping: boolean) => void;
  onUserOnlineStatus: (userId: number, isOnline: boolean) => void;
}

export const useChatHub = ({
  token,
  chatId,
  onTyping,
  onUserOnlineStatus,
}: UseChatHubOptions) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/chat?access_token=${token}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('ReceiveTyping', (incomingChatId: number, userId: number, isTyping: boolean) => {
      onTyping(incomingChatId, userId, isTyping);
    });

    connection.on('UserOnlineStatus', (userId: number, isOnline: boolean) => {
      onUserOnlineStatus(userId, isOnline);
    });

    connection.start().catch((err) => console.warn('[ChatHub] connection error:', err));
    connectionRef.current = connection;

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
  }, [token]);

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const conn = connectionRef.current;
      if (!conn || conn.state !== signalR.HubConnectionState.Connected || !chatId) return;
      conn.invoke('SendTyping', chatId, isTyping).catch(() => {});
    },
    [chatId]
  );

  return { sendTyping };
};