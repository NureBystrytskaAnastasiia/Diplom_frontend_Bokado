import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import './UsersCalendar.css';

const MONTH_UA: Record<string, string> = {
  '01': 'Січ', '02': 'Лют', '03': 'Бер', '04': 'Кві',
  '05': 'Тра', '06': 'Чер', '07': 'Лип', '08': 'Сер',
  '09': 'Вер', '10': 'Жов', '11': 'Лис', '12': 'Гру',
};

const UsersCalendar: React.FC = () => {
  const userStats = useSelector((state: RootState) => state.admin.userStats);

  if (!userStats || userStats.length === 0) {
    return (
      <div className="ucal__empty">
        <p>Статистика реєстрацій недоступна</p>
      </div>
    );
  }

  // Агрегуємо по місяцях
  const monthCounts: Record<string, number> = {};
  userStats.forEach((stat) => {
    const date = Object.keys(stat)[0];
    const count = stat[date]?.length ?? 0;
    const month = date.slice(0, 7);
    monthCounts[month] = (monthCounts[month] || 0) + count;
  });

  const sorted  = Object.entries(monthCounts).sort(([a], [b]) => a.localeCompare(b));
  const maxVal  = Math.max(...Object.values(monthCounts), 1);
  const total   = Object.values(monthCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="ucal">
      <div className="ucal__meta">
        <span className="ucal__total">Всього реєстрацій: <strong>{total}</strong></span>
      </div>

      <div className="ucal__bars">
        {sorted.map(([month, count]) => {
          const pct     = Math.max(4, (count / maxVal) * 100);
          const [, mon] = month.split('-');
          const label   = MONTH_UA[mon] ?? mon;

          return (
            <div key={month} className="ucal__bar-col">
              <span className="ucal__bar-count">{count}</span>
              <div className="ucal__bar-track">
                <div
                  className="ucal__bar-fill"
                  style={{ height: `${pct}%` }}
                  title={`${month}: ${count}`}
                />
              </div>
              <span className="ucal__bar-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UsersCalendar;
