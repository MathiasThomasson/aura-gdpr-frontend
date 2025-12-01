import React from 'react';
import { IncidentStatus } from '../types';

const styles: Record<IncidentStatus, string> = {
  open: 'bg-sky-50 text-sky-700 border-sky-200',
  investigating: 'bg-amber-50 text-amber-700 border-amber-200',
  contained: 'bg-orange-50 text-orange-700 border-orange-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
};

const labels: Record<IncidentStatus, string> = {
  open: 'Open',
  investigating: 'Investigating',
  contained: 'Contained',
  resolved: 'Resolved',
  closed: 'Closed',
};

type Props = {
  status: IncidentStatus;
};

const IncidentStatusBadge: React.FC<Props> = ({ status }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
    {labels[status]}
  </span>
);

export default IncidentStatusBadge;
