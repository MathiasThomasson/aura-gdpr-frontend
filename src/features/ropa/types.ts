export type ProcessingCategory =
  | 'customer_data'
  | 'employee_data'
  | 'marketing'
  | 'website_analytics'
  | 'it_security'
  | 'other';

export interface RopaItem {
  id: string;
  name: string;
  systemName: string;
  owner: string;
  purpose: string;
  legalBasis: string;
  processingCategory: ProcessingCategory;
  dataSubjects: string;
  dataCategories: string;
  recipients: string;
  transfersOutsideEU: string;
  retentionPeriod: string;
  securityMeasures: string;
  createdAt: string;
  lastUpdated: string;
}
