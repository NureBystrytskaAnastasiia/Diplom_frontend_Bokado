// src/features/admin/components/SupportPanel/SupportPanel.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiMessageCircle, FiSearch, FiStar, FiUsers,
  FiAlertCircle, FiInbox, FiUser,
} from 'react-icons/fi';
import axiosInstance, { BASE_URL } from '../../../../shared/api/axiosInstance';
import type { UserDetailInfoDto } from '../../types/admin';
import './SupportPanel.css';

interface SupportChat {
  chatId:       number;
  createdAt:    string;
  isGroup:      boolean;
  secondMember: {
    userId:    number;
    username:  string;
    email:     string;
    avatarUrl: string | null;
    isAdmin:   boolean;
  } | null;
  lastMessage?: {
    text:     string;
    sentAt:   string;
    senderId: number;
    isRead:   boolean;
  };
  unreadCount: number;
}

interface Props {
  users: UserDetailInfoDto[];
}

const resolveUrl = (url?: string | null) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now  = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60)     return 'щойно';
  if (diff < 3600)   return `${Math.floor(diff / 60)} хв тому`;
  if (diff < 86400)  return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  if (diff < 172800) return 'вчора';
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
};

const SupportPanel: React.FC<Props> = ({ users }) => {
  const navigate = useNavigate();

  const [chats,     setChats]     = useState<SupportChat[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [search,    setSearch]    = useState('');
  const [writeSearch, setWriteSearch] = useState('');
  const [openingId, setOpeningId] = useState<number | null>(null);
  const [openErr,   setOpenErr]   = useState<string | null>(null);
  const [tab,       setTab]       = useState<'inbox' | 'write'>('inbox');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get<SupportChat[]>('/api/Chat/chats');
        const supportChats = data
          .filter(c => !c.isGroup && c.secondMember && !c.secondMember.isAdmin)
          .sort((a, b) => {
            if ((b.unreadCount ?? 0) !== (a.unreadCount ?? 0))
              return (b.unreadCount ?? 0) - (a.unreadCount ?? 0);
            const aT = new Date(a.lastMessage?.sentAt ?? a.createdAt).getTime();
            const bT = new Date(b.lastMessage?.sentAt ?? b.createdAt).getTime();
            return bT - aT;
          });
        setChats(supportChats);
      } catch {
        setError('Не вдалось завантажити заявки');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredChats = chats.filter(c => {
    const name  = c.secondMember?.username ?? '';
    const email = c.secondMember?.email    ?? '';
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
  });

  const filteredUsers = users
    .filter(u => !u.isAdmin)
    .filter(u =>
      u.username.toLowerCase().includes(writeSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(writeSearch.toLowerCase())
    );

  const handleOpenChat = async (userId: number, existingChatId?: number) => {
    if (existingChatId) { navigate(`/chat/${existingChatId}`); return; }
    setOpeningId(userId);
    setOpenErr(null);
    try {
      const { data } = await axiosInstance.post(`/api/Admin/support-chat/${userId}`);
      navigate(`/chat/${data.chatId}`);
    } catch (e: any) {
      setOpenErr(e?.response?.data?.message || 'Не вдалось відкрити чат');
    } finally {
      setOpeningId(null);
    }
  };

  const hasUnreadTotal = chats.some(c => (c.unreadCount ?? 0) > 0);

  return (
    <div className="sp-wrap">

      <div className="sp-tabs">
        <button className={`sp-tab${tab === 'inbox' ? ' sp-tab--active' : ''}`} onClick={() => setTab('inbox')}>
          <FiInbox size={14} />
          Вхідні заявки
          {hasUnreadTotal && <span className="sp-tab__dot" />}
        </button>
        <button className={`sp-tab${tab === 'write' ? ' sp-tab--active' : ''}`} onClick={() => setTab('write')}>
          <FiUser size={14} />
          Написати юзеру
        </button>
      </div>

      {/* ── INBOX ── */}
      {tab === 'inbox' && (
        <>
          <div className="sp-toolbar">
            <div className="sp-search">
              <FiSearch size={14} className="sp-search__icon" />
              <input className="sp-search__input" placeholder="Пошук..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <span className="sp-count">{filteredChats.length} заявок</span>
          </div>

          {loading ? (
            <div className="sp-loading"><span className="sp-spinner" /> Завантаження...</div>
          ) : error ? (
            <div className="sp-error"><FiAlertCircle size={15} /> {error}</div>
          ) : filteredChats.length === 0 ? (
            <div className="sp-empty">
              <FiInbox size={36} />
              <p>Заявок поки немає</p>
              <span>Коли юзери напишуть вам — вони з'являться тут</span>
            </div>
          ) : (
            <div className="sp-list">
              {filteredChats.map(chat => {
                const user      = chat.secondMember!;
                const avatar    = resolveUrl(user.avatarUrl);
                const info      = users.find(u => u.userId === user.userId);
                const hasUnread = (chat.unreadCount ?? 0) > 0;

                return (
                  <div
                    key={chat.chatId}
                    className={`sp-card sp-card--clickable${hasUnread ? ' sp-card--unread' : ''}`}
                    onClick={() => handleOpenChat(user.userId, chat.chatId)}
                  >
                    <div className="sp-card__avatar">
                      {avatar
                        ? <img src={avatar} alt={user.username} className="sp-card__avatar-img" />
                        : <div className="sp-card__avatar-fallback">{user.username.charAt(0).toUpperCase()}</div>
                      }
                      {hasUnread && <span className="sp-card__avatar-dot" />}
                    </div>

                    <div className="sp-card__info">
                      <div className="sp-card__name-row">
                        <span className="sp-card__name">{user.username}</span>
                        {info?.isPremium && <span className="adm-badge adm-badge--gold"><FiStar size={10} /> Premium</span>}
                        {info?.isBanned  && <span className="adm-badge adm-badge--red">Banned</span>}
                      </div>
                      <span className="sp-card__email">{user.email}</span>
                      {chat.lastMessage && (
                        <p className={`sp-card__preview${hasUnread ? ' sp-card__preview--bold' : ''}`}>
                          {chat.lastMessage.text || '📎 Вкладення'}
                        </p>
                      )}
                    </div>

                    <div className="sp-card__right">
                      {chat.lastMessage && <span className="sp-card__time">{formatTime(chat.lastMessage.sentAt)}</span>}
                      {hasUnread && <span className="sp-card__badge">{chat.unreadCount}</span>}
                      <FiMessageCircle size={15} className="sp-card__chat-icon" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── WRITE ── */}
      {tab === 'write' && (
        <>
          <div className="sp-toolbar">
            <div className="sp-search">
              <FiSearch size={14} className="sp-search__icon" />
              <input className="sp-search__input" placeholder="Пошук користувача..." value={writeSearch} onChange={e => setWriteSearch(e.target.value)} />
            </div>
            <span className="sp-count">{filteredUsers.length} юзерів</span>
          </div>

          {openErr && <div className="sp-error"><FiAlertCircle size={15} /> {openErr}</div>}

          <div className="sp-list">
            {filteredUsers.length === 0 ? (
              <div className="sp-empty"><FiUsers size={32} /><p>Нікого не знайдено</p></div>
            ) : filteredUsers.map(user => {
              const avatar    = resolveUrl(user.avatarUrl);
              const isOpening = openingId === user.userId;
              const existChat = chats.find(c => c.secondMember?.userId === user.userId);

              return (
                <div key={user.userId} className="sp-card">
                  <div className="sp-card__avatar">
                    {avatar
                      ? <img src={avatar} alt={user.username} className="sp-card__avatar-img" />
                      : <div className="sp-card__avatar-fallback">{user.username.charAt(0).toUpperCase()}</div>
                    }
                  </div>

                  <div className="sp-card__info">
                    <div className="sp-card__name-row">
                      <span className="sp-card__name">{user.username}</span>
                      {user.isPremium && <span className="adm-badge adm-badge--gold"><FiStar size={10} /> Premium</span>}
                      {user.isBanned  && <span className="adm-badge adm-badge--red">Banned</span>}
                    </div>
                    <span className="sp-card__email">{user.email}</span>
                    {existChat && <span className="sp-card__exists"><FiMessageCircle size={11} /> Чат вже існує</span>}
                  </div>

                  <button
                    className="sp-card__btn"
                    onClick={() => handleOpenChat(user.userId, existChat?.chatId)}
                    disabled={isOpening}
                  >
                    {isOpening ? <span className="sp-spinner sp-spinner--sm" /> : <FiMessageCircle size={14} />}
                    {existChat ? 'Відкрити' : 'Написати'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SupportPanel;