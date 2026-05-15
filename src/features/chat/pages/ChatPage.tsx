import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiMessageSquare } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { fetchChats, createNewChat, deleteChatThunk, markChatAsRead } from '../store/chatSlice';
import { loadMyFriends } from '../../friends/store/friendsSlice';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import ChatItem from '../components/ChatItem/ChatItem';
import CreateChatModal from '../components/CreateChatModa/CreateChatModal';
import './ChatPage.css';

const ChatPage: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { chats, loading } = useAppSelector((s) => s.chat);
  const { myFriends }      = useAppSelector((s) => s.friends);

  const [search, setSearch]           = useState('');
  const [showModal, setShowModal]     = useState(false);

  useEffect(() => {
    dispatch(fetchChats());
    dispatch(loadMyFriends());
  }, [dispatch]);

  const filtered = chats
    .filter(chat => {
      const name = chat.isGroup ? chat.groupName : chat.secondMember?.username;
      return name?.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const aTime = new Date(a.lastMessage?.sentAt || a.createdAt).getTime();
      const bTime = new Date(b.lastMessage?.sentAt || b.createdAt).getTime();
      return bTime - aTime;
    });

  const handleOpen = (chatId: number) => {
    dispatch(markChatAsRead(chatId));
    navigate(`/chat/${chatId}`);
  };

  const handleDelete = async (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    if (window.confirm('Видалити цей чат?')) {
      dispatch(deleteChatThunk(chatId));
    }
  };

  const handleCreate = (userId: number) => {
    dispatch(createNewChat(userId)).then((result) => {
      if (createNewChat.fulfilled.match(result)) {
        navigate(`/chat/${result.payload.chatId}`);
      }
    });
  };

  return (
    <AppLayout>
      <div className="chat-page">
        {/* Header */}
        <div className="chat-page__header">
          <h1 className="chat-page__title">Чати</h1>
          <button
            className="chat-page__new-btn"
            onClick={() => setShowModal(true)}
            title="Новий чат"
          >
            <FiPlus size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="chat-page__search-wrap">
          <FiSearch className="chat-page__search-icon" size={16} />
          <input
            className="chat-page__search"
            placeholder="Пошук чатів..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="chat-page__list">
          {loading && (
            <div className="chat-page__loading">Завантаження...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="chat-page__empty">
              <FiMessageSquare size={40} className="chat-page__empty-icon" />
              <p>Немає чатів</p>
              <span>Створіть свій перший чат з друзями!</span>
              <button
                className="chat-page__empty-btn"
                onClick={() => setShowModal(true)}
              >
                Створити чат
              </button>
            </div>
          )}

          {filtered.map((chat) => (
            <ChatItem
              key={chat.chatId}
              chat={chat}
              onClick={() => handleOpen(chat.chatId)}
              onDelete={(e) => handleDelete(e, chat.chatId)}
            />
          ))}
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