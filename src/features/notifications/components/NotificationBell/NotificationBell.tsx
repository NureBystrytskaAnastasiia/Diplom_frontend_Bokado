// src/features/notifications/components/NotificationBell/NotificationBell.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCheck } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks/useAuth';
import { markRead, markAllRead } from '../../store/notificationsSlice';
import type { NotificationType } from '../../store/notificationsSlice';
import './NotificationBell.css';

const TYPE_ICON: Record<NotificationType, string> = {
  FriendRequest:      '🤝',
  NewMessage:         '💬',
  EventJoined:        '📅',
  GroupJoined:        '👥',
  ChallengeCompleted: '🏆',
};

const NotificationBell: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { items, unreadCount } = useAppSelector(s => s.notifications);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Закрити при кліку поза компонентом
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleItemClick = async (id: number, link: string | null, isRead: boolean) => {
    if (!isRead) await dispatch(markRead(id));
    if (link) navigate(link);
    setOpen(false);
  };

  const handleMarkAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(markAllRead());
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'щойно';
    if (m < 60) return `${m} хв тому`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} год тому`;
    return `${Math.floor(h / 24)} дн тому`;
  };

  return (
    <div className="nb" ref={ref}>
      <button
        className="nb__btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Сповіщення"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="nb__badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="nb__dropdown">
          <div className="nb__header">
            <span className="nb__title">Сповіщення</span>
            {unreadCount > 0 && (
              <button className="nb__mark-all" onClick={handleMarkAll}>
                <FiCheck size={12} /> Всі прочитані
              </button>
            )}
          </div>

          <div className="nb__list">
            {items.length === 0 ? (
              <div className="nb__empty">
                <FiBell size={28} />
                <p>Поки що немає сповіщень</p>
              </div>
            ) : (
              items.map(n => (
                <button
                  key={n.notificationId}
                  className={`nb__item ${!n.isRead ? 'nb__item--unread' : ''}`}
                  onClick={() => handleItemClick(n.notificationId, n.link, n.isRead)}
                >
                  <span className="nb__item-icon">
                    {TYPE_ICON[n.type] ?? '🔔'}
                  </span>
                  <div className="nb__item-body">
                    <p className="nb__item-msg">{n.message}</p>
                    <span className="nb__item-time">{formatTime(n.createdAt)}</span>
                  </div>
                  {!n.isRead && <span className="nb__item-dot" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;