// src/features/chat/pages/ChatPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiMessageSquare, FiUsers } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { fetchChats, createNewChat, deleteChatThunk, markChatAsRead } from '../store/chatSlice';
import { loadMyFriends } from '../../friends/store/friendsSlice';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import ChatItem from '../components/ChatItem/ChatItem';
import CreateChatModal from '../components/CreateChatModa/CreateChatModal';
import './ChatPage.css';

type Tab = 'personal' | 'groups';

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { chats, loading } = useAppSelector((s) => s.chat);
  const { myFriends }      = useAppSelector((s) => s.friends);
  const currentUserId      = useAppSelector((s) => Number(s.auth.user?.userId));

  const [tab, setTab]         = useState<Tab>('personal');
  const [search, setSearch]   = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchChats());
    dispatch(loadMyFriends());
  }, [dispatch]);

  // Розділяємо особисті та групові
  const personalChats = chats.filter(c => !c.isGroup);
  const groupChats    = chats.filter(c => c.isGroup);

  const activeList = (tab === 'personal' ? personalChats : groupChats)
    .filter(chat => {
      const name = chat.isGroup
        ? (chat.groupName ?? '')
        : (chat.secondMember?.username ?? '');
      return name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const aTime = new Date(a.lastMessage?.sentAt ?? a.createdAt).getTime();
      const bTime = new Date(b.lastMessage?.sentAt ?? b.createdAt).getTime();
      return bTime - aTime;
    });

  const handleOpen = (chatId: number) => {
    dispatch(markChatAsRead(chatId));
    navigate(`/chat/${chatId}`);
  };

  const handleDelete = (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    if (window.confirm('Видалити цей чат?')) {
      dispatch(deleteChatThunk(chatId));
    }
  };

  const handleCreate = (userId: number) => {
    dispatch(createNewChat(userId)).then((result) => {
      if (createNewChat.fulfilled.match(result)) {
        setShowModal(false);
        navigate(`/chat/${result.payload.chatId}`);
      }
    });
  };

  const emptyText = tab === 'personal'
    ? { title: 'Немає особистих чатів', sub: 'Почніть переписку з другом!' }
    : { title: 'Немає групових чатів', sub: 'Вступіть до групи, щоб бачити тут чати.' };

  return (
    <AppLayout>
      <div className="chat-page">

        {/* Top */}
        <div className="chat-page__top">
          <div className="chat-page__header">
            <h1 className="chat-page__title">Чати</h1>
            {tab === 'personal' && (
              <button
                className="chat-page__new-btn"
                onClick={() => setShowModal(true)}
                title="Новий чат"
              >
                <FiPlus size={18} />
              </button>
            )}
          </div>

          {/* Вкладки */}
          <div className="chat-page__tabs">
            <button
              className={`chat-page__tab${tab === 'personal' ? ' chat-page__tab--active' : ''}`}
              onClick={() => setTab('personal')}
            >
              <FiMessageSquare size={14} />
              Особисті
              {personalChats.some(c => (c.unreadCount ?? 0) > 0) && (
                <span className="chat-page__tab-dot" />
              )}
            </button>
            <button
              className={`chat-page__tab${tab === 'groups' ? ' chat-page__tab--active' : ''}`}
              onClick={() => setTab('groups')}
            >
              <FiUsers size={14} />
              Групи
              {groupChats.some(c => (c.unreadCount ?? 0) > 0) && (
                <span className="chat-page__tab-dot" />
              )}
            </button>
          </div>

          {/* Пошук */}
          <div className="chat-page__search-wrap">
            <FiSearch className="chat-page__search-icon" size={15} />
            <input
              className="chat-page__search"
              placeholder="Пошук..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Список */}
        <div className="chat-page__list">
          {loading ? (
            <div className="chat-page__loading">
              <div className="chat-page__loading-spinner" />
              Завантаження...
            </div>
          ) : activeList.length === 0 ? (
            <div className="chat-page__empty">
              {tab === 'personal'
                ? <FiMessageSquare size={36} className="chat-page__empty-icon" />
                : <FiUsers size={36} className="chat-page__empty-icon" />
              }
              <p>{emptyText.title}</p>
              <span>{emptyText.sub}</span>
              {tab === 'personal' && (
                <button
                  className="chat-page__empty-btn"
                  onClick={() => setShowModal(true)}
                >
                  Написати другу
                </button>
              )}
            </div>
          ) : (
            activeList.map((chat) => (
              <ChatItem
                key={chat.chatId}
                chat={chat}
                currentUserId={currentUserId}
                onClick={() => handleOpen(chat.chatId)}
                onDelete={(e) => handleDelete(e, chat.chatId)}
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <CreateChatModal
          friends={myFriends}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </AppLayout>
  );
};

export default ChatPage;