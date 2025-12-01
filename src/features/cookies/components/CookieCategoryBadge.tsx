import React from 'react';
import { CookieCategory } from '../types';

const styles: Record<CookieCategory, string> = {
  necessary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  preferences: 'bg-sky-50 text-sky-700 border-sky-200',
  analytics: 'bg-amber-50 text-amber-700 border-amber-200',
  marketing: 'bg-rose-50 text-rose-700 border-rose-200',
  unclassified: 'bg-slate-100 text-slate-700 border-slate-200',
};

const labels: Record<CookieCategory, string> = {
  necessary: 'Necessary',
  preferences: 'Preferences',
  analytics: 'Analytics',
  marketing: 'Marketing',
  unclassified: 'Unclassified',
};

type Props = {
  category: CookieCategory;
};

const CookieCategoryBadge: React.FC<Props> = ({ category }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[category]}`}>
    {labels[category]}
  </span>
);

export default CookieCategoryBadge;
