import React from 'react';
import { AuditAreaResult } from '../types';

type Props = {
  area: AuditAreaResult;
};

const statusStyles: Record<AuditAreaResult['status'], string> = {
  good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  needs_attention: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
};

const AuditAreaCard: React.FC<Props> = ({ area }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{area.name}</p>
          <p className="text-xs text-slate-500">Recommendations: {area.recommendationsCount}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[area.status]}`}>
          {area.status === 'good' ? 'Good' : area.status === 'critical' ? 'Critical' : 'Needs attention'}
        </span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
          <span>Score</span>
          <span>{area.score}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
          <div
            className={`h-2 rounded-full ${
              area.score >= 80 ? 'bg-emerald-500' : area.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${area.score}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-700">{area.summary}</p>
    </div>
  );
};

export default AuditAreaCard;
