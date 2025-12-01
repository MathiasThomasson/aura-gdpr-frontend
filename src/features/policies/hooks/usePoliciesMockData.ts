import { useState } from 'react';
import { PolicyItem } from '../types';

const initialPolicies: PolicyItem[] = [
  {
    id: 'pol-1',
    name: 'Website Privacy Policy',
    type: 'privacy_policy',
    status: 'published',
    owner: 'Legal Team',
    lastUpdated: '2025-11-15T10:00:00Z',
    createdAt: '2025-07-01T08:00:00Z',
    tags: ['public', 'web'],
    summary: 'Public-facing privacy policy covering data collection, usage, and rights.',
  },
  {
    id: 'pol-2',
    name: 'Cookie Policy',
    type: 'cookie_policy',
    status: 'approved',
    owner: 'Marketing',
    lastUpdated: '2025-11-20T12:00:00Z',
    createdAt: '2025-08-12T09:30:00Z',
    tags: ['web', 'consent'],
    summary: 'Cookie disclosure and consent requirements for the corporate website.',
  },
  {
    id: 'pol-3',
    name: 'Data Processing Agreement – Vendors',
    type: 'data_processing_agreement',
    status: 'in_review',
    owner: 'Procurement',
    lastUpdated: '2025-11-28T14:00:00Z',
    createdAt: '2025-09-03T11:00:00Z',
    tags: ['vendors', 'contracts'],
    summary: 'DPA template for vendors handling personal data.',
  },
  {
    id: 'pol-4',
    name: 'Information Security Policy',
    type: 'information_security_policy',
    status: 'draft',
    owner: 'Security',
    lastUpdated: '2025-11-29T08:00:00Z',
    createdAt: '2025-10-10T10:00:00Z',
    tags: ['security', 'internal'],
    summary: 'Internal controls and responsibilities for information security.',
  },
];

export function usePoliciesMockData() {
  const [policies, setPolicies] = useState<PolicyItem[]>(initialPolicies);
  const [isLoading] = useState(false);
  const [isError] = useState(false);

  return { policies, setPolicies, isLoading, isError };
}

export default usePoliciesMockData;
