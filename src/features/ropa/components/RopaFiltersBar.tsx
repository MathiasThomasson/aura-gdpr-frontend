import React from 'react';
import { ProcessingCategory } from '../types';

type Props = {
  search: string;
  category: ProcessingCategory | 'all';
  owner: string | 'all';
  owners: string[];
  onSearch: (value: string) => void;
  onCategoryChange: (value: ProcessingCategory | 'all') => void;
  onOwnerChange: (value: string | 'all') => void;
};

const categories: ProcessingCategory[] = [
  'customer_data',
  'employee_data',
  'marketing',
  'website_analytics',
  'it_security',
  'other',
];

const RopaFiltersBar: React.FC<Props> = ({
  search,
  category,
  owner,
  owners,
  onSearch,
  onCategoryChange,
  onOwnerChange,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search processing activities..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as ProcessingCategory | 'all')}
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
          value={owner}
          onChange={(e) => onOwnerChange(e.target.value === 'all' ? 'all' : e.target.value)}
        >
          <option value="all">All owners</option>
          {owners.map((own) => (
            <option key={own} value={own}>
              {own}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RopaFiltersBar;
