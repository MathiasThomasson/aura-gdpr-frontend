import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, CreditCard, LogOut, Menu, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import useNotifications from '@/features/notifications/hooks/useNotifications';

type TopbarProps = {
  onMenuClick?: () => void;
};

type AuthUser = {
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  tenantName?: string;
};

const PAGE_TITLES: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/documents': 'Documents',
  '/app/ai-assistant': 'AI Assistant',
  '/app/tasks': 'Tasks',
  '/app/projects': 'Projects',
  '/app/audit': 'Audit Log',
  '/app/risk-matrix': 'Risk Matrix',
  '/app/dsr': 'Data Subject Requests',
  '/app/dpia': 'DPIA',
  '/app/policies': 'Policies',
  '/app/incidents': 'Incidents',
  '/app/billing': 'Billing',
  '/app/settings': 'Settings',
  '/app/settings/notifications': 'Notification Settings',
  '/app/admin': 'Admin',
  '/app/admin/dsr-portal': 'DSR Portal Admin',
  '/app/notifications': 'Notifications',
};

const currentPlan = { type: 'pro', trialDaysLeft: 0 };

const getInitials = (name?: string) => {
  if (!name) return 'AU';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0].toUpperCase()}${parts[parts.length - 1][0].toUpperCase()}`;
};

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth() as { user: AuthUser | null; logout: () => void };
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.name || user?.email || 'AURA User';
  const role = user?.role || 'Member';
  const tenantName = user?.tenantName || 'Acme Privacy Ltd.';
  const planLabel =
    currentPlan.trialDaysLeft > 0 ? `Free trial - ${currentPlan.trialDaysLeft} days left` : 'Pro plan';
  const currentPageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard';

  const handleSignOut = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-600 hover:text-slate-900"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white shadow-sm">
              AG
            </div>
            <div className="leading-tight">
              <p className="text-xs text-slate-500">AURA-GDPR</p>
              <p className="text-sm font-semibold text-slate-900">{tenantName}</p>
            </div>
          </div>
        </div>

        <div className="hidden flex-1 items-center md:flex">
          <div className="mx-6 h-10 w-px bg-slate-200" />
          <p className="text-sm font-medium text-slate-700">{currentPageTitle}</p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 md:flex-none">
          <Badge className="hidden sm:inline-flex items-center gap-2 border border-sky-100 bg-sky-50 text-sky-700 shadow-sm">
            <CheckCircle2 className="h-4 w-4" />
            {planLabel}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 hover:text-slate-900"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
              <DropdownMenuLabel className="text-xs uppercase text-slate-500">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 space-y-1 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="items-start gap-3 px-2 py-2"
                    onSelect={(e) => {
                      e.preventDefault();
                      markAsRead(notification.id);
                      if (notification.link) {
                        navigate(notification.link);
                      }
                    }}
                  >
                    <span
                      className={cn(
                        'mt-1 h-2.5 w-2.5 rounded-full',
                        notification.severity === 'info'
                          ? 'bg-sky-500'
                          : notification.severity === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      )}
                      aria-hidden
                    />
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{notification.description}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
                {notifications.length === 0 && (
                  <div className="px-2 py-3 text-sm text-slate-500">No notifications yet.</div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="justify-center text-sm font-semibold text-sky-700"
                onSelect={(e) => {
                  e.preventDefault();
                  navigate('/app/notifications');
                }}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-2">
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-semibold text-slate-900">{displayName}</div>
                  <div className="text-xs text-slate-500">{role}</div>
                </div>
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={user?.avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-slate-100 text-slate-600">{getInitials(displayName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-sm font-semibold text-slate-900">{displayName}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs font-normal text-slate-500">{tenantName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate('/app/settings')} className="gap-2">
                <UserIcon className="h-4 w-4 text-slate-500" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/app/billing')} className="gap-2">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/app/settings/notifications')} className="gap-2">
                <SettingsIcon className="h-4 w-4 text-slate-500" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut} className="gap-2 text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
