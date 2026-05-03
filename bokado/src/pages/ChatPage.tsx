  import React, { useEffect, useState } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { useNavigate } from 'react-router-dom';
  import type { RootState, AppDispatch } from '../store';
  import { fetchChats, createNewChat, markChatAsRead,deleteChatThunk } from '../store/slices/chatSlice';
  import { loadMyFriends } from '../store/slices/friendsSlice';
  import '../styles/Chat.css';
  import DashboardNav from '../components/Dashbord/DashboardNav';

  const ChatsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { chats, loading: chatsLoading, error: chatsError } = useSelector((state: RootState) => state.chat);
    const { myFriends, loading: friendsLoading, error: friendsError } = useSelector((state: RootState) => state.friends);
    const { user } = useSelector((state: RootState) => state.auth);

    const [selectedFriendId, setSelectedFriendId] = useState<number | ''>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateChatModal, setShowCreateChatModal] = useState(false);

    useEffect(() => {
      dispatch(fetchChats());
      dispatch(loadMyFriends());
    }, [dispatch]);

    const handleCreateChat = () => {
      if (selectedFriendId && typeof selectedFriendId === 'number') {
        dispatch(createNewChat(selectedFriendId));
        setSelectedFriendId('');
        setShowCreateChatModal(false);
      }
    };

    const handleOpenChat = (chatId: number) => {
      dispatch(markChatAsRead(chatId));
      navigate(`/chat/${chatId}`);
    };

    const filteredChats = chats
      .filter(chat =>
        chat.secondMember?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const aTime = new Date(a.lastMessage?.sentAt || a.createdAt).getTime();
        const bTime = new Date(b.lastMessage?.sentAt || b.createdAt).getTime();
        return bTime - aTime;
      });

    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      if (hours < 1) return 'Зараз';
      if (hours < 24) return `${hours}г тому`;
      return date.toLocaleDateString('uk-UA');
    };

    const getOnlineStatus = (lastActive: string) => {
      const lastActiveDate = new Date(lastActive);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
      return diffMinutes < 5 ? 'online' : 'offline';
    };
    const handleDeleteChat = async (chatId: number) => {
  if (window.confirm('Ви справді хочете видалити цей чат?')) {
    try {
      await dispatch(deleteChatThunk(chatId)).unwrap();
      alert('Чат успішно видалено');
    } catch (error) {
      alert('Не вдалося видалити чат: ' + (error as string));
    }
  }
};

    return (
      <div className="chats-container">
        
        <div className="chats-header">
          <div className="header-top">
            <h1 className="chats-title">Чати</h1>
            
            <button 
              className="new-chat-button"
              onClick={() => setShowCreateChatModal(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Пошук чатів..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {(chatsLoading || friendsLoading) && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span>Завантажуємо чати...</span>
          </div>
        )}

        {(chatsError || friendsError) && (
          <div className="error-container">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{chatsError || friendsError}</span>
          </div>
        )}

        <div className="chats-list">
          {filteredChats.length === 0 && !chatsLoading ? (
            <div className="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <h3>Немає чатів</h3>
              <p>Створіть свій перший чат з друзями!</p>
              <button 
                className="create-first-chat-btn"
                onClick={() => setShowCreateChatModal(true)}
              >
                Створити чат
              </button>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div 
                key={chat.chatId} 
                className="chat-item"
                onClick={() => handleOpenChat(chat.chatId)}
              >
                <div className="chat-avatar-container">
                  {chat.secondMember?.avatarUrl ? (
                    <img 
                      src={chat.secondMember.avatarUrl} 
                      alt={chat.secondMember.username}
                      className="chat-avatar"
                    />
                  ) : (
                    <div className="chat-avatar chat-avatar-placeholder">
                      {chat.secondMember?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div className={`online-indicator ${getOnlineStatus(chat.secondMember?.lastActive || '')}`}></div>
                </div>
                
                <div className="chat-content">
                  <div className="chat-header-info">
                    <h3 className="chat-username">{chat.secondMember?.username ?? 'Невідомий'}</h3>
                    <span className="chat-time">{formatTime(chat.lastMessage?.sentAt || chat.createdAt)}</span>
                  </div>
                  <p className="chat-preview">
                    {chat.lastMessage?.text || 'Натисніть щоб відкрити чат...'}
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <span className="new-message-indicator"> ●</span>
                    )}
                  </p>
                </div>
                
                <div className="chat-actions">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.chatId);
                }}
                className="delete-chat-button"
                title="Видалити чат"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'red',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  lineHeight: '1',
                  userSelect: 'none',
                }}
              >
                ×
              </button>
              </div>
            ))
          )}
        </div>

        {showCreateChatModal && (
          <div className="modal-overlay" onClick={() => setShowCreateChatModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Новий чат</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowCreateChatModal(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              
              <div className="modal-body">
                <label htmlFor="friend-select">Оберіть друга:</label>
                <select
                  id="friend-select"
                  className="friend-select-modal"
                  value={selectedFriendId}
                  onChange={(e) => setSelectedFriendId(e.target.value === '' ? '' : Number(e.target.value))}
                >
                  <option value="">Оберіть друга</option>
                  {myFriends.map((friend) => (
                    <option key={friend.userId} value={friend.userId}>
                      {friend.username}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="modal-footer">
                <button
                  className="modal-btn modal-btn-secondary"
                  onClick={() => setShowCreateChatModal(false)}
                >
                  Скасувати
                </button>
                <button
                  className="modal-btn modal-btn-primary"
                  onClick={handleCreateChat}
                  disabled={!user?.userId || selectedFriendId === ''}
                >
                  Створити чат
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default ChatsPage;
