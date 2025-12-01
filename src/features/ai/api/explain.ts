import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type ExplainParams = {
  text: string;
  context?: string;
};

export type ExplainResult = {
  explanation: string;
  sources: AiSource[];
};

export async function explainText(params: ExplainParams): Promise<ExplainResult> {
  try {
    const res = await api.post('/ai/explain', params);
    const data = (res.data ?? {}) as Record<string, unknown>;
    return {
      explanation: typeof data.explanation === 'string' ? data.explanation : typeof data.answer === 'string' ? data.answer : '',
      sources: mapSources((data as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
