import React from 'react';
import { NotificationsContext } from '../NotificationsProvider';

export const useNotifications = () => {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return ctx;
};

export default useNotifications;
