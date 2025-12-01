import React from 'react';

type Props = {
  overallScore: number;
  lastRunAt?: string;
};

const tone = (score: number) => {
  if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 60) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
};

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AuditSummaryCard: React.FC<Props> = ({ overallScore, lastRunAt }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">Overall GDPR audit score</p>
      <div className="mt-2 flex items-end gap-3">
        <p className="text-4xl font-semibold text-slate-900">{overallScore}</p>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone(overallScore)}`}>
          {overallScore >= 80 ? 'Good' : overallScore >= 60 ? 'Needs attention' : 'Critical'}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">Latest run: {formatDateTime(lastRunAt)}</p>
    </div>
  );
};

export default AuditSummaryCard;
