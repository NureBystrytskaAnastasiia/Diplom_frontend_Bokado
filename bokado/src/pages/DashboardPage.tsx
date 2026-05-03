import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/Dashbord/DashboardNav';
import EventsPage from './EventsPage';
import { FiHome, FiUsers, FiCalendar, FiUser, FiLogOut, FiMenu, FiChevronLeft, FiRefreshCw, FiMessageSquare, FiTarget } from 'react-icons/fi'; // 👈 Додали FiTarget для іконки
import { useCats } from '../hooks/useCat';
import CatCard from '../components/Dashbord/CatCard';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import '../styles/DashboardPages.css';
import ChallengesList from '../components/ChallengesList/ChallengesList';
import { FiDollarSign } from 'react-icons/fi';


const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { cats, loading: catsLoading, error: catsError, refetch } = useCats(3);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  useEffect(() => {
    console.log('user:', user);
  }, [user]);

  return (
    <div className={`dashboard-container dark-theme ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          {!isSidebarCollapsed && <h2>Меню</h2>}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarCollapsed ? <FiMenu size={24} /> : <FiChevronLeft size={24} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/dashboard" className="nav-link active"><FiHome /><span>Головна</span></Link></li>
            <li><Link to="/friends-dashboard" className="nav-link"><FiUsers /><span>Друзі</span></Link></li>
            <li><Link to="/events" className="nav-link"><FiCalendar /><span>Події</span></Link></li>
            <li><Link to={`/profile/${user?.userId}`} className="nav-link"><FiUser /><span>Профіль</span></Link></li>
            <li><Link to="/chats" className="nav-link"><FiMessageSquare /><span>Чати</span></Link></li>
            <li><Link to="/challenges" className="nav-link"><FiTarget /><span>Челенджі</span></Link></li> {/* 👈 Додали пункт Челенджі */}
            <li><Link to="/premium" className="nav-link"><FiDollarSign /><span>Преміум пропозиція</span></Link></li> {/* новий пункт */}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /><span>Вийти</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        {user ? (
          <>
            <DashboardNav username={user.username} userId={user.userId} onMenuToggle={toggleSidebar} />
            <div className="dashboard-content">
              {/* Котики дня */}
              <section className="dashboard-section">
                <div className="section-header">
                  <h2><FiUser className="icon-spacing" /> Котики дня</h2>
                  <button onClick={refetch} className="refresh-btn" title="Оновити котиків">
                    <FiRefreshCw size={18} />
                  </button>
                </div>

                {catsLoading && <div className="loading"><FiRefreshCw className="spin" /> Завантаження котиків...</div>}
                {catsError && (
                  <div className="error">
                    <p><FiUser className="icon-spacing" /> Помилка: {catsError}</p>
                    <button onClick={refetch} className="retry-btn">
                      <FiRefreshCw className="icon-spacing" /> Спробувати знову
                    </button>
                  </div>
                )}
                <div className="cats-grid">
                  {cats.map((cat) => (
                    <CatCard key={cat.id} cat={cat} />
                  ))}
                </div>
              </section>


             <section className="dashboard-section">
  <div className="section-header">
    <h2><FiTarget className="icon-spacing" /> Мої челенджі</h2>
  </div>
  <ChallengesList />
</section>

              <section className="dashboard-section">
                <div className="section-header">
                  <h2><FiCalendar className="icon-spacing" /> Події</h2>
                  <Link to="/events/create" className="gradient-btn">
                    Створити нову подію
                  </Link>
                </div>
                <EventsPage />
              </section>
            </div>
          </>
        ) : (
          <div className="loading">
            <FiRefreshCw className="spin" /> Завантаження даних користувача...
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
