import api from '@/lib/apiClient';
import { CookieItem, CookieCategory } from './types';

const categoryFallback = (value: any): CookieCategory => {
  const allowed: CookieCategory[] = ['necessary', 'preferences', 'analytics', 'marketing', 'unclassified'];
  return allowed.includes(value) ? value : 'unclassified';
};

const typeFallback = (value: any): CookieItem['type'] => {
  const allowed: Array<CookieItem['type']> = ['first_party', 'third_party'];
  return allowed.includes(value) ? value : 'first_party';
};

const mapCookie = (item: any): CookieItem => {
  const createdAt = item?.createdAt ?? item?.created_at ?? new Date().toISOString();
  const lastUpdated =
    item?.lastUpdated ?? item?.last_updated ?? item?.updated_at ?? item?.updatedAt ?? createdAt;

  return {
    id: item?.id ?? item?._id ?? '',
    name: item?.name ?? '',
    domain: item?.domain ?? '',
    duration: item?.duration ?? item?.retention ?? '',
    category: categoryFallback(item?.category),
    purpose: item?.purpose ?? '',
    provider: item?.provider ?? '',
    type: typeFallback(item?.type),
    source: item?.source ?? 'manual',
    createdAt,
    lastUpdated,
  };
};

const normalizeList = (payload: unknown): CookieItem[] => {
  if (Array.isArray(payload)) return payload.map(mapCookie);
  const value = payload as { items?: unknown; cookies?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapCookie);
  if (Array.isArray(value?.cookies)) return value.cookies.map(mapCookie);
  return [];
};

export async function generateCookiePolicyAi(): Promise<string> {
  return `
This is a mock AI-generated cookie policy in English.
It will later include your cookie inventory, purposes, categories and retention periods.
Please review and adapt before publishing.
`;
}

export async function getAll(): Promise<CookieItem[]> {
  const res = await api.get('/api/cookies');
  return normalizeList(res.data);
}

export async function getOne(id: string): Promise<CookieItem> {
  const res = await api.get(`/api/cookies/${id}`);
  return mapCookie(res.data);
}

export async function create(payload: Partial<CookieItem>): Promise<CookieItem> {
  const res = await api.post('/api/cookies', payload);
  return mapCookie(res.data);
}

export async function update(id: string, payload: Partial<CookieItem>): Promise<CookieItem> {
  const res = await api.put(`/api/cookies/${id}`, payload);
  return mapCookie(res.data);
}

export async function patch(id: string, payload: Partial<CookieItem>): Promise<CookieItem> {
  const res = await api.patch(`/api/cookies/${id}`, payload);
  return mapCookie(res.data);
}
