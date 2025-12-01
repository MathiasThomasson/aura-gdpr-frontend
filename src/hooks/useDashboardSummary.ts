import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/apiClient';
import { DashboardSummary, RiskLevel } from '@/features/dashboard/types';

type DashboardSummaryResponse = Record<string, any>;

const normalizeRiskLevel = (value: unknown): RiskLevel => {
  const normalized = typeof value === 'string' ? value.toLowerCase() : '';
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') return normalized;
  return 'medium';
};

const normalizeNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const mapSummary = (payload: DashboardSummaryResponse): DashboardSummary => {
  const riskLevelCandidate =
    payload?.overallRiskLevel ??
    payload?.riskLevel ??
    payload?.risk ??
    payload?.overall_risk_level ??
    payload?.risk_level;

  return {
    complianceScore: normalizeNumber(
      payload?.complianceScore ?? payload?.compliance_score ?? payload?.compliance ?? payload?.compliance_score_pct
    ),
    openDsrs: normalizeNumber(
      payload?.openDsrs ?? payload?.open_dsr ?? payload?.open_dsr_count ?? payload?.dsr_open ?? payload?.dsr_count
    ),
    policiesExpiringSoon: normalizeNumber(
      payload?.policiesExpiringSoon ??
        payload?.policies_expiring_soon ??
        payload?.policies_due ??
        payload?.policy_expiring ??
        payload?.policy_count_due
    ),
    ongoingDpiaCount: normalizeNumber(
      payload?.ongoingDpiaCount ?? payload?.dpia_count ?? payload?.ongoing_dpia_count ?? payload?.dpia_open
    ),
    activeIncidents: normalizeNumber(
      payload?.activeIncidents ?? payload?.incident_count ?? payload?.incidents ?? payload?.active_incidents
    ),
    overallRiskLevel: normalizeRiskLevel(riskLevelCandidate),
  };
};

export const useDashboardSummary = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<DashboardSummaryResponse>('/dashboard/summary');
      setData(mapSummary(res.data ?? {}));
    } catch (err: any) {
      setError(err?.message ?? 'Unable to load dashboard');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
};

export default useDashboardSummary;
