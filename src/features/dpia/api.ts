import api from '@/lib/apiClient';
import type { DpiaItem } from './types';

const mapDpia = (item: any): DpiaItem => ({
  ...item,
  id: item?.id ?? item?._id ?? item?.dpia_id ?? '',
  createdAt: item?.createdAt ?? item?.created_at ?? '',
  lastUpdated: item?.lastUpdated ?? item?.last_updated ?? item?.updated_at ?? item?.updatedAt ?? '',
  risk: item?.risk ?? item?.risk_rating ?? item?.riskRating ?? {
    likelihood: 1,
    impact: 1,
    overallScore: 1,
    level: 'low',
  },
});

const normalizeList = (payload: unknown): DpiaItem[] => {
  if (Array.isArray(payload)) return payload.map(mapDpia);
  const value = payload as { items?: unknown; dpias?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapDpia);
  if (Array.isArray(value?.dpias)) return value.dpias.map(mapDpia);
  return [];
};

export async function getAllDpia(): Promise<DpiaItem[]> {
  try {
    const res = await api.get('/api/dpia');
    return normalizeList(res.data);
  } catch (error: any) {
    if (error?.status === 404) return [];
    throw error;
  }
}

export async function getDpia(id: string): Promise<DpiaItem> {
  const res = await api.get(`/api/dpia/${id}`);
  return mapDpia(res.data);
}

export async function createDpia(payload: Omit<DpiaItem, 'id'>): Promise<DpiaItem> {
  const res = await api.post('/api/dpia', payload);
  return mapDpia(res.data);
}

export async function updateDpia(id: string, payload: Partial<DpiaItem>): Promise<DpiaItem> {
  const res = await api.put(`/api/dpia/${id}`, payload);
  return mapDpia(res.data);
}

export async function patchDpia(id: string, payload: Partial<DpiaItem>): Promise<DpiaItem> {
  const res = await api.patch(`/api/dpia/${id}`, payload);
  return mapDpia(res.data);
}

export async function deleteDpia(id: string): Promise<void> {
  await api.delete(`/api/dpia/${id}`);
}
