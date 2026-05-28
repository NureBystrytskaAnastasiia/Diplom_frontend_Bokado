import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { fetchNotifications } from '../store/notificationsSlice';

// Замість SignalR — простий polling кожні 30 секунд
// Railway не підтримує довгі з'єднання на безкоштовному плані

export const useNotificationHub = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.auth.token);
  const prevCountRef = useRef(0);

  // Запит дозволу на browser push
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const poll = async () => {
      const result = await dispatch(fetchNotifications());
      
      if (fetchNotifications.fulfilled.match(result)) {
        const notifications = result.payload;
        const unreadCount = notifications.filter((n: any) => !n.isRead).length;

        // Якщо з'явились нові непрочитані — звук і push
        if (unreadCount > prevCountRef.current) {
          // 🔊 Звук
          try {
            const audio = new Audio('/universfield-new-notification-051-494246.mp3');
            audio.volume = 0.4;
            audio.play().catch(() => {});
          } catch {}

          // Browser push
          if ('Notification' in window && Notification.permission === 'granted') {
            const newest = notifications.find((n: any) => !n.isRead);
            if (newest) {
              new Notification('Bokado', {
                body: newest.message,
                icon: '/favicon.ico',
              });
            }
          }
        }

        prevCountRef.current = unreadCount;
      }
    };

    // Одразу при вході
    poll();

    // Потім кожні 10 секунд
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, [token, dispatch]);
};