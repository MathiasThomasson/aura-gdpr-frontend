import React from 'react';
import { UsageSummaryData } from '../types';

type Props = {
  usage: UsageSummaryData;
};

const UsageSummary: React.FC<Props> = ({ usage }) => {
  const percent = (value: number, max?: number) => {
    if (!max || max === 0) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  };

  const aiPercent = percent(usage.aiCallsThisMonth, usage.maxAiCallsPerMonth);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Usage this month</p>
          <h2 className="text-lg font-semibold text-slate-900">Usage overview</h2>
        </div>
      </div>
      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Data subject requests</span>
          <span className="font-semibold text-slate-900">{usage.dsrCountThisMonth}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Documents</span>
          <span className="font-semibold text-slate-900">{usage.documentsCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Policies</span>
          <span className="font-semibold text-slate-900">{usage.policiesCount}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>AI calls</span>
            <span className="font-semibold text-slate-900">
              {usage.aiCallsThisMonth}
              {usage.maxAiCallsPerMonth ? ` / ${usage.maxAiCallsPerMonth}` : ''}
            </span>
          </div>
          {usage.maxAiCallsPerMonth && (
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-sky-500" style={{ width: `${aiPercent}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsageSummary;
