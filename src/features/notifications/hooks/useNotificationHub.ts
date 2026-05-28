import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { addNotification, fetchNotifications } from '../store/notificationsSlice';
import type { Notification } from '../store/notificationsSlice';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://bokadoserver-production.up.railway.app';

export const useNotificationHub = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.auth.token);

  // Запит дозволу на browser push
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    // Завантажуємо існуючі сповіщення
    dispatch(fetchNotifications());

    // Підключаємось до SignalR
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/notifications`, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets |
                   signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.on('ReceiveNotification', (notification: Notification) => {
      dispatch(addNotification(notification));

      // 🔊 Звук сповіщення
      try {
        const audio = new Audio('/universfield-new-notification-051-494246.mp3');
        audio.volume = 0.4;
        audio.play().catch(() => {});
      } catch {}

      // Browser push notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Bokado', {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    });

    connection.start().catch(err => console.warn('SignalR connection failed:', err));

    return () => {
      connection.stop();
    };
  }, [token, dispatch]);
};