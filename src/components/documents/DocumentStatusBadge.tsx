import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DocumentStatus } from '@/hooks/useDocuments';

const statusCopy: Record<DocumentStatus, string> = {
  processed: 'Processed',
  processing: 'Processing',
  needs_review: 'Needs review',
  failed: 'Failed',
  unknown: 'Unknown',
};

const statusStyle: Record<DocumentStatus, string> = {
  processed: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200',
  processing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200',
  needs_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200',
  unknown: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
};

const DocumentStatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
  const key = statusStyle[status] ? status : 'unknown';
  return <Badge className={statusStyle[key]}>{statusCopy[key]}</Badge>;
};

export default DocumentStatusBadge;
