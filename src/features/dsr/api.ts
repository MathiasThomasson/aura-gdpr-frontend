import api from '@/lib/apiClient';
import {
  CreateDataSubjectRequestInput,
  DataSubjectRequest,
  DataSubjectRequestStatus,
  DataSubjectRequestType,
} from './types';

const statusFallback = (value: any): DataSubjectRequestStatus => {
  const allowed: DataSubjectRequestStatus[] = [
    'received',
    'identity_required',
    'in_progress',
    'waiting_for_information',
    'completed',
    'rejected',
  ];
  return allowed.includes(value) ? value : 'received';
};

const typeFallback = (value: any): DataSubjectRequestType => {
  const allowed: DataSubjectRequestType[] = [
    'access',
    'rectification',
    'erasure',
    'restriction',
    'portability',
    'objection',
    'other',
  ];
  return allowed.includes(value) ? value : 'access';
};

const mapDsr = (item: any): DataSubjectRequest => ({
  ...item,
  type: typeFallback(item?.type),
  status: statusFallback(item?.status),
  dueDate: item?.dueDate ?? item?.due_at ?? null,
  createdAt: item?.createdAt ?? item?.created_at,
  updatedAt: item?.updatedAt ?? item?.updated_at,
});

const normalizeList = (payload: unknown): DataSubjectRequest[] => {
  if (Array.isArray(payload)) return payload.map(mapDsr);
  const value = payload as { items?: unknown; requests?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapDsr);
  if (Array.isArray(value?.requests)) return value.requests.map(mapDsr);
  return [];
};

export async function getDsrs(): Promise<DataSubjectRequest[]> {
  const res = await api.get('/api/dsr');
  return normalizeList(res.data);
}

export async function getDsr(id: string): Promise<DataSubjectRequest> {
  const res = await api.get(`/api/dsr/${id}`);
  return mapDsr(res.data);
}

export async function createDsr(payload: CreateDataSubjectRequestInput): Promise<DataSubjectRequest> {
  const res = await api.post('/api/dsr', payload);
  return mapDsr(res.data);
}

export async function updateDsrStatus(
  id: string,
  status: DataSubjectRequestStatus
): Promise<DataSubjectRequest> {
  const res = await api.patch(`/api/dsr/${id}`, { status });
  return mapDsr(res.data);
}

export async function createPublicDsr(tenantSlug: string, payload: unknown): Promise<void> {
  if (!tenantSlug) throw new Error('Missing tenant identifier.');
  await api.post(`/api/public/dsr/${tenantSlug}`, payload);
}
