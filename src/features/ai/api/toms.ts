import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type TomsRecommendParams = {
  context?: string;
  existingMeasures?: string[];
};

export type TomsRecommendation = {
  recommendedMeasures: string[];
  sources: AiSource[];
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim());
  if (typeof value === 'string') return value.split(/\n|;/).map((item) => item.trim()).filter(Boolean);
  return [];
};

export async function recommendToms(params: TomsRecommendParams): Promise<TomsRecommendation> {
  try {
    const res = await api.post('/ai/toms/recommend', params);
    const data = (res.data ?? {}) as Record<string, unknown>;
    return {
      recommendedMeasures: toArray(data.recommendedMeasures ?? data.measures ?? data.recommendations),
      sources: mapSources((data as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
