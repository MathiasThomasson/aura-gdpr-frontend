import React from 'react';
import { AuditSeverity } from '../types';

const styles: Record<AuditSeverity, string> = {
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
};

type Props = {
  severity: AuditSeverity;
};

const AuditSeverityBadge: React.FC<Props> = ({ severity }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[severity]}`}>
    {severity}
  </span>
);

export default AuditSeverityBadge;
