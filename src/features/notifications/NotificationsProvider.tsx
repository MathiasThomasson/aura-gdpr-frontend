import React from 'react';
import { NotificationItem } from './types';
import { deleteNotification, getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from './api';

type NotificationsContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
};

export const NotificationsContext = React.createContext<NotificationsContextValue | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const markAsRead = React.useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      try {
        await markNotificationAsRead(id);
      } catch (error) {
        setIsError(true);
      }
    },
    []
  );

  const markAllAsRead = React.useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      setIsError(true);
    }
  }, []);

  const remove = React.useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNotification(id);
    } catch (error) {
      setIsError(true);
    }
  }, []);

  const value = React.useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markAsRead,
      markAllAsRead,
      remove,
      isLoading,
      isError,
    }),
    [notifications, markAllAsRead, markAsRead, remove, isError, isLoading]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export default NotificationsProvider;
