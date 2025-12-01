import React from 'react';
import { SecurityEvent } from '../types';

type Props = {
  events: SecurityEvent[];
};

const severityStyles: Record<SecurityEvent['severity'], string> = {
  info: 'bg-slate-100 text-slate-700 border-slate-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
};

const formatDateTime = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const SecurityEventsList: React.FC<Props> = ({ events }) => {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent security events.</p>;
  }
  return (
    <div className="space-y-3">
      {events.map((evt) => (
        <div key={evt.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${severityStyles[evt.severity]}`}>
              {evt.severity}
            </span>
            <span className="text-xs text-slate-500">{formatDateTime(evt.timestamp)}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900">{evt.event}</p>
          <p className="text-xs text-slate-600">Source: {evt.source}</p>
        </div>
      ))}
    </div>
  );
};

export default SecurityEventsList;
