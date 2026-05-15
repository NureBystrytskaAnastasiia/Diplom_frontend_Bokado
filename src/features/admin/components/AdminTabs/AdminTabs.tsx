import React from 'react';
import { FiUsers, FiBarChart2, FiAward } from 'react-icons/fi';
import './AdminTabs.css';

export type AdminTab = 'users' | 'stats' | 'challenges';

interface AdminTabsProps {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
}

const TABS: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: 'users',      label: 'Користувачі', icon: FiUsers      },
  { key: 'stats',      label: 'Статистика',  icon: FiBarChart2  },
  { key: 'challenges', label: 'Челенджі',    icon: FiAward      },
];

const AdminTabs: React.FC<AdminTabsProps> = ({ active, onChange }) => (
  <div className="adm-tabs">
    {TABS.map((t) => (
      <button
        key={t.key}
        className={`adm-tab ${active === t.key ? 'adm-tab--active' : ''}`}
        onClick={() => onChange(t.key)}
      >
        <t.icon size={15} />
        {t.label}
      </button>
    ))}
  </div>
);

export default AdminTabs;
