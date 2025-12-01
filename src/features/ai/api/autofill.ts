import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type AutofillParams = {
  fields: string[];
  context?: string;
  documentId?: string;
  currentValues?: Record<string, string>;
};

export type AutofillResult = {
  values: Record<string, string>;
  sources: AiSource[];
};

const normalizeValues = (value: unknown): Record<string, string> => {
  if (typeof value !== 'object' || !value) return {};
  const payload = value as Record<string, unknown>;
  return Object.keys(payload).reduce<Record<string, string>>((acc, key) => {
    acc[key] = typeof payload[key] === 'string' ? (payload[key] as string) : '';
    return acc;
  }, {});
};

export async function autofillDocument(params: AutofillParams): Promise<AutofillResult> {
  try {
    const res = await api.post('/ai/autofill', params);
    const data = (res.data ?? {}) as Record<string, unknown>;
    return {
      values: normalizeValues(data.values ?? data.fields ?? data),
      sources: mapSources((data as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
