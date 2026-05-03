import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../../types/user';
import { greetings } from '../../data/greetings';

type DashboardNavProps = Pick<UserProfile, 'userId' | 'username'> & {
  onMenuToggle?: () => void;
};

const DashboardNav: React.FC<DashboardNavProps> = ({ username, userId, onMenuToggle }) => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setGreeting(greetings[randomIndex]);
  }, []);

  const goToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="dashboard-nav">
      <div className="nav-content">
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          ☰
        </button>

        <div className="nav-title" onClick={goToDashboard} style={{ cursor: 'pointer' }}>
          Bokado
        </div>

        <div className="user-welcome-card" onClick={goToProfile}>
          <div className="user-info">
            <h2>{greeting}, <span className="accent-text">{username}</span>!</h2>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;