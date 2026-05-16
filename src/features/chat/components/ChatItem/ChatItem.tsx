// src/features/chat/components/ChatItem/ChatItem.tsx
import React from 'react';
import { FiUsers, FiTrash2, FiCheck } from 'react-icons/fi';
import type { Chat } from '../../types/chat';
import './ChatItem.css';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7192';

interface ChatItemProps {
  chat:      Chat;
  isActive?: boolean;
  onClick:   () => void;
  onDelete:  (e: React.MouseEvent) => void;
  currentUserId?: number;
}

const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now  = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60)      return 'Зараз';
  if (diff < 3600)    return `${Math.floor(diff / 60)} хв`;
  if (diff < 86400)   return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  if (diff < 172800)  return 'Вчора';
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
};

const ChatItem: React.FC<ChatItemProps> = ({ chat, isActive, onClick, onDelete, currentUserId }) => {
  const isGroup   = !!chat.isGroup;
  const name      = isGroup
    ? (chat.groupName ?? 'Група')
    : (chat.secondMember?.username ?? 'Невідомий');

  const rawAvatar = !isGroup ? chat.secondMember?.avatarUrl : null;
  const avatarUrl = rawAvatar
    ? (rawAvatar.startsWith('http') ? rawAvatar : `${BASE_URL}${rawAvatar}`)
    : null;

  const lastMsg   = chat.lastMessage;
  const preview   = lastMsg?.attachment && !lastMsg.text
    ? '📎 Вкладення'
    : (lastMsg?.text || '');

  const time      = lastMsg ? formatTime(lastMsg.sentAt) : '';
  const unread    = chat.unreadCount ?? 0;

  // Чи це моє останнє повідомлення (показуємо галочки)
  const isMyLast  = lastMsg && currentUserId && lastMsg.senderId === currentUserId;

  return (
    <div
      className={`chat-item${isActive ? ' chat-item--active' : ''}`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="chat-item__avatar">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="chat-item__avatar-img"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className={`chat-item__avatar-fallback${isGroup ? ' chat-item__avatar-fallback--group' : ''}`}>
            {isGroup ? <FiUsers size={18} /> : name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="chat-item__content">
        <div className="chat-item__top">
          <span className="chat-item__name">{name}</span>
          <span className="chat-item__time">{time}</span>
        </div>

        <div className="chat-item__bottom">
          {/* Галочки прочитання для свого останнього повідомлення */}
          {isMyLast && (
            <span className={`chat-item__ticks${lastMsg!.isRead ? ' chat-item__ticks--read' : ''}`}>
              <FiCheck size={12} />
              {lastMsg!.isRead && <FiCheck size={12} className="chat-item__tick2" />}
            </span>
          )}

          <p className="chat-item__preview">{preview}</p>

          {/* Кружечок непрочитаних */}
          {unread > 0 && (
            <span className="chat-item__badge">{unread > 99 ? '99+' : unread}</span>
          )}
        </div>
      </div>

      {/* Видалити */}
      <button
        className="chat-item__delete"
        onClick={onDelete}
        title="Видалити чат"
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  );
};

export default ChatItem;