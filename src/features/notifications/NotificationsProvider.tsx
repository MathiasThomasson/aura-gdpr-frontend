import React from 'react';
import useNotificationsMockData from './hooks/useNotificationsMockData';
import { NotificationItem } from './types';

type NotificationsContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
  isError: boolean;
};

export const NotificationsContext = React.createContext<NotificationsContextValue | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications, setNotifications, isLoading, isError } = useNotificationsMockData();

  const markAsRead = React.useCallback(
    (id: string) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    [setNotifications]
  );

  const markAllAsRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const value = React.useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markAsRead,
      markAllAsRead,
      isLoading,
      isError,
    }),
    [notifications, markAllAsRead, markAsRead, isError, isLoading]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export default NotificationsProvider;
