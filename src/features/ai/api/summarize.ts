import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type SummarizeParams = {
  text: string;
  context?: string;
};

export type SummarizeResult = {
  summary: string;
  sources: AiSource[];
};

export async function summarizeText(params: SummarizeParams): Promise<SummarizeResult> {
  try {
    const res = await api.post('/api/ai/summarize', params);
    const data = (res.data ?? {}) as Record<string, unknown>;
    return {
      summary: typeof data.summary === 'string' ? data.summary : typeof data.answer === 'string' ? data.answer : '',
      sources: mapSources((data as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
