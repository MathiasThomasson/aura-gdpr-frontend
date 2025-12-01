import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type GeneratePolicyParams = {
  policyType: string;
  context?: string;
};

export type GeneratedPolicy = {
  title: string;
  summary: string;
  content: string;
  sources: AiSource[];
};

const mapString = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback);

export async function generatePolicy(params: GeneratePolicyParams): Promise<GeneratedPolicy> {
  try {
    const res = await api.post('/api/ai/policies/generate', params);
    const payload = (res.data ?? {}) as Record<string, unknown>;
    return {
      title: mapString(payload.title ?? payload.name ?? ''),
      summary: mapString(payload.summary ?? payload.description ?? ''),
      content: mapString(payload.content ?? payload.body ?? ''),
      sources: mapSources((payload as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
