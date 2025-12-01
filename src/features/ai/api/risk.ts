import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type RiskEvaluationParams = {
  entityType: 'dpia' | 'ropa' | 'incident' | 'policy' | 'document' | 'dsr' | 'toms';
  payload: Record<string, unknown>;
  context?: string;
};

export type RiskEvaluation = {
  likelihood: number;
  impact: number;
  overall: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  recommendations: string[];
  sources: AiSource[];
};

const normalizeScore = (value: unknown): number => {
  if (typeof value === 'number') return Math.min(5, Math.max(1, Math.round(value)));
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return Math.min(5, Math.max(1, Math.round(parsed)));
  }
  return 3;
};

const normalizeRisk = (value: unknown): RiskEvaluation['overall'] => {
  const allowed: RiskEvaluation['overall'][] = ['low', 'medium', 'high', 'critical'];
  if (typeof value === 'string' && allowed.includes(value as RiskEvaluation['overall'])) {
    return value as RiskEvaluation['overall'];
  }
  return 'medium';
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value === 'string') return value.split(/\n|;/).map((item) => item.trim()).filter(Boolean);
  return [];
};

export async function evaluateRisk(params: RiskEvaluationParams): Promise<RiskEvaluation> {
  try {
    const res = await api.post('/api/ai/risk/evaluate', params);
    const data = (res.data ?? {}) as Record<string, unknown>;
    return {
      likelihood: normalizeScore(data.likelihood),
      impact: normalizeScore(data.impact),
      overall: normalizeRisk(data.overall ?? data.risk ?? data.score),
      explanation: typeof data.explanation === 'string' ? data.explanation : '',
      recommendations: toArray(data.recommendations),
      sources: mapSources((data as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
