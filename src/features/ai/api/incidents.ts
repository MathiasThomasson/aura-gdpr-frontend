import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type IncidentClassificationRequest = {
  title: string;
  description: string;
  impact?: string;
  dataInvolved?: string;
  detectedAt?: string;
  context?: string;
};

export type IncidentClassification = {
  severity: 'low' | 'medium' | 'high' | 'critical';
  causes: string[];
  recommendedActions: string[];
  obligations: string[];
  summary?: string;
  sources: AiSource[];
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim());
  if (typeof value === 'string') return value.split(/\n|;/).map((item) => item.trim()).filter(Boolean);
  return [];
};

const normalizeSeverity = (value: unknown): IncidentClassification['severity'] => {
  const allowed: IncidentClassification['severity'][] = ['low', 'medium', 'high', 'critical'];
  if (typeof value === 'string' && allowed.includes(value as IncidentClassification['severity'])) {
    return value as IncidentClassification['severity'];
  }
  return 'medium';
};

export async function classifyIncident(payload: IncidentClassificationRequest): Promise<IncidentClassification> {
  try {
    const res = await api.post('/ai/incidents/classify', payload);
    const data = (res.data ?? {}) as Record<string, unknown>;
    return {
      severity: normalizeSeverity(data.severity ?? data.predictedSeverity),
      causes: toArray(data.causes ?? data.likelyCauses),
      recommendedActions: toArray(data.recommendedActions ?? data.actions),
      obligations: toArray(data.regulatoryObligations ?? data.obligations),
      summary: typeof data.summary === 'string' ? data.summary : undefined,
      sources: mapSources((data as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
