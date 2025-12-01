import React from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Flame,
  Sparkles,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from '../types';
import NotificationTypeBadge from './NotificationTypeBadge';
import { useNotifications } from '../hooks/useNotifications';

type Props = {
  notification: NotificationItem;
};

const iconMap: Record<NotificationItem['type'], React.ReactNode> = {
  dsr_deadline: <Bell className="h-4 w-4 text-amber-600" />,
  policy_expiring: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  dpia_required: <ShieldAlert className="h-4 w-4 text-rose-600" />,
  incident_alert: <Flame className="h-4 w-4 text-rose-600" />,
  ai_recommendation: <Sparkles className="h-4 w-4 text-purple-600" />,
  system_health: <Activity className="h-4 w-4 text-sky-600" />,
};

const severityDot: Record<NotificationItem['severity'], string> = {
  info: 'bg-sky-500',
  warning: 'bg-amber-500',
  critical: 'bg-rose-500',
};

const formatRelative = (value: string) => {
  const date = new Date(value);
  const now = Date.now();
  const diff = Math.max(0, now - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationRow: React.FC<Props> = ({ notification }) => {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = () => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      className={`flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50 focus-within:bg-slate-50 ${
        notification.read ? 'opacity-90' : ''
      }`}
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="relative">
        {iconMap[notification.type]}
        {!notification.read && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-sky-500" />}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <NotificationTypeBadge type={notification.type} />
          <span className={`h-2 w-2 rounded-full ${severityDot[notification.severity]}`} />
          <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
        </div>
        <p className="text-sm text-slate-700">{notification.description}</p>
        <p className="text-xs text-slate-500">{formatRelative(notification.createdAt)}</p>
      </div>
    </div>
  );
};

export default NotificationRow;
