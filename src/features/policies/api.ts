import api from '@/lib/apiClient';
import type { PolicyItem, PolicyType } from './types';

export interface GeneratePolicyInput {
  policyType: PolicyType;
  contextDescription?: string;
}

export interface GeneratePolicyResult {
  title: string;
  summary: string;
  content: string;
}

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

export async function generatePolicyWithAi(input: GeneratePolicyInput): Promise<GeneratePolicyResult> {
  try {
    const res = await api.post('/api/ai/policies/generate', {
      policy_type: input.policyType,
      context_description: input.contextDescription ?? '',
      language: 'en',
    });

    const data = res.data ?? {};
    return {
      title: data.title ?? '',
      summary: data.summary ?? '',
      content: data.content ?? '',
    };
  } catch (error) {
    throw new Error('Failed to generate policy with AI');
  }
}
