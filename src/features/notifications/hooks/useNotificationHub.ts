import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { fetchNotifications } from '../store/notificationsSlice';

const playSound = () => {
  try {
    const audio = new Audio('/universfield-new-notification-051-494246.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  } catch {}
};

const showPush = (message: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Bokado', { body: message, icon: '/favicon.ico' });
  }
};

export const useNotificationHub = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.auth.token);
  const prevUnreadRef = useRef<number | null>(null); // null = ще не ініціалізовано

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const poll = async () => {
      const result = await dispatch(fetchNotifications());
      if (!fetchNotifications.fulfilled.match(result)) return;

      const unread = result.payload.filter((n: any) => !n.isRead).length;

      if (prevUnreadRef.current === null) {
        // Перший запит — просто запам'ятовуємо, без звуку
        prevUnreadRef.current = unread;
        return;
      }

      if (unread > prevUnreadRef.current) {
        // З'явились нові — граємо звук і показуємо push
        playSound();
        const newest = result.payload.find((n: any) => !n.isRead);
        if (newest) showPush(newest.message);
      }

      prevUnreadRef.current = unread;
    };

    poll(); // одразу при вході
    const interval = setInterval(poll, 15000); // кожні 15 секунд
    return () => clearInterval(interval);
  }, [token, dispatch]);
};