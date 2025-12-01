import React from 'react';
import { TomCategory, TomEffectiveness } from '../types';

type Props = {
  search: string;
  category: TomCategory | 'all';
  effectiveness: TomEffectiveness | 'all';
  onSearch: (value: string) => void;
  onCategoryChange: (value: TomCategory | 'all') => void;
  onEffectivenessChange: (value: TomEffectiveness | 'all') => void;
};

const categories: TomCategory[] = [
  'access_control',
  'encryption',
  'logging_monitoring',
  'network_security',
  'backup_recovery',
  'organizational_policies',
  'data_minimization',
  'vendor_management',
  'other',
];

const TomsFiltersBar: React.FC<Props> = ({
  search,
  category,
  effectiveness,
  onSearch,
  onCategoryChange,
  onEffectivenessChange,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search TOMs..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as TomCategory | 'all')}
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace('_', ' ')}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={effectiveness}
          onChange={(e) => onEffectivenessChange(e.target.value as TomEffectiveness | 'all')}
        >
          <option value="all">All effectiveness</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
};

export default TomsFiltersBar;
