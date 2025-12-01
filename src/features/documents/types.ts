export type DocumentStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export type DocumentType =
  | 'privacy_policy'
  | 'cookie_policy'
  | 'data_processing_agreement'
  | 'security_policy'
  | 'internal_guideline'
  | 'other';

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  owner: string;
  lastUpdated: string;
  createdAt: string;
  tags?: string[];
  description?: string;
}

export const documentStatusLabels: Record<DocumentStatus, string> = {
  draft: 'Draft',
  in_review: 'In review',
  approved: 'Approved',
  published: 'Published',
  archived: 'Archived',
};

export const documentTypeLabels: Record<DocumentType, string> = {
  privacy_policy: 'Privacy Policy',
  cookie_policy: 'Cookie Policy',
  data_processing_agreement: 'Data Processing Agreement',
  security_policy: 'Information Security Policy',
  internal_guideline: 'Internal Guideline',
  other: 'Other',
};
