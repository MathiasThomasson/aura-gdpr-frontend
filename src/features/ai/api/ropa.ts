import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type RopaSuggestParams = {
  context?: string;
  existingData?: Record<string, unknown>;
};

export type RopaSuggestion = {
  legalBasis: string;
  retentionPeriod: string;
  securityMeasures: string;
  notes: string;
  sources: AiSource[];
};

const pick = (value: unknown): string => (typeof value === 'string' ? value : '');

export async function suggestRopaFields(params: RopaSuggestParams): Promise<RopaSuggestion> {
  try {
    const res = await api.post('/ai/ropa/suggest', params);
    const data = (res.data ?? {}) as Record<string, unknown>;
    return {
      legalBasis: pick(data.legal_basis ?? data.legalBasis),
      retentionPeriod: pick(data.retention_period ?? data.retentionPeriod),
      securityMeasures: pick(data.security_measures ?? data.securityMeasures),
      notes: pick(data.notes),
      sources: mapSources((data as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
