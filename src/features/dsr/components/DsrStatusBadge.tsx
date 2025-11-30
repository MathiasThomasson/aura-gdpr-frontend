import React from 'react';
import { DataSubjectRequestStatus } from '../types';

const statusStyles: Record<
  DataSubjectRequestStatus,
  { label: string; classes: string }
> = {
  received: { label: 'Received', classes: 'bg-slate-100 text-slate-800 border-slate-200' },
  identity_required: { label: 'Identity required', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  in_progress: { label: 'In progress', classes: 'bg-sky-50 text-sky-700 border-sky-200' },
  waiting_for_information: { label: 'Waiting for information', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Completed', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', classes: 'bg-rose-50 text-rose-700 border-rose-200' },
};

type DsrStatusBadgeProps = {
  status: DataSubjectRequestStatus;
};

const DsrStatusBadge: React.FC<DsrStatusBadgeProps> = ({ status }) => {
  const style = statusStyles[status] ?? statusStyles.received;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${style.classes}`}
    >
      {style.label}
    </span>
  );
};

export default DsrStatusBadge;
