import api from '@/lib/apiClient';
import { AuditLogItem, AuditResourceType, AuditSeverity } from './types';

const severityFallback = (value: any): AuditSeverity => {
  const allowed: AuditSeverity[] = ['info', 'warning', 'critical'];
  return allowed.includes(value) ? value : 'info';
};

const resourceFallback = (value: any): AuditResourceType => {
  const allowed: AuditResourceType[] = ['dsr', 'policy', 'document', 'dpia', 'ropa', 'incident', 'toms', 'user', 'tenant', 'system'];
  if (allowed.includes(value)) return value;
  if (typeof value === 'string' && allowed.includes(value.toLowerCase() as AuditResourceType)) {
    return value.toLowerCase() as AuditResourceType;
  }
  return 'system';
};

const mapLog = (item: any): AuditLogItem => {
  const timestamp = item?.timestamp ?? item?.created_at ?? item?.createdAt ?? new Date().toISOString();
  return {
    id: item?.id ?? item?._id ?? `${timestamp}-${item?.action ?? 'log'}`,
    timestamp,
    actor: item?.actor ?? item?.user ?? item?.user_id ?? 'system',
    action: item?.action ?? item?.event ?? '',
    resourceType: resourceFallback(item?.resource_type ?? item?.target_type ?? item?.module),
    resourceId: item?.resource_id ?? item?.target_id ?? '',
    resourceName: item?.resource_name ?? '',
    targetType: item?.target_type ?? '',
    targetId: item?.target_id ?? '',
    userId: item?.user_id ?? '',
    severity: severityFallback(item?.severity),
    ipAddress: item?.ip ?? item?.ip_address,
    userAgent: item?.user_agent ?? '',
    details: item?.details ?? item?.metadata ?? '',
  };
};

const normalizeList = (payload: unknown): AuditLogItem[] => {
  if (Array.isArray(payload)) return payload.map(mapLog);
  const value = payload as { items?: unknown; logs?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapLog);
  if (Array.isArray(value?.logs)) return value.logs.map(mapLog);
  return [];
};

export async function getAuditLogs(params?: { action?: string; startDate?: string; endDate?: string }): Promise<AuditLogItem[]> {
  const res = await api.get('/api/logs', { params });
  return normalizeList(res.data);
}
