import { useSelector } from 'react-redux';
  import type { RootState } from '../../store';
  import '../../styles/Admin.css';

  const UsersCalendar = () => {
    const userStats = useSelector((state: RootState) => state.admin.userStats);

    if (!userStats || userStats.length === 0) {
      return (
        <div className="no-data">
          <p>Статистика користувачів недоступна</p>
        </div>
      );
    }

    const monthCounts: Record<string, number> = {};
    userStats.forEach((stat) => {
      const date = Object.keys(stat)[0];
      const usersForDate = stat[date];
      const month = date.slice(0, 7);
      monthCounts[month] = (monthCounts[month] || 0) + usersForDate.length;
    });

    const sortedMonths = Object.entries(monthCounts).sort(([a], [b]) => a.localeCompare(b));
    const maxCount = Math.max(...Object.values(monthCounts));

    return (
      <div className="calendar-widget">
        <h3>Зростання користувачів</h3>
        <div className="calendar-bars">
          {sortedMonths.map(([month, count]) => {
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={month} className="month-bar">
                <div 
                  className="bar-fill" 
                  style={{ height: `${height}%` }}
                  data-count={count}
                ></div>
                <span className="month-label">{month}</span>
              </div>
            );
          })}
        </div>
        <div className="calendar-legend">
          <span>0</span>
          <span>{Math.floor(maxCount / 2)}</span>
          <span>{maxCount}</span>
        </div>
      </div>
    );
  };

  export default UsersCalendar;