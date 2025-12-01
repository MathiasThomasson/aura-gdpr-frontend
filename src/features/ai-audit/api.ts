import api from '@/lib/apiClient';
import type { AuditAreaKey, AuditRun } from './types';

const areaFallback = (value: any): AuditAreaKey => {
  const allowed: AuditAreaKey[] = ['dsr', 'policies', 'documents', 'dpia', 'ropa', 'incidents', 'security_measures'];
  return allowed.includes(value) ? value : 'policies';
};

const statusFallback = (value: any): AuditRun['areas'][number]['status'] => {
  const allowed: AuditRun['areas'][number]['status'][] = ['good', 'needs_attention', 'critical'];
  return allowed.includes(value) ? value : 'needs_attention';
};

const recommendationSeverityFallback = (value: any): AuditRun['recommendations'][number]['severity'] => {
  const allowed: AuditRun['recommendations'][number]['severity'][] = ['low', 'medium', 'high'];
  return allowed.includes(value) ? value : 'medium';
};

const mapAuditRun = (item: any): AuditRun => ({
  id: item?.id ?? item?._id ?? '',
  createdAt: item?.createdAt ?? item?.created_at ?? '',
  completedAt: item?.completedAt ?? item?.completed_at ?? item?.finished_at ?? '',
  overallScore: item?.overallScore ?? item?.score ?? 0,
  areas: Array.isArray(item?.areas)
    ? item.areas.map((area: any) => ({
        key: areaFallback(area?.key ?? area?.id),
        name: area?.name ?? '',
        score: area?.score ?? 0,
        status: statusFallback(area?.status),
        summary: area?.summary ?? '',
        recommendationsCount: area?.recommendationsCount ?? area?.recommendations_count ?? 0,
      }))
    : [],
  recommendations: Array.isArray(item?.recommendations)
    ? item.recommendations.map((rec: any) => ({
        id: rec?.id ?? rec?._id ?? '',
        area: areaFallback(rec?.area),
        title: rec?.title ?? '',
        description: rec?.description ?? '',
        severity: recommendationSeverityFallback(rec?.severity),
        estimatedImpact: rec?.estimatedImpact ?? rec?.estimated_impact ?? undefined,
      }))
    : [],
});

const normalizeList = (payload: unknown): AuditRun[] => {
  if (Array.isArray(payload)) return payload.map(mapAuditRun);
  const value = payload as { items?: unknown; history?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapAuditRun);
  if (Array.isArray(value?.history)) return value.history.map(mapAuditRun);
  return [];
};

export async function fetchLatestAiAudit(): Promise<AuditRun | null> {
  const res = await api.get('/api/ai/audit/latest');
  if (!res.data) return null;
  return mapAuditRun(res.data);
}

export async function fetchAiAuditHistory(): Promise<AuditRun[]> {
  const res = await api.get('/api/ai/audit/history');
  return normalizeList(res.data);
}

export async function runAiAudit(): Promise<AuditRun> {
  const res = await api.post('/api/ai/audit/run');
  return mapAuditRun(res.data);
}
