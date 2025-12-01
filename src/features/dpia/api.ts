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
  const res = await api.get('/dpia');
  return normalizeList(res.data);
}

export async function getDpia(id: string): Promise<DpiaItem> {
  const res = await api.get(`/dpia/${id}`);
  return mapDpia(res.data);
}

export async function createDpia(payload: Omit<DpiaItem, 'id'>): Promise<DpiaItem> {
  const res = await api.post('/dpia', payload);
  return mapDpia(res.data);
}

export async function updateDpia(id: string, payload: Partial<DpiaItem>): Promise<DpiaItem> {
  const res = await api.put(`/dpia/${id}`, payload);
  return mapDpia(res.data);
}

export async function patchDpia(id: string, payload: Partial<DpiaItem>): Promise<DpiaItem> {
  const res = await api.patch(`/dpia/${id}`, payload);
  return mapDpia(res.data);
}
