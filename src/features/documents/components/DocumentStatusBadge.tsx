import React from 'react';
import { DocumentStatus, documentStatusLabels } from '../types';

const styles: Record<DocumentStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  in_review: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-sky-50 text-sky-700 border-sky-200',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-slate-50 text-slate-500 border-slate-200',
};

type Props = {
  status: DocumentStatus;
};

const DocumentStatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {documentStatusLabels[status]}
    </span>
  );
};

export default DocumentStatusBadge;
