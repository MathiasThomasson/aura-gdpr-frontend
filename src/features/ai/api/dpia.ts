import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type GenerateDpiaParams = {
  processingActivity: string;
  systemName?: string;
  context?: string;
  riskFactors?: string;
};

export type GeneratedDpia = {
  purpose: string;
  processingDescription: string;
  dataSubjects: string;
  dataCategories: string;
  legalBasis: string;
  mitigationMeasures: string;
  sources: AiSource[];
};

const pick = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback);

export async function generateDpia(params: GenerateDpiaParams): Promise<GeneratedDpia> {
  try {
    const res = await api.post('/api/ai/dpia/generate', params);
    const payload = (res.data ?? {}) as Record<string, unknown>;
    return {
      purpose: pick(payload.purpose ?? payload.goal ?? ''),
      processingDescription: pick(payload.processing_description ?? payload.processingDescription ?? payload.description ?? ''),
      dataSubjects: pick(payload.data_subjects ?? payload.dataSubjects ?? ''),
      dataCategories: pick(payload.data_categories ?? payload.dataCategories ?? ''),
      legalBasis: pick(payload.legal_basis ?? payload.legalBasis ?? ''),
      mitigationMeasures: pick(payload.mitigation_measures ?? payload.mitigationMeasures ?? ''),
      sources: mapSources((payload as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
