export type AuditAreaKey =
  | 'dsr'
  | 'policies'
  | 'documents'
  | 'dpia'
  | 'ropa'
  | 'incidents'
  | 'security_measures';

export interface AuditAreaResult {
  key: AuditAreaKey;
  name: string;
  score: number;
  status: 'good' | 'needs_attention' | 'critical';
  summary: string;
  recommendationsCount: number;
}

export interface AuditRecommendation {
  id: string;
  area: AuditAreaKey;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  estimatedImpact?: string;
}

export interface AuditRun {
  id: string;
  createdAt: string;
  completedAt: string;
  overallScore: number;
  areas: AuditAreaResult[];
  recommendations: AuditRecommendation[];
}

export interface AiAuditState {
  latestRun: AuditRun | null;
  history: AuditRun[];
  isRunning: boolean;
}
