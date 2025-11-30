export type RiskLevel = 'low' | 'medium' | 'high';

export type DashboardSummary = {
  complianceScore: number;
  openDsrs: number;
  policiesExpiringSoon: number;
  ongoingDpiaCount: number;
  activeIncidents: number;
  overallRiskLevel: RiskLevel;
};

export type DeadlineItem = {
  id: string;
  type: 'DSR' | 'Policy' | 'DPIA';
  title: string;
  dueDate: string;
  status: 'open' | 'in_progress' | 'done';
};

export type ActivityItem = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resourceType: string;
  resourceName: string;
};

export type AiInsight = {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
};

export type RiskOverview = {
  overallRiskLevel: RiskLevel;
  highRiskSystems: string[];
  openIncidents: number;
  dpiaRequiredCount: number;
};
