import api from '@/lib/apiClient';
import { TemplateItem } from './types';

const mapTemplate = (item: any): TemplateItem => {
  const createdAt = item?.createdAt ?? item?.created_at ?? new Date().toISOString();
  const updatedAt = item?.updatedAt ?? item?.updated_at ?? createdAt;

  return {
    id: item?.id ?? item?._id ?? '',
    templateName: item?.templateName ?? item?.template_name ?? '',
    category: item?.category ?? '',
    content: item?.content ?? '',
    createdAt,
    updatedAt,
  };
};

const normalizeList = (payload: unknown): TemplateItem[] => {
  if (Array.isArray(payload)) return payload.map(mapTemplate);
  const value = payload as { items?: unknown; templates?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapTemplate);
  if (Array.isArray(value?.templates)) return value.templates.map(mapTemplate);
  return [];
};

export async function getAllTemplates(): Promise<TemplateItem[]> {
  try {
    const res = await api.get('/api/templates');
    return normalizeList(res.data);
  } catch (error: any) {
    if (error?.status === 404) return [];
    throw error;
  }
}

export async function getTemplate(id: string): Promise<TemplateItem> {
  const res = await api.get(`/api/templates/${id}`);
  return mapTemplate(res.data);
}

export async function createTemplate(payload: Omit<TemplateItem, 'id'>): Promise<TemplateItem> {
  const res = await api.post('/api/templates', payload);
  return mapTemplate(res.data);
}

export async function updateTemplate(id: string, payload: Partial<TemplateItem>): Promise<TemplateItem> {
  const res = await api.put(`/api/templates/${id}`, payload);
  return mapTemplate(res.data);
}

export async function deleteTemplate(id: string): Promise<void> {
  await api.delete(`/api/templates/${id}`);
}
