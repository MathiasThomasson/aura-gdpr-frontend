import api from '@/lib/apiClient';
import type { RopaItem } from './types';

const mapRopa = (item: any): RopaItem => ({
  ...item,
  id: item?.id ?? item?._id ?? item?.ropa_id ?? '',
  createdAt: item?.createdAt ?? item?.created_at ?? '',
  lastUpdated: item?.lastUpdated ?? item?.last_updated ?? item?.updated_at ?? item?.updatedAt ?? '',
});

const normalizeList = (payload: unknown): RopaItem[] => {
  if (Array.isArray(payload)) return payload.map(mapRopa);
  const value = payload as { items?: unknown; records?: unknown; ropa?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapRopa);
  if (Array.isArray(value?.records)) return value.records.map(mapRopa);
  if (Array.isArray(value?.ropa)) return value.ropa.map(mapRopa);
  return [];
};

export async function getAllRopa(): Promise<RopaItem[]> {
  const res = await api.get('/ropa');
  return normalizeList(res.data);
}

export async function getRopa(id: string): Promise<RopaItem> {
  const res = await api.get(`/ropa/${id}`);
  return mapRopa(res.data);
}

export async function createRopa(payload: Omit<RopaItem, 'id'>): Promise<RopaItem> {
  const res = await api.post('/ropa', payload);
  return mapRopa(res.data);
}

export async function updateRopa(id: string, payload: Partial<RopaItem>): Promise<RopaItem> {
  const res = await api.put(`/ropa/${id}`, payload);
  return mapRopa(res.data);
}

export async function patchRopa(id: string, payload: Partial<RopaItem>): Promise<RopaItem> {
  const res = await api.patch(`/ropa/${id}`, payload);
  return mapRopa(res.data);
}
