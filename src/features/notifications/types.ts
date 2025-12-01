export type NotificationType =
  | 'dsr_deadline'
  | 'policy_expiring'
  | 'dpia_required'
  | 'incident_alert'
  | 'ai_recommendation'
  | 'system_health';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  severity: 'info' | 'warning' | 'critical';
  link?: string;
}
