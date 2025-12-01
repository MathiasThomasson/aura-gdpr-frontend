import api from '@/lib/apiClient';
import { TomItem, TomCategory, TomEffectiveness } from './types';

const categoryFallback = (value: any): TomCategory => {
  const allowed: TomCategory[] = [
    'access_control',
    'encryption',
    'logging_monitoring',
    'network_security',
    'backup_recovery',
    'organizational_policies',
    'data_minimization',
    'vendor_management',
    'other',
  ];
  return allowed.includes(value) ? value : 'other';
};

const effectivenessFallback = (value: any): TomEffectiveness => {
  const allowed: TomEffectiveness[] = ['low', 'medium', 'high'];
  return allowed.includes(value) ? value : 'medium';
};

const mapTom = (item: any): TomItem => {
  const createdAt = item?.createdAt ?? item?.created_at ?? new Date().toISOString();
  const lastUpdated =
    item?.lastUpdated ?? item?.last_updated ?? item?.updated_at ?? item?.updatedAt ?? createdAt;

  return {
    id: item?.id ?? item?._id ?? '',
    name: item?.name ?? '',
    category: categoryFallback(item?.category),
    description: item?.description ?? '',
    implementation: item?.implementation ?? '',
    effectiveness: effectivenessFallback(item?.effectiveness),
    owner: item?.owner ?? '',
    createdAt,
    lastUpdated,
  };
};

const normalizeList = (payload: unknown): TomItem[] => {
  if (Array.isArray(payload)) return payload.map(mapTom);
  const value = payload as { items?: unknown; toms?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapTom);
  if (Array.isArray(value?.toms)) return value.toms.map(mapTom);
  return [];
};

export async function getAll(): Promise<TomItem[]> {
  const res = await api.get('/api/toms');
  return normalizeList(res.data);
}

export async function getOne(id: string): Promise<TomItem> {
  const res = await api.get(`/api/toms/${id}`);
  return mapTom(res.data);
}

export async function create(payload: Partial<TomItem>): Promise<TomItem> {
  const res = await api.post('/api/toms', payload);
  return mapTom(res.data);
}

export async function update(id: string, payload: Partial<TomItem>): Promise<TomItem> {
  const res = await api.put(`/api/toms/${id}`, payload);
  return mapTom(res.data);
}

export async function patch(id: string, payload: Partial<TomItem>): Promise<TomItem> {
  const res = await api.patch(`/api/toms/${id}`, payload);
  return mapTom(res.data);
}
