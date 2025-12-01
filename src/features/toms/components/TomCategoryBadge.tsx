import React from 'react';
import { TomCategory } from '../types';

const labels: Record<TomCategory, string> = {
  access_control: 'Access control',
  encryption: 'Encryption',
  logging_monitoring: 'Logging & monitoring',
  network_security: 'Network security',
  backup_recovery: 'Backup & recovery',
  organizational_policies: 'Organizational policies',
  data_minimization: 'Data minimization',
  vendor_management: 'Vendor management',
  other: 'Other',
};

const styles: Record<TomCategory, string> = {
  access_control: 'bg-slate-100 text-slate-700 border-slate-200',
  encryption: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  logging_monitoring: 'bg-sky-50 text-sky-700 border-sky-200',
  network_security: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  backup_recovery: 'bg-amber-50 text-amber-700 border-amber-200',
  organizational_policies: 'bg-purple-50 text-purple-700 border-purple-200',
  data_minimization: 'bg-teal-50 text-teal-700 border-teal-200',
  vendor_management: 'bg-rose-50 text-rose-700 border-rose-200',
  other: 'bg-slate-100 text-slate-700 border-slate-200',
};

type Props = {
  category: TomCategory;
};

const TomCategoryBadge: React.FC<Props> = ({ category }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[category]}`}>
    {labels[category]}
  </span>
);

export default TomCategoryBadge;
