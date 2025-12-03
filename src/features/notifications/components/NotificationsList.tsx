import React from 'react';
import { NotificationItem } from '../types';
import NotificationRow from './NotificationRow';

type Props = {
  notifications: NotificationItem[];
  onDelete?: (id: string) => void;
  onMarkRead?: (id: string) => void;
};

const NotificationsList: React.FC<Props> = ({ notifications, onDelete, onMarkRead }) => {
  if (notifications.length === 0) {
    return <p className="text-sm text-muted-foreground">You are all caught up. No notifications to show.</p>;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationRow key={notification.id} notification={notification} onDelete={onDelete} onMarkRead={onMarkRead} />
      ))}
    </div>
  );
};

export default NotificationsList;
