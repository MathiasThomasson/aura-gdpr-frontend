import React from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import NotificationsList from './components/NotificationsList';
import useNotifications from './hooks/useNotifications';

const NotificationsPage: React.FC = () => {
  const { notifications, markAllAsRead, markAsRead, remove, isLoading, isError } = useNotifications();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this notification?');
    if (!confirmed) return;
    await remove(id);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Notifications"
        subtitle="Review all alerts across modules and clear your inbox."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Bell className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Stay on top of compliance alerts."
        bullets={[
          'Mark items as read once actioned.',
          'Delete noise to keep the signal clean.',
          'Jump into linked modules directly from notifications.',
        ]}
      />

      <Card title="Inbox" subtitle="Unread notifications appear first.">
        {isLoading && <p className="text-sm text-muted-foreground">Loading notifications...</p>}
        {isError && <p className="text-sm text-red-600">Failed to load notifications.</p>}
        {!isLoading && !isError && notifications.length === 0 ? (
          <EmptyState title="No notifications yet" description="You are all caught up." icon={<Bell className="h-5 w-5" />} />
        ) : null}
        {!isLoading && !isError && notifications.length > 0 ? (
          <NotificationsList notifications={notifications} onDelete={handleDelete} onMarkRead={markAsRead} />
        ) : null}
      </Card>
    </div>
  );
};

export default NotificationsPage;
