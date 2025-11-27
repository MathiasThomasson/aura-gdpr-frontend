import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Zap, CreditCard, Settings, ShieldCheck, CheckSquare, Briefcase, ClipboardList, FileSignature, ShieldAlert, Inbox } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/app/dashboard' },
  { name: 'Documents', icon: FileText, path: '/app/documents' },
  { name: 'AI Assistant', icon: Zap, path: '/app/ai-assistant' },
  { name: 'Tasks', icon: CheckSquare, path: '/app/tasks' },
  { name: 'Projects', icon: Briefcase, path: '/app/projects' },
  { name: 'Audit Log', icon: ClipboardList, path: '/app/audit' },
  { name: 'Risk Matrix', icon: ShieldAlert, path: '/app/risk-matrix' },
  { name: 'Data Subject Requests', icon: Inbox, path: '/app/dsr' },
  { name: 'DPIA', icon: FileSignature, path: '/app/dpia' },
  { name: 'Policies', icon: FileText, path: '/app/policies' },
  { name: 'Billing', icon: CreditCard, path: '/app/billing' },
  { name: 'Settings', icon: Settings, path: '/app/settings' },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth() as { user?: { role?: string } };
  const isAdmin = user?.role === 'Admin';

  const items = React.useMemo(() => {
    if (isAdmin) {
      return [...navItems, { name: 'Admin', icon: ShieldCheck, path: '/app/admin' }];
    }
    return navItems;
  }, [isAdmin]);

  return (
    <aside className="w-64 p-6 bg-white dark:bg-slate-800 border-r border-border h-screen">
      <div className="mb-8">
        <NavLink to="/app/dashboard">
          <h2 className="text-2xl font-bold text-foreground">AURA-GDPR</h2>
        </NavLink>
      </div>
      <nav>
        <ul className="space-y-2">
          {items.map((item) => (
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
