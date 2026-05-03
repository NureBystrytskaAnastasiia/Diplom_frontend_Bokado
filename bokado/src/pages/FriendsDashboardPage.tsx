    import React, { useEffect, useState } from 'react';
    import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
    import { useNavigate } from 'react-router-dom';
    import {
      loadSwipeUsers,
      likeOrPassUser,
      loadMyFriends,
      removeFriendById,
      loadTopUsers,
      loadWhoLikedMe,
      acceptFriendRequest,
      loadILikedUsers,
      removeLikeById,
      clearError
    } from '../store/slices/friendsSlice';
    import { useSwipeable } from 'react-swipeable';
    import { motion, AnimatePresence } from 'framer-motion';
    import { FiHeart, FiX, FiUser, FiUsers, FiStar, FiRefreshCw, FiCheck, FiTrash2, FiArrowRight } from 'react-icons/fi';
    import '../styles/FriendsDashboard.css';

    const FriendsDashboardPage: React.FC = () => {
      const dispatch = useAppDispatch();
      const { swipeUsers, myFriends, topUsers, whoLikedMe, iLikedUsers, loading, error } = useAppSelector(state => state.friends);
      const [currentIndex, setCurrentIndex] = useState(0);
      const [direction, setDirection] = useState<'left' | 'right' | null>(null);
      const [activeTab, setActiveTab] = useState<'discover' | 'friends' | 'likes'>('discover');
      const navigate = useNavigate();

      useEffect(() => {
        dispatch(loadSwipeUsers());
        dispatch(loadMyFriends());
        dispatch(loadTopUsers());
        dispatch(loadWhoLikedMe());
        dispatch(loadILikedUsers());
      }, [dispatch]);

      useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            dispatch(clearError());
          }, 5000);
          return () => clearTimeout(timer);
        }
      }, [error, dispatch]);

      const handleSwipe = async (direction: 'left' | 'right') => {
        if (swipeUsers[currentIndex]) {
          setDirection(direction);
          const action = direction === 'right' ? 'like' : 'pass';
          
          try {
            await dispatch(likeOrPassUser({ 
              targetUserId: swipeUsers[currentIndex].userId, 
              action 
            })).unwrap();
            
            setCurrentIndex(prev => {
              const nextIndex = prev + 1;
              return nextIndex >= swipeUsers.length - 1 ? 0 : nextIndex;
            });
          } catch (error) {
            console.error('Swipe error:', error);
          }
        }
      };

      const handleAcceptFriend = async (swipeId: number) => {
        try {
          await dispatch(acceptFriendRequest(swipeId)).unwrap();
          dispatch(loadMyFriends());
          dispatch(loadWhoLikedMe());
        } catch (error) {
          console.error('Accept friend error:', error);
        }
      };

      const handleRemoveLike = async (swipeId: number) => {
        try {
          await dispatch(removeLikeById(swipeId)).unwrap();
          dispatch(loadILikedUsers());
        } catch (error) {
          console.error('Remove like error:', error);
        }
      };

      const handleRemoveFriend = async (friendId: number) => {
        try {
          await dispatch(removeFriendById(friendId)).unwrap();
          dispatch(loadMyFriends());
        } catch (error) {
          console.error('Remove friend error:', error);
        }
      };

      const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe('left'),
        onSwipedRight: () => handleSwipe('right'),
        trackMouse: true
      });

      const currentUser = swipeUsers[currentIndex];

      return (
        <div className="friends-dashboard">
          <header className="dashboard-header">
            <h1 className="dashboard-title">
              <FiUsers className="header-icon" />
              <span>Пошук друзів</span>
            </h1>
            
            <div className="dashboard-tabs">
              <button 
                className={`tab-button ${activeTab === 'discover' ? 'active' : ''}`}
                onClick={() => setActiveTab('discover')}
              >
                <FiUser className="tab-icon" />
                <span>Відкрийте для себе</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                <FiUsers className="tab-icon" />
                <span>Мої друзі{myFriends.length > 0 && <span className="badge">{myFriends.length}</span>}</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'likes' ? 'active' : ''}`}
                onClick={() => setActiveTab('likes')}
              >
                <FiHeart className="tab-icon" />
                <span>Лайки {whoLikedMe.length > 0 && <span className="badge">{whoLikedMe.length}</span>}</span>
              </button>
            </div>
          </header>

          {error && (
            <motion.div 
              className="error-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="error-text">{error}</p>
              <button 
                onClick={() => dispatch(clearError())} 
                className="close-error"
              >
                <FiX />
              </button>
            </motion.div>
          )}

          <div className="dashboard-content">
            {activeTab === 'discover' && (
              <div className="tab-content">
                <section className="swipe-section">
                  <h2 className="section-title">
                    <FiUser className="section-icon" />
                    <span>Відкрийте для себе людей</span>
                  </h2>
                  
                  {loading ? (
                    <div className="loading-spinner">
                      <FiRefreshCw className="spinner-icon" />
                    </div>
                  ) : (
                    <div className="swipe-container">
                      <AnimatePresence custom={direction}>
                        {currentUser && (
                          <motion.div
                            key={currentUser.userId}
                            custom={direction}
                            initial={{ x: direction === 'right' ? 500 : -500, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction === 'right' ? 500 : -500, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="swipe-card"
                            {...swipeHandlers}
                          >
                            <div className="card-image-container">
                              <div className="avatar-container">
                                <img 
                                  src={currentUser.avatarUrl ? `https://localhost:7192${currentUser.avatarUrl}` : '/default-avatar.png'} 
                                  alt={currentUser.username} 
                                  className="user-avatar"
                                  onClick={() => navigate(`/profile/${currentUser.userId}`)}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                                  }}
                                />
                              </div>
                            </div>
                            <div className="card-content">
                              <h3 className="user-name">{currentUser.username}</h3>
                              <p className="user-bio">{currentUser.bio || 'No bio available'}</p>
                              
                              <div className="actions-container">
                                <button 
                                  onClick={() => handleSwipe('left')}
                                  className="action-button pass-button"
                                  disabled={loading}
                                >
                                  <FiX className="button-icon" />
                                  <span>Пропустити</span>
                                </button>
                                <button 
                                  onClick={() => handleSwipe('right')}
                                  className="action-button like-button"
                                  disabled={loading}
                                >
                                  <FiHeart className="button-icon" />
                                  <span>Лайк</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {swipeUsers.length === 0 && !loading && (
                        <div className="empty-state">
                          <FiUser className="empty-icon" />
                          <p>Немає користувачів для гортання</p>
                          <button 
                            onClick={() => dispatch(loadSwipeUsers())}
                            className="refresh-button"
                          >
                            <FiRefreshCw className="refresh-icon" />
                            <span>Перезавантажити</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                <section className="top-section">
                  <h2 className="section-title">
                    <FiStar className="section-icon" />
                    <span>Популярні користувачі</span>
                  </h2>
                  <div className="users-grid">
                    {topUsers.slice(0, 4).map((user, index) => (
                      <motion.div 
                        key={user.userId} 
                        className="user-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="card-rank">
                          <FiStar className="rank-icon" />
                          <span>{index + 1}</span>
                        </div>
                        <div className="avatar-container">
                          <img 
                            src={user.avatarUrl ? `https://localhost:7192${user.avatarUrl}` : '/default-avatar.png'} 
                            alt={user.username} 
                            className="user-card-avatar"
                            onClick={() => navigate(`/profile/${user.userId}`)}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-avatar.png';
                            }}
                          />
                        </div>
                        <div className="card-content">
                          <h3 className="user-card-name">{user.username}</h3>
                          <p className="user-card-bio">{user.bio || 'No bio available'}</p>
                          <button 
                            className="view-profile-button"
                            onClick={() => navigate(`/profile/${user.userId}`)}
                          >
                            <span>Подитивитися профіль</span>
                            <FiArrowRight className="arrow-icon" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="tab-content">
                <section className="friends-section">
                  <div className="section-header">
                    <h2 className="section-title">
                      <FiUsers className="section-icon" />
                      <span>Мої друзі({myFriends.length})</span>
                    </h2>
                    <div className="search-box">
                      <input type="text" placeholder="Search friends..." />
                    </div>
                  </div>
                  
                  <div className="users-grid">
                    {myFriends.map((friend, index) => (
                      <motion.div 
                        key={friend.userId} 
                        className="user-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="avatar-container">
                          <img 
                            src={friend.avatarUrl ? `https://localhost:7192${friend.avatarUrl}` : '/default-avatar.png'} 
                            alt={friend.username} 
                            className="user-card-avatar"
                            onClick={() => navigate(`/profile/${friend.userId}`)}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-avatar.png';
                            }}
                          />
                        </div>
                        <div className="card-content">
                          <h3 className="user-card-name">{friend.username}</h3>
                          <p className="user-card-bio">{friend.bio || 'No bio available'}</p>
                          <button 
                            onClick={() => handleRemoveFriend(friend.userId)} 
                            className="action-button remove-button"
                            disabled={loading}
                          >
                            <FiTrash2 className="button-icon" />
                            <span>Видалити</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {myFriends.length === 0 && (
                    <div className="empty-state">
                      <FiUsers className="empty-icon" />
                      <p>У вас ще немає друзів</p>
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="tab-content">
                <div className="likes-grid">
                  <section className="liked-section">
                    <h2 className="section-title">
                      <FiHeart className="section-icon" />
                      <span> Кому ти сподобався ({whoLikedMe.length})</span>
                    </h2>
                    <div className="users-grid">
                      {whoLikedMe.map((user, index) => (
                        <motion.div 
                          key={user.userId} 
                          className="user-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="avatar-container">
                            <img 
                              src={user.avatarUrl ? `https://localhost:7192${user.avatarUrl}` : '/default-avatar.png'} 
                              alt={user.username} 
                              className="user-card-avatar"
                              onClick={() => navigate(`/profile/${user.userId}`)}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                              }}
                            />
                          </div>
                          <div className="card-content">
                            <h3 className="user-card-name">{user.username}</h3>
                            <p className="user-card-bio">{user.bio || 'No bio available'}</p>
                            <small className="swipe-date">
                              Хто тобі сподобався: {new Date(user.swipedAt).toLocaleDateString()}
                            </small>
                            <button 
                              onClick={() => handleAcceptFriend(user.swipeId)} 
                              className="action-button accept-button"
                              disabled={loading}
                            >
                              <FiCheck className="button-icon" />
                              <span>Прийняти до друзів</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {whoLikedMe.length === 0 && (
                      <div className="empty-state">
                        <FiHeart className="empty-icon" />
                        <p>Ти ще нікому не сподобався</p>
                      </div>
                    )}
                  </section>

                  <section className="liked-section">
                    <h2 className="section-title">
                      <FiHeart className="section-icon" />
                      <span>Твої лайки ({iLikedUsers.length})</span>
                    </h2>
                    <div className="users-grid">
                      {iLikedUsers.map((user, index) => (
                        <motion.div 
                          key={user.userId} 
                          className="user-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="avatar-container">
                            <img 
                              src={user.avatarUrl ? `https://localhost:7192${user.avatarUrl}` : '/default-avatar.png'} 
                              alt={user.username} 
                              className="user-card-avatar"
                              onClick={() => navigate(`/profile/${user.userId}`)}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                              }}
                            />
                          </div>
                          <div className="card-content">
                            <h3 className="user-card-name">{user.username}</h3>
                            <p className="user-card-bio">{user.bio || 'No bio available'}</p>
                            {user.swipedAt && (
                              <small className="swipe-date">
                                Liked on: {new Date(user.swipedAt).toLocaleDateString()}
                              </small>
                            )}
                            <button 
                              onClick={() => handleRemoveLike(user.swipeId)} 
                              className="action-button remove-button"
                              disabled={loading}
                            >
                              <FiTrash2 className="button-icon" />
                              <span> Видалити лайки</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {iLikedUsers.length === 0 && (
                      <div className="empty-state">
                        <FiHeart className="empty-icon" />
                        <p>Ти ще нікому не сподобався</p>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    export default FriendsDashboardPage;