import api from '@/lib/apiClient';
import { NotificationItem, NotificationType } from './types';

const typeFallback = (value: any): NotificationType => {
  const allowed: NotificationType[] = [
    'dsr_deadline',
    'policy_expiring',
    'dpia_required',
    'incident_alert',
    'ai_recommendation',
    'system_health',
  ];
  return allowed.includes(value) ? value : 'system_health';
};

const severityFallback = (value: any): NotificationItem['severity'] => {
  const allowed: NotificationItem['severity'][] = ['info', 'warning', 'critical'];
  return allowed.includes(value) ? value : 'info';
};

const mapNotification = (item: any): NotificationItem => ({
  id: item?.id ?? item?._id ?? '',
  type: typeFallback(item?.type),
  title: item?.title ?? '',
  description: item?.description ?? '',
  createdAt: item?.createdAt ?? item?.created_at ?? '',
  read: Boolean(item?.read),
  severity: severityFallback(item?.severity),
  link: item?.link ?? item?.url ?? undefined,
});

const normalizeList = (payload: unknown): NotificationItem[] => {
  if (Array.isArray(payload)) return payload.map(mapNotification);
  const value = payload as { items?: unknown; notifications?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapNotification);
  if (Array.isArray(value?.notifications)) return value.notifications.map(mapNotification);
  return [];
};

export async function getNotifications(): Promise<NotificationItem[]> {
  const res = await api.get('/api/notifications');
  return normalizeList(res.data);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await api.patch(`/api/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await api.post('/api/notifications/mark-all-read');
}
