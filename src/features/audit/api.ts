import api from '@/lib/apiClient';

export type AuditSummary = {
  complianceScore: number;
  openDsrs: number;
  overdueDsrs: number;
  missingDpia: number;
  missingRopa: number;
  openIncidents: number;
  policyCoverage: number;
};

const pickNumber = (value: unknown, fallback = 0): number => (typeof value === 'number' ? value : fallback);

export async function getAuditSummary(): Promise<AuditSummary> {
  const res = await api.get('/api/audit/summary');
  const payload = res.data ?? {};
  return {
    complianceScore: pickNumber(payload.compliance_score ?? payload.complianceScore, 0),
    openDsrs: pickNumber(payload.open_dsrs ?? payload.openDsrs, 0),
    overdueDsrs: pickNumber(payload.overdue_dsrs ?? payload.overdueDsrs, 0),
    missingDpia: pickNumber(payload.missing_dpia ?? payload.missingDpia, 0),
    missingRopa: pickNumber(payload.missing_ropa ?? payload.missingRopa, 0),
    openIncidents: pickNumber(payload.open_incidents ?? payload.openIncidents, 0),
    policyCoverage: pickNumber(payload.policy_coverage ?? payload.policyCoverage, 0),
  };
}
