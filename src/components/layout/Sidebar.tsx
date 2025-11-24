import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, ClipboardList, Activity, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/app/dashboard' },
  { name: 'Processing Activities', icon: ClipboardList, path: '/app/processing' },
  { name: 'Tasks', icon: Activity, path: '/app/tasks' },
  { name: 'Audit Log', icon: FileText, path: '/app/audit-log' },
  { name: 'Settings', icon: Settings, path: '/app/settings' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 p-6 bg-white dark:bg-slate-800 border-r border-border h-screen">
      <div className="mb-8">
        <NavLink to="/app/dashboard">
          <h2 className="text-2xl font-bold text-foreground">AURA-GDPR</h2>
        </NavLink>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 ${
                    isActive ? 'bg-sky-100 dark:bg-slate-700' : ''
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-sky-500" />
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
