export type DpiaStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'archived';

export interface DpiaRiskRating {
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  overallScore: number;
  level: 'low' | 'medium' | 'high';
}

export interface DpiaItem {
  id: string;
  name: string;
  systemName: string;
  owner: string;
  status: DpiaStatus;
  createdAt: string;
  lastUpdated: string;
  purpose: string;
  legalBasis?: string;
  processingDescription: string;
  dataSubjects: string;
  dataCategories: string;
  recipients?: string;
  transfersOutsideEU?: string;
  mitigationMeasures?: string;
  risk: DpiaRiskRating;
}
