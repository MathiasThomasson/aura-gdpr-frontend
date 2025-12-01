import React from 'react';
import { IncidentSeverity } from '../types';

const styles: Record<IncidentSeverity, string> = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  critical: 'bg-rose-600 text-white border-rose-700',
};

const labels: Record<IncidentSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

type Props = {
  severity: IncidentSeverity;
};

const IncidentSeverityBadge: React.FC<Props> = ({ severity }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[severity]}`}>
    {labels[severity]}
  </span>
);

export default IncidentSeverityBadge;
