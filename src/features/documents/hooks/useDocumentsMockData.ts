import { useMemo, useState } from 'react';
import { DocumentItem } from '../types';

const mockDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Privacy Policy',
    type: 'privacy_policy',
    status: 'published',
    owner: 'Jane Doe',
    lastUpdated: '2025-11-15T10:00:00Z',
    createdAt: '2025-08-01T08:00:00Z',
    tags: ['policy', 'public'],
    description: 'Published privacy policy covering data collection, usage, and retention.',
  },
  {
    id: 'doc-2',
    name: 'Data Processing Agreement',
    type: 'data_processing_agreement',
    status: 'approved',
    owner: 'Legal Team',
    lastUpdated: '2025-11-20T12:00:00Z',
    createdAt: '2025-09-12T09:30:00Z',
    tags: ['DPA', 'vendors'],
    description: 'Agreement template for vendors handling personal data.',
  },
  {
    id: 'doc-3',
    name: 'Cookie Policy',
    type: 'cookie_policy',
    status: 'in_review',
    owner: 'Marketing',
    lastUpdated: '2025-11-28T14:00:00Z',
    createdAt: '2025-10-03T11:00:00Z',
    tags: ['cookies', 'web'],
    description: 'Draft cookie policy awaiting legal review.',
  },
  {
    id: 'doc-4',
    name: 'Incident Response Plan',
    type: 'security_policy',
    status: 'draft',
    owner: 'Security',
    lastUpdated: '2025-11-29T08:00:00Z',
    createdAt: '2025-11-10T10:00:00Z',
    tags: ['security', 'incident'],
    description: 'Internal guideline for responding to security incidents.',
  },
];

export function useDocumentsMockData() {
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [isLoading] = useState(false);
  const [isError] = useState(false);

  const upsertDocument = (item: DocumentItem) => {
    setDocuments((prev) => {
      const exists = prev.findIndex((d) => d.id === item.id);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = item;
        return next;
      }
      return [item, ...prev];
    });
  };

  const filteredMap = useMemo(() => documents, [documents]);

  return { documents: filteredMap, isLoading, isError, upsertDocument };
}

export default useDocumentsMockData;
