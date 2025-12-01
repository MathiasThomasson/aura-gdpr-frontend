export type AuditSeverity = 'info' | 'warning' | 'critical';

export type AuditResourceType =
  | 'dsr'
  | 'policy'
  | 'document'
  | 'dpia'
  | 'ropa'
  | 'incident'
  | 'toms'
  | 'user'
  | 'tenant'
  | 'system';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resourceType: AuditResourceType;
  resourceId?: string;
  resourceName?: string;
  severity: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
}
