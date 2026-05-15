import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiSearch, FiCheckCircle, FiXCircle, FiStar, FiSlash, FiFilter } from 'react-icons/fi';
import type { AppDispatch } from '../../../../store';
import {
  banUserById, unbanUserById, subscribeUser, unsubscribeUser,
} from '../../store/adminSlice';
import type { UserDetailInfoDto } from '../../types/admin';
import './UsersTable.css';

interface UsersTableProps {
  users: UserDetailInfoDto[];
}

type Filter = 'all' | 'active' | 'banned' | 'premium';

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<Filter>('all');

  const filtered = users.filter((u) => {
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === 'all'     ? true :
      filter === 'active'  ? !u.isBanned :
      filter === 'banned'  ? u.isBanned :
      filter === 'premium' ? u.isPremium : true;

    return matchSearch && matchFilter;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: 'all',     label: 'Всі'          },
    { key: 'active',  label: 'Активні'      },
    { key: 'banned',  label: 'Заблоковані'  },
    { key: 'premium', label: 'Premium'      },
  ];

  return (
    <div className="users-table-wrap">
      {/* Тулбар */}
      <div className="users-table__toolbar">
        <div className="users-table__search">
          <FiSearch size={14} className="users-table__search-icon" />
          <input
            className="users-table__search-input"
            placeholder="Пошук за ім'ям або email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="users-table__filters">
          <FiFilter size={13} className="users-table__filter-icon" />
          {filters.map((f) => (
            <button
              key={f.key}
              className={`users-table__filter-btn ${filter === f.key ? 'users-table__filter-btn--active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Лічильник */}
      <p className="users-table__count">
        Показано {filtered.length} з {users.length} користувачів
      </p>

      {/* Таблиця */}
      <div className="users-table__scroll">
        <table className="users-table">
          <thead>
            <tr>
              <th>Користувач</th>
              <th>Email</th>
              <th>Статус</th>
              <th>Підписка</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="users-table__empty">
                  Нічого не знайдено
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.userId} className="users-table__row">
                  <td>
                    <div className="users-table__user">
                      <div className="users-table__avatar">
                        {user.avatarUrl ? (
                          <img
                            src={`https://localhost:7192${user.avatarUrl}`}
                            alt={user.username}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.removeAttribute('style');
                            }}
                          />
                        ) : null}
                        <span style={ user.avatarUrl ? { display: 'none' } : {} }>
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="users-table__username">{user.username}</span>
                    </div>
                  </td>
                  <td className="users-table__email">{user.email}</td>
                  <td>
                    <span className={`adm-badge ${user.isBanned ? 'adm-badge--red' : 'adm-badge--green'}`}>
                      {user.isBanned ? 'Заблоковано' : 'Активний'}
                    </span>
                  </td>
                  <td>
                    <span className={`adm-badge ${user.isPremium ? 'adm-badge--gold' : 'adm-badge--gray'}`}>
                      {user.isPremium ? '✦ Premium' : 'Basic'}
                    </span>
                  </td>
                  <td>
                    <div className="users-table__actions">
                      {user.isBanned ? (
                        <button
                          className="adm-btn adm-btn--green"
                          onClick={() => dispatch(unbanUserById(user.userId))}
                          title="Розблокувати"
                        >
                          <FiCheckCircle size={13} /> Розблокувати
                        </button>
                      ) : (
                        <button
                          className="adm-btn adm-btn--red"
                          onClick={() => dispatch(banUserById(user.userId))}
                          title="Заблокувати"
                        >
                          <FiXCircle size={13} /> Заблокувати
                        </button>
                      )}
                      {user.isPremium ? (
                        <button
                          className="adm-btn adm-btn--gray"
                          onClick={() => dispatch(unsubscribeUser(user.userId))}
                          title="Зняти Premium"
                        >
                          <FiSlash size={13} /> Зняти Premium
                        </button>
                      ) : (
                        <button
                          className="adm-btn adm-btn--gold"
                          onClick={() => dispatch(subscribeUser(user.userId))}
                          title="Надати Premium"
                        >
                          <FiStar size={13} /> Premium
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
