import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { fetchNotifications } from '../store/notificationsSlice';
import type { Notification } from '../store/notificationsSlice';

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
  const dispatch        = useAppDispatch();
  const token           = useAppSelector(s => s.auth.token);
  const prevUnreadRef   = useRef<number | null>(null);

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

      const notifications = result.payload as Notification[];
      const unread = notifications.filter(n => !n.isRead).length;

      if (prevUnreadRef.current === null) {
        prevUnreadRef.current = unread;
        return;
      }

      if (unread > prevUnreadRef.current) {
        playSound();
        const newest = notifications.find(n => !n.isRead);
        if (newest) showPush(newest.message);
      }

      prevUnreadRef.current = unread;
    };

    poll();
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [token, dispatch]);
};