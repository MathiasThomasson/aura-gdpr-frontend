import React from 'react';
import { NotificationItem } from '../types';
import NotificationRow from './NotificationRow';

type Props = {
  notifications: NotificationItem[];
};

const NotificationsList: React.FC<Props> = ({ notifications }) => {
  if (notifications.length === 0) {
    return <p className="text-sm text-muted-foreground">You are all caught up. No notifications to show.</p>;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationRow key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationsList;
