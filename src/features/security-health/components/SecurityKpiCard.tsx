import React from 'react';
import { SecurityKpi } from '../types';

type Props = {
  kpi: SecurityKpi;
};

const SecurityKpiCard: React.FC<Props> = ({ kpi }) => {
  const percent = Math.min(100, Math.round((kpi.value / kpi.max) * 100));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{kpi.label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-slate-900">{kpi.value}</p>
        <p className="text-xs text-slate-500">/ {kpi.max}</p>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-sky-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default SecurityKpiCard;
