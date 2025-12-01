import React from 'react';
import { NotificationType } from '../types';

const labels: Record<NotificationType, string> = {
  dsr_deadline: 'DSR',
  policy_expiring: 'Policy',
  dpia_required: 'DPIA',
  incident_alert: 'Incident',
  ai_recommendation: 'AI',
  system_health: 'System',
};

const styles: Record<NotificationType, string> = {
  dsr_deadline: 'bg-amber-50 text-amber-700 border-amber-200',
  policy_expiring: 'bg-sky-50 text-sky-700 border-sky-200',
  dpia_required: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  incident_alert: 'bg-rose-50 text-rose-700 border-rose-200',
  ai_recommendation: 'bg-purple-50 text-purple-700 border-purple-200',
  system_health: 'bg-slate-100 text-slate-700 border-slate-200',
};

type Props = {
  type: NotificationType;
};

const NotificationTypeBadge: React.FC<Props> = ({ type }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
};

export default NotificationTypeBadge;
