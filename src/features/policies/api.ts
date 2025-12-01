import api from '@/lib/apiClient';
import type { PolicyItem } from './types';

const mapPolicy = (item: any): PolicyItem => ({
  ...item,
  id: item?.id ?? item?._id ?? item?.policy_id ?? '',
  lastUpdated: item?.lastUpdated ?? item?.last_updated ?? item?.updated_at ?? item?.updatedAt ?? '',
  createdAt: item?.createdAt ?? item?.created_at ?? '',
  tags: item?.tags ?? [],
});

const normalizeList = (payload: unknown): PolicyItem[] => {
  if (Array.isArray(payload)) return payload.map(mapPolicy);
  const value = payload as { items?: unknown; policies?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapPolicy);
  if (Array.isArray(value?.policies)) return value.policies.map(mapPolicy);
  return [];
};

export async function getAllPolicies(): Promise<PolicyItem[]> {
  const res = await api.get('/api/policies');
  return normalizeList(res.data);
}

export async function getPolicy(id: string): Promise<PolicyItem> {
  const res = await api.get(`/api/policies/${id}`);
  return mapPolicy(res.data);
}

export async function createPolicy(payload: Omit<PolicyItem, 'id'>): Promise<PolicyItem> {
  const res = await api.post('/api/policies', payload);
  return mapPolicy(res.data);
}

export async function updatePolicy(id: string, payload: Partial<PolicyItem>): Promise<PolicyItem> {
  const res = await api.put(`/api/policies/${id}`, payload);
  return mapPolicy(res.data);
}

export async function patchPolicy(id: string, payload: Partial<PolicyItem>): Promise<PolicyItem> {
  const res = await api.patch(`/api/policies/${id}`, payload);
  return mapPolicy(res.data);
}

// AI generation remains stubbed until backend is wired.
export async function generatePolicyWithAi(): Promise<{
  title: string;
  summary: string;
  content: string;
}> {
  return Promise.resolve({
    title: 'Privacy Policy',
    summary: 'This policy explains how we collect, use, and protect personal data across our services.',
    content:
      'This AI-generated policy draft outlines how personal data is collected, used, and protected. It should include sections for Introduction, Data We Collect, Legal Bases, Data Sharing, Data Retention, Data Subject Rights, Security Measures, International Transfers, and Contact Information. Please review and tailor this draft to your organization before publishing.',
  });
}
