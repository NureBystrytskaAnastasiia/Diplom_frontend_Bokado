// src/features/admin/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

import type { RootState, AppDispatch } from '../../../store';
import { getAllUsers, getUserStats, getChallengeStats } from '../store/adminSlice';

import AdminHeader       from '../components/AdminHeader/AdminHeader';
import AdminTabs, { type AdminTab } from '../components/AdminTabs/AdminTabs';
import UsersTable        from '../components/UsersTable/UsersTable';
import UsersCalendar     from '../components/UsersCalendar/UsersCalendar';
import ChallengesManager from '../components/ChallengesManager/ChallengesManager';
import SupportPanel      from '../components/SupportPanel/SupportPanel';

import '../styles/Admin.css';

const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, challengeStats, loading, error } = useSelector((s: RootState) => s.admin);
  const [tab, setTab] = useState<AdminTab>('users');

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getUserStats());
    dispatch(getChallengeStats());
  }, [dispatch]);

  if (loading) return (
    <div className="adm-loading-page">
      <div className="adm-spinner-lg" />
      <p>Завантажуємо панель...</p>
    </div>
  );

  if (error) return (
    <div className="adm-error-page">
      <FiAlertTriangle size={40} color="#EF4444" />
      <p>{error}</p>
      <button className="adm-retry-btn" onClick={() => window.location.reload()}>
        <FiRefreshCw size={14} /> Повторити
      </button>
    </div>
  );

  const challengeCount = challengeStats ? Object.keys(challengeStats).length : 0;

  return (
    <div className="adm-page">
      <AdminHeader users={users} challengeCount={challengeCount} />
      <AdminTabs active={tab} onChange={setTab} />

      <div style={{ padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem)', flex: 1 }}>
        <AnimatePresence mode="wait">

          {tab === 'users' && (
            <motion.div key="users" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <div className="adm-section">
                <h2 className="adm-section__title">Управління користувачами</h2>
                <UsersTable users={users} />
              </div>
            </motion.div>
          )}

          {tab === 'stats' && (
            <motion.div key="stats" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="adm-section">
                  <h2 className="adm-section__title">Реєстрації по місяцях</h2>
                  <UsersCalendar />
                </div>
                <div className="adm-section">
                  <h2 className="adm-section__title">Топ челенджів</h2>
                  {challengeStats ? (
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {(Object.entries(challengeStats) as [string, number][])
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 6)
                        .map(([id, count]) => {
                          const max = Math.max(...(Object.values(challengeStats) as number[]));
                          return (
                            <li key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7C4DFF', width: 36, flexShrink: 0 }}>#{id}</span>
                              <div style={{ flex: 1, height: 6, background: '#EDE7F6', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${(count / max) * 100}%`, background: '#7C4DFF', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#B0A4CC', width: 28, textAlign: 'right', flexShrink: 0 }}>{count}</span>
                            </li>
                          );
                        })}
                    </ul>
                  ) : <p style={{ color: '#B0A4CC', fontSize: '0.875rem' }}>Немає даних</p>}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'challenges' && (
            <motion.div key="challenges" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <div className="adm-section">
                <h2 className="adm-section__title">Управління челенджами</h2>
                <ChallengesManager />
              </div>
            </motion.div>
          )}

          {tab === 'support' && (
            <motion.div key="support" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <div className="adm-section">
                <h2 className="adm-section__title">Підтримка користувачів</h2>
                <p style={{ fontSize: '0.85rem', color: '#6B5B8E', marginBottom: '1.25rem', marginTop: '-0.5rem' }}>
                  Натисніть «Написати» — відкриється особистий чат з користувачем.
                  Після активації Premium або вирішення питання чат залишається в розділі Чати.
                </p>
                <SupportPanel users={users} />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPage;