import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import {
  getAllUsers,
  getUserStats,
  getChallengeStats,
  banUserById,
  unbanUserById,
  subscribeUser,
  unsubscribeUser,
} from '../store/slices/adminSlice';
import UsersCalendar from '../components/Admin/UsersCalendar';
import AdminChallengesPage from '../components/Admin/AdminChallengesPage';
import '../styles/Admin.css';

const AdminPage = () => {
  const dispatch: AppDispatch = useDispatch();
const {
  users,
  challengeStats,
  loading,
  error,
} = useSelector((state: RootState) => state.admin);


  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getUserStats());
    dispatch(getChallengeStats());
  }, [dispatch]);

  const handleBan = (userId: number) => {
    dispatch(banUserById(userId));
  };

  const handleUnban = (userId: number) => {
    dispatch(unbanUserById(userId));
  };

  const handleSubscribe = (userId: number) => {
    dispatch(subscribeUser(userId));
  };

  const handleUnsubscribe = (userId: number) => {
    dispatch(unsubscribeUser(userId));
  };

  if (loading) return (
    <div className="admin-loading">
      <div className="loading-spinner"></div>
      <p>Завантажуємо панель...</p>
    </div>
  );

  if (error) return (
    <div className="admin-error">
      <div className="error-icon">⚠️</div>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Повторіть спробу</button>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Панель адміністратора</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <span>Всі користувачі</span>
            <strong>{users.length}</strong>
          </div>
          <div className="stat-card">
            <span>Активні челенджі</span>
            <strong>{challengeStats ? Object.keys(challengeStats).length : 0}</strong>
          </div>
        </div>
      </header>

      <div className="admin-grid">
        <section className="admin-section users-section">
          <div className="section-header">
            <h2>Управління користувачами</h2>
            <div className="search-box">
              <input type="text" placeholder="Пошук користувачів..." />
            </div>
          </div>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Користувач</th>
                  <th>Статус</th>
                  <th>Дія</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.userId}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="user-name">{user.username}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="status-badges">
                        <span className={`badge ${user.isBanned ? 'badge-danger' : 'badge-success'}`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                        <span className={`badge ${user.isPremium ? 'badge-premium' : 'badge-basic'}`}>
                          {user.isPremium ? 'Premium' : 'Basic'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {user.isBanned ? (
                          <button className="btn-success" onClick={() => handleUnban(user.userId)}>Розблокувати</button>
                        ) : (
                          <button className="btn-danger" onClick={() => handleBan(user.userId)}>Заблокувати</button>
                        )}
                        {user.isPremium ? (
                          <button className="btn-warning" onClick={() => handleUnsubscribe(user.userId)}>Видалити Premium</button>
                        ) : (
                          <button className="btn-primary" onClick={() => handleSubscribe(user.userId)}>Зробити Premium</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="admin-section stats-section">
          <h2>Огляд статистики</h2>
          <div className="stats-grid">
            <div className="stats-card wide-card">
              <UsersCalendar />
            </div>
            <div className="stats-card">
              <h3>Топ челенджів</h3>
              <ul className="challenge-stats">
            {challengeStats
              ? Object.entries(challengeStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([challengeId, count]) => (
                    <li key={challengeId}>
                      <span className="challenge-id">#{challengeId}</span>
                      <span className="challenge-count">{count}Виконані</span>
                    </li>
                  ))
              : <li>Немає даних про челенджі</li>}

              </ul>
            </div>
          </div>
        </section>
        <section className="admin-section challenges-section">
          <AdminChallengesPage />
        </section>
      </div>
    </div>
  );
};

export default AdminPage;