import api from '@/lib/apiClient';
import { IncidentItem, IncidentSeverity, IncidentStatus, IncidentTimelineEvent } from './types';

const severityFallback = (value: any): IncidentSeverity => {
  const allowed: IncidentSeverity[] = ['low', 'medium', 'high', 'critical'];
  return allowed.includes(value) ? value : 'medium';
};

const statusFallback = (value: any): IncidentStatus => {
  const allowed: IncidentStatus[] = ['open', 'investigating', 'contained', 'resolved', 'closed'];
  return allowed.includes(value) ? value : 'open';
};

const mapTimelineEvent = (item: any): IncidentTimelineEvent => ({
  id: item?.id ?? item?._id ?? `timeline-${item?.timestamp ?? Date.now()}`,
  timestamp: item?.timestamp ?? item?.time ?? item?.created_at ?? item?.createdAt ?? new Date().toISOString(),
  actor: item?.actor ?? item?.user ?? 'System',
  action: item?.action ?? item?.activity ?? '',
  notes: item?.notes ?? item?.description ?? undefined,
});

const mapIncident = (item: any): IncidentItem => {
  const createdAt = item?.createdAt ?? item?.created_at ?? new Date().toISOString();
  const lastUpdated =
    item?.lastUpdated ?? item?.last_updated ?? item?.updated_at ?? item?.updatedAt ?? createdAt;

  return {
    id: item?.id ?? item?._id ?? '',
    title: item?.title ?? '',
    systemName: item?.systemName ?? item?.system_name ?? '',
    severity: severityFallback(item?.severity),
    status: statusFallback(item?.status),
    description: item?.description ?? '',
    affectedData: item?.affectedData ?? item?.affected_data ?? '',
    affectedSubjects: item?.affectedSubjects ?? item?.affected_subjects ?? '',
    detectionMethod: item?.detectionMethod ?? item?.detection_method ?? '',
    createdAt,
    lastUpdated,
    timeline: Array.isArray(item?.timeline) ? item.timeline.map(mapTimelineEvent) : [],
  };
};

const normalizeList = (payload: unknown): IncidentItem[] => {
  if (Array.isArray(payload)) return payload.map(mapIncident);
  const value = payload as { items?: unknown; incidents?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapIncident);
  if (Array.isArray(value?.incidents)) return value.incidents.map(mapIncident);
  return [];
};

export async function getAll(): Promise<IncidentItem[]> {
  try {
    const res = await api.get('/api/incidents');
    return normalizeList(res.data);
  } catch (error: any) {
    if (error?.status === 404) return [];
    throw error;
  }
}

export async function getOne(id: string): Promise<IncidentItem> {
  const res = await api.get(`/api/incidents/${id}`);
  return mapIncident(res.data);
}

export async function create(payload: Partial<IncidentItem>): Promise<IncidentItem> {
  const res = await api.post('/api/incidents', payload);
  return mapIncident(res.data);
}

export async function update(id: string, payload: Partial<IncidentItem>): Promise<IncidentItem> {
  const res = await api.put(`/api/incidents/${id}`, payload);
  return mapIncident(res.data);
}

export async function patch(id: string, payload: Partial<IncidentItem>): Promise<IncidentItem> {
  const res = await api.patch(`/api/incidents/${id}`, payload);
  return mapIncident(res.data);
}
