import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiCompass, FiCalendar, FiMessageSquare,
  FiTarget, FiStar, FiUser, FiLogOut,
  FiChevronsLeft, FiChevronsRight, FiBell, FiMenu,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { logout } from '../../../features/auth/store/authSlice';
import NotificationBell from '../../../features/notifications/components/NotificationBell/NotificationBell';
import './AppLayout.css';

interface NavItem {
  to:     string;
  icon:   React.ReactNode;
  label:  string;
  badge?: number;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const dispatch    = useAppDispatch();
  const { user }    = useAppSelector(s => s.auth);
  const [collapsed,   setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { to: '/dashboard',               icon: <FiHome />,          label: 'Головна' },
    { to: '/discover',                icon: <FiCompass />,       label: 'Пошук' },
    { to: '/requests',                icon: <FiBell />,          label: 'Запити' },
    { to: '/chats',                   icon: <FiMessageSquare />, label: 'Чати' },
    { to: '/events',                  icon: <FiCalendar />,      label: 'Події' },
    { to: '/challenges',              icon: <FiTarget />,        label: 'Челенджі' },
    { to: '/premium',                 icon: <FiStar />,          label: 'Преміум' },
    { to: `/profile/${user?.userId}`, icon: <FiUser />,          label: 'Профіль' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const sidebarClass = [
    'app-sidebar',
    collapsed  ? 'app-sidebar--collapsed'   : '',
    mobileOpen ? 'app-sidebar--mobile-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="app-layout">
      {mobileOpen && (
        <div
          className="app-layout__overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={sidebarClass}>
        <Link to="/dashboard" className="app-sidebar__logo">
          <div className="app-sidebar__logo-mark">B</div>
          <span className="app-sidebar__logo-text">Bokado</span>
        </Link>

        <nav className="app-sidebar__nav">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`app-sidebar__link ${isActive ? 'app-sidebar__link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.icon}
                <span className="app-sidebar__link-label">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="app-sidebar__badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">
          <div className="app-sidebar__notification-row">
            <NotificationBell />
            {!collapsed && <span className="app-sidebar__notification-label">Сповіщення</span>}
          </div>

          <button
            className="app-sidebar__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Розгорнути' : 'Згорнути'}
          >
            {collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
            <span>{collapsed ? 'Розгорнути' : 'Згорнути'}</span>
          </button>

          <button className="app-sidebar__logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Вийти</span>
          </button>
        </div>
      </aside>

      <main className="app-layout__main">
        <div className="app-mobile-header">
          <button
            className="app-mobile-header__menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Відкрити меню"
          >
            <FiMenu size={22} />
          </button>
          <span className="app-mobile-header__title">Bokado</span>
          <NotificationBell />
        </div>

        {children}
      </main>
    </div>
  );
};

export default AppLayout;