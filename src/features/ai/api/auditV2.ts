import api from '@/lib/apiClient';
import { AiSource, mapSources } from '../types';
import { extractErrorMessage } from './common';

export type AuditAreaStatus = 'good' | 'needs_attention' | 'critical';

export type AuditV2Area = {
  id: string;
  name: string;
  score: number;
  status: AuditAreaStatus;
  summary: string;
};

export type AuditV2Result = {
  overallScore: number;
  areas: AuditV2Area[];
  recommendations: string[];
  sources: AiSource[];
};

const normalizeStatus = (value: unknown): AuditAreaStatus => {
  const allowed: AuditAreaStatus[] = ['good', 'needs_attention', 'critical'];
  if (typeof value === 'string' && allowed.includes(value as AuditAreaStatus)) {
    return value as AuditAreaStatus;
  }
  return 'needs_attention';
};

const mapArea = (value: unknown): AuditV2Area | null => {
  if (typeof value !== 'object' || !value) return null;
  const payload = value as Record<string, unknown>;
  const id = typeof payload.id === 'string' ? payload.id : typeof payload._id === 'string' ? (payload._id as string) : undefined;
  if (!id) return null;
  return {
    id,
    name: typeof payload.name === 'string' ? payload.name : 'Area',
    score: typeof payload.score === 'number' ? payload.score : typeof payload.score === 'string' ? Number(payload.score) || 0 : 0,
    status: normalizeStatus(payload.status),
    summary: typeof payload.summary === 'string' ? payload.summary : '',
  };
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value === 'string') return value.split(/\n|;/).map((item) => item.trim()).filter(Boolean);
  return [];
};

export async function runAiAuditV2(): Promise<AuditV2Result> {
  try {
    const res = await api.post('/api/ai/audit/run-v2');
    const data = (res.data ?? {}) as Record<string, unknown>;
    const areasRaw = Array.isArray(data.areas) ? data.areas : Array.isArray((data as { area_results?: unknown }).area_results) ? (data as { area_results: unknown[] }).area_results : [];
    return {
      overallScore: typeof data.overallScore === 'number' ? data.overallScore : typeof data.score === 'number' ? data.score : 0,
      areas: areasRaw.map(mapArea).filter((area): area is AuditV2Area => Boolean(area)),
      recommendations: toArray(data.recommendations),
      sources: mapSources((data as { sources?: unknown }).sources ?? []),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
