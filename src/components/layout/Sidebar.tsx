import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Briefcase,
  CheckSquare,
  ClipboardList,
  CreditCard,
  Database,
  Cookie,
  Bell,
  FileSignature,
  FileText,
  Shield,
  ShieldAlert,
  Gauge,
  Inbox,
  Sparkles,
  LayoutDashboard,
  LucideIcon,
  Settings as SettingsIcon,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavItem = {
  label: string;
  path?: string;
  icon: LucideIcon;
  disabled?: boolean;
  adminOnly?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Compliance',
    items: [
      { label: 'Documents', path: '/app/documents', icon: FileText },
      { label: 'Policies', path: '/app/policies', icon: ShieldCheck },
      { label: 'Data Subject Requests', path: '/app/dsr', icon: Inbox },
      { label: 'DPIA', path: '/app/dpia', icon: FileSignature },
      { label: 'ROPA', path: '/app/ropa', icon: Database },
      { label: 'Cookies', path: '/app/cookies', icon: Cookie },
      { label: 'TOMs', path: '/app/toms', icon: Shield },
      { label: 'Incidents', path: '/app/incidents', icon: AlertTriangle },
    ],
  },
  {
    title: 'Governance',
    items: [
      { label: 'Tasks', path: '/app/tasks', icon: CheckSquare },
      { label: 'Projects', path: '/app/projects', icon: Briefcase },
      { label: 'Risk Matrix', path: '/app/risk-matrix', icon: Activity },
      { label: 'Audit Log', path: '/app/audit', icon: ClipboardList },
      { label: 'Notifications', path: '/app/notifications', icon: Bell },
      { label: 'Admin', path: '/app/admin', icon: ShieldCheck, adminOnly: true },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { label: 'AI Assistant', path: '/app/ai-assistant', icon: Sparkles },
      { label: 'AI Policy Generator', icon: FileText, disabled: true },
      { label: 'AI Audit Engine', path: '/app/ai-audit', icon: Gauge },
      { label: 'AI Audit v2', path: '/app/ai/audit-v2', icon: Gauge },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Billing', path: '/app/billing', icon: CreditCard },
      { label: 'Settings', path: '/app/settings', icon: SettingsIcon },
      { label: 'IAM', path: '/app/iam', icon: ShieldCheck },
      { label: 'Security health', path: '/app/security-health', icon: ShieldAlert },
    ],
  },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth() as { user?: { role?: string } };
  const isAdmin = user?.role === 'Admin';

  const sections = React.useMemo(
    () =>
      NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => (item.adminOnly ? isAdmin : true)),
      })).filter((section) => section.items.length > 0),
    [isAdmin]
  );

  const renderNavItem = (item: NavItem) => {
    if (!item.path || item.disabled) {
      return (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-md border-l-2 border-transparent bg-white/50 px-3 py-2 text-sm font-medium text-slate-400"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </div>
      );
    }

    return (
      <NavLink
        key={item.label}
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          cn(
            'group flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-all',
            isActive
              ? 'border-sky-500 bg-white shadow-sm text-slate-900'
              : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/80'
          )
        }
      >
        <item.icon className="h-5 w-5 text-slate-500 group-hover:text-slate-800" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white/90 backdrop-blur shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:flex lg:w-72 lg:translate-x-0 lg:flex-col lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white/70 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Workspace</p>
            <p className="text-lg font-semibold text-slate-900">AURA-GDPR</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-500 hover:text-slate-900"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{section.title}</p>
              <div className="space-y-1">{section.items.map((item) => renderNavItem(item))}</div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
