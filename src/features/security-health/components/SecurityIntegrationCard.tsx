import React from 'react';
import { SecurityIntegration } from '../types';

type Props = {
  integration: SecurityIntegration;
};

const styles: Record<SecurityIntegration['status'], string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-amber-50 text-amber-700 border-amber-200',
  not_configured: 'bg-slate-100 text-slate-700 border-slate-200',
};

const labels: Record<SecurityIntegration['status'], string> = {
  active: 'Active',
  inactive: 'Inactive',
  not_configured: 'Not configured',
};

const SecurityIntegrationCard: React.FC<Props> = ({ integration }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">{integration.name}</p>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[integration.status]}`}>
          {labels[integration.status]}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-700">{integration.description}</p>
    </div>
  );
};

export default SecurityIntegrationCard;
