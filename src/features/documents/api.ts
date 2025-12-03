import api from '@/lib/apiClient';
import type { DocumentItem } from './types';

const mapDocument = (item: any): DocumentItem => ({
  ...item,
  id: item?.id ?? item?._id ?? item?.document_id ?? '',
  lastUpdated: item?.lastUpdated ?? item?.last_updated ?? item?.updated_at ?? item?.updatedAt ?? '',
  createdAt: item?.createdAt ?? item?.created_at ?? '',
  tags: item?.tags ?? [],
});

const normalizeList = (payload: unknown): DocumentItem[] => {
  if (Array.isArray(payload)) return payload.map(mapDocument);
  const value = payload as { items?: unknown; documents?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapDocument);
  if (Array.isArray(value?.documents)) return value.documents.map(mapDocument);
  return [];
};

export async function getAllDocuments(): Promise<DocumentItem[]> {
  try {
    const res = await api.get('/api/documents');
    return normalizeList(res.data);
  } catch (error: any) {
    if (error?.status === 404) return [];
    throw error;
  }
}

export async function getDocument(id: string): Promise<DocumentItem> {
  const res = await api.get(`/api/documents/${id}`);
  return mapDocument(res.data);
}

export async function createDocument(payload: Omit<DocumentItem, 'id'>): Promise<DocumentItem> {
  const res = await api.post('/api/documents', payload);
  return mapDocument(res.data);
}

export async function updateDocument(id: string, payload: Partial<DocumentItem>): Promise<DocumentItem> {
  const res = await api.put(`/api/documents/${id}`, payload);
  return mapDocument(res.data);
}

export async function patchDocument(id: string, payload: Partial<DocumentItem>): Promise<DocumentItem> {
  const res = await api.patch(`/api/documents/${id}`, payload);
  return mapDocument(res.data);
}
