export type PolicyStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export type PolicyType =
  | 'privacy_policy'
  | 'cookie_policy'
  | 'data_processing_agreement'
  | 'data_retention_policy'
  | 'information_security_policy'
  | 'internal_guideline'
  | 'other';

export interface PolicyItem {
  id: string;
  name: string;
  type: PolicyType;
  status: PolicyStatus;
  owner: string;
  lastUpdated: string;
  createdAt: string;
  version?: string | number;
  language?: string;
  tags?: string[];
  summary?: string;
  content?: string;
}

export const policyStatusLabels: Record<PolicyStatus, string> = {
  draft: 'Draft',
  in_review: 'In review',
  approved: 'Approved',
  published: 'Published',
  archived: 'Archived',
};

export const policyTypeLabels: Record<PolicyType, string> = {
  privacy_policy: 'Privacy Policy',
  cookie_policy: 'Cookie Policy',
  data_processing_agreement: 'Data Processing Agreement',
  data_retention_policy: 'Data Retention Policy',
  information_security_policy: 'Information Security Policy',
  internal_guideline: 'Internal Guideline',
  other: 'Other',
};
