import React from 'react';
import { Button } from '@/components/ui/button';
import NotificationsList from './components/NotificationsList';
import useNotifications from './hooks/useNotifications';

const NotificationsPage: React.FC = () => {
  const { notifications, markAllAsRead, isLoading, isError } = useNotifications();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-600">Review all system notifications related to your GDPR compliance.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {isLoading && <p className="text-sm text-muted-foreground">Loading notifications...</p>}
        {isError && <p className="text-sm text-red-600">Failed to load notifications.</p>}
        {!isLoading && !isError && <NotificationsList notifications={notifications} />}
      </div>
    </div>
  );
};

export default NotificationsPage;
