import React from 'react';
import { SecurityControl } from '../types';

type Props = {
  controls: SecurityControl[];
};

const colors: Record<SecurityControl['level'], string> = {
  good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  poor: 'bg-rose-50 text-rose-700 border-rose-200',
};

const SecurityHeatmap: React.FC<Props> = ({ controls }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        {controls.map((ctrl) => (
          <div key={ctrl.id} className={`rounded-lg border p-3 ${colors[ctrl.level]}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{ctrl.name}</p>
              <span className="text-xs font-semibold uppercase tracking-wide">{ctrl.level}</span>
            </div>
            <p className="text-xs text-slate-700">{ctrl.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityHeatmap;
