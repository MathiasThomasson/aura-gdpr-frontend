import React from 'react';
import { cn } from '@/lib/utils';

type KpiCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  hint?: string;
  accent?: 'blue' | 'amber' | 'emerald' | 'red' | 'slate';
  progress?: number;
};

const accentMap: Record<NonNullable<KpiCardProps['accent']>, string> = {
  blue: 'text-sky-600 bg-sky-50 border-sky-100',
  amber: 'text-amber-600 bg-amber-50 border-amber-100',
  emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  red: 'text-rose-600 bg-rose-50 border-rose-100',
  slate: 'text-slate-600 bg-slate-50 border-slate-100',
};

const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon, hint, accent = 'slate', progress }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{value}</span>
            {hint && <span className="text-xs text-slate-500">{hint}</span>}
          </div>
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg border', accentMap[accent])}>{icon}</div>
      </div>
      {typeof progress === 'number' && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
            <div
              className={cn('h-2 rounded-full bg-sky-500 transition-all')}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
