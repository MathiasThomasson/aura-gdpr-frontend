import React from 'react';
import { DpiaStatus } from '../types';

const styles: Record<DpiaStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  in_review: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  archived: 'bg-slate-50 text-slate-500 border-slate-200',
};

const labels: Record<DpiaStatus, string> = {
  draft: 'Draft',
  in_review: 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
  archived: 'Archived',
};

type Props = {
  status: DpiaStatus;
};

const DpiaStatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default DpiaStatusBadge;
