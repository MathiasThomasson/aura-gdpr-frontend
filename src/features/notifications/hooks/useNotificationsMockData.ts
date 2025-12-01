import { useState } from 'react';
import { NotificationItem } from '../types';

export function useNotificationsMockData() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'dsr_deadline',
      title: 'DSR deadline approaching',
      description: 'A data subject request is due in 2 days.',
      createdAt: '2025-05-14T10:00:00Z',
      read: false,
      severity: 'warning',
      link: '/app/dsr',
    },
    {
      id: '2',
      type: 'ai_recommendation',
      title: 'AI audit suggestion',
      description: 'One policy has not been reviewed in 18 months.',
      createdAt: '2025-05-13T15:30:00Z',
      read: false,
      severity: 'info',
    },
    {
      id: '3',
      type: 'policy_expiring',
      title: 'Policy expiring soon',
      description: 'Cookie Policy must be reviewed by May 30.',
      createdAt: '2025-05-12T09:00:00Z',
      read: true,
      severity: 'warning',
      link: '/app/policies',
    },
  ]);

  return {
    notifications,
    setNotifications,
    isLoading: false,
    isError: false,
  };
}

export default useNotificationsMockData;
