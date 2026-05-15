import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiUsers, FiStar, FiShield, FiAward, FiLogOut } from 'react-icons/fi';
import type { AppDispatch } from '../../../../store';
import { logout } from '../../../auth/store/authSlice';
import type { UserDetailInfoDto } from '../../types/admin';
import './AdminHeader.css';

interface AdminHeaderProps {
  users: UserDetailInfoDto[];
  challengeCount: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ users, challengeCount }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const total   = users.length;
  const premium = users.filter((u) => u.isPremium).length;
  const banned  = users.filter((u) => u.isBanned).length;

  const stats = [
    { icon: FiUsers,  value: total,          label: 'Користувачів', color: 'purple' },
    { icon: FiStar,   value: premium,        label: 'Premium',      color: 'gold'   },
    { icon: FiShield, value: banned,         label: 'Заблоковано',  color: 'red'    },
    { icon: FiAward,  value: challengeCount, label: 'Челенджів',    color: 'teal'   },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="adm-header">
      <div className="adm-header__brand">
        <Link to="/dashboard" className="adm-header__logo">B</Link>
        <div>
          <h1 className="adm-header__title">Адмін-панель</h1>
          <p className="adm-header__sub">Bokado · управління платформою</p>
        </div>
      </div>

      <div className="adm-header__stats">
        {stats.map((s) => (
          <div key={s.label} className="adm-stat">
            <div className={`adm-stat__icon adm-stat__icon--${s.color}`}>
              <s.icon size={16} />
            </div>
            <div>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="adm-logout" onClick={handleLogout}>
        <FiLogOut size={15} />
        Вийти
      </button>
    </header>
  );
};

export default AdminHeader;