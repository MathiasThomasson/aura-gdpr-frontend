import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/lib/apiClient';

export type RiskLevel = 'low' | 'medium' | 'high';

export type RiskItem = {
  id: string;
  type: 'dpia' | 'incident' | 'project';
  title: string;
  risk: RiskLevel;
  source?: string;
  link?: string;
};

type DpiaResponse = { items: Array<{ id: string; title: string; overall_risk: RiskLevel }> };
type IncidentResponse = { items: Array<{ id: string; title?: string; severity?: string; impact?: number }> };
type ProjectResponse = { items: Array<{ id: string; name: string; risk_level?: RiskLevel }> };

const normalizeRisk = (value: string | number | undefined): RiskLevel => {
  if (typeof value === 'number') {
    if (value >= 16) return 'high';
    if (value >= 9) return 'medium';
    return 'low';
  }
  const lower = (value || '').toString().toLowerCase();
  if (lower === 'high' || lower === 'critical') return 'high';
  if (lower === 'medium') return 'medium';
  return 'low';
};

export const useRiskMatrix = () => {
  const [data, setData] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dpiaRes, incidentRes, projectRes] = await Promise.all([
        api.get<DpiaResponse>('/dpia'),
        api.get<IncidentResponse>('/incidents'),
        api.get<ProjectResponse>('/projects'),
      ]);

      const dpiaItems: RiskItem[] =
        dpiaRes.data.items?.map((d) => ({
          id: d.id,
          type: 'dpia' as const,
          title: d.title,
          risk: normalizeRisk(d.overall_risk),
          source: `DPIA (${d.overall_risk})`,
          link: `/app/dpia/${d.id}`,
        })) ?? [];

      const incidentItems: RiskItem[] =
        incidentRes.data.items?.map((i) => {
          const sev = (i.severity || '').toString().toLowerCase();
          const score = sev === 'critical' || sev === 'high' ? 16 : sev === 'medium' ? 9 : 4;
          const risk = normalizeRisk(score);
          return {
            id: i.id,
            type: 'incident' as const,
            title: i.title || `Incident ${i.id}`,
            risk,
            source: `Incident (${i.severity ?? 'unknown'})`,
            link: `/app/incidents`,
          };
        }) ?? [];

      const projectItems: RiskItem[] =
        projectRes.data.items?.map((p) => ({
          id: p.id,
          type: 'project' as const,
          title: p.name,
          risk: normalizeRisk(p.risk_level),
          source: `Project (${p.risk_level ?? 'unknown'})`,
          link: `/app/projects`,
        })) ?? [];

      setData([...dpiaItems, ...incidentItems, ...projectItems]);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load risks');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc[item.risk].push(item);
        return acc;
      },
      { low: [] as RiskItem[], medium: [] as RiskItem[], high: [] as RiskItem[] }
    );
  }, [data]);

  return { data, grouped, loading, error, reload: load };
};

export default useRiskMatrix;
