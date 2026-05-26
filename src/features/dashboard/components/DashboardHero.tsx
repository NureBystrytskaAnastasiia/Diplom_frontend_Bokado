import React from 'react';
import type { User } from '../../../features/auth/types/auth';

interface Props {
  user: User | null;
  eventsCount: number;
  doneChalls: number;
  challsCount: number;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Доброго ранку';
  if (h < 18) return 'Доброго дня';
  return 'Доброго вечора';
};

const DashboardHero: React.FC<Props> = ({ user, eventsCount, doneChalls, challsCount }) => (
  <header className="db__hero">
    <div className="db__hero-left">
      <p className="db__greeting">{greeting()},</p>
      <h1 className="db__name">{user?.username ?? '...'} 👋</h1>
      <p className="db__subtitle">Ось що відбувається сьогодні</p>
    </div>
    <div className="db__hero-stats">
      <div className="db__stat">
        <span className="db__stat-val">{eventsCount}</span>
        <span className="db__stat-lbl">Подій</span>
      </div>
      <div className="db__stat">
        <span className="db__stat-val">{doneChalls}</span>
        <span className="db__stat-lbl">Виконано</span>
      </div>
      <div className="db__stat">
        <span className="db__stat-val">{challsCount}</span>
        <span className="db__stat-lbl">Челенджів</span>
      </div>
    </div>
  </header>
);

export default DashboardHero;