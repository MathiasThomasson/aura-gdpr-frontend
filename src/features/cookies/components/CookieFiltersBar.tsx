import React from 'react';
import { CookieCategory, CookieSource } from '../types';

type Props = {
  search: string;
  category: CookieCategory | 'all';
  type: 'first_party' | 'third_party' | 'all';
  source: CookieSource | 'all';
  onSearch: (value: string) => void;
  onCategoryChange: (value: CookieCategory | 'all') => void;
  onTypeChange: (value: 'first_party' | 'third_party' | 'all') => void;
  onSourceChange: (value: CookieSource | 'all') => void;
};

const categories: CookieCategory[] = ['necessary', 'preferences', 'analytics', 'marketing', 'unclassified'];
const sources: CookieSource[] = ['manual', 'scanner', 'imported'];

const CookieFiltersBar: React.FC<Props> = ({
  search,
  category,
  type,
  source,
  onSearch,
  onCategoryChange,
  onTypeChange,
  onSourceChange,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search cookies by name or provider..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as CookieCategory | 'all')}
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={type}
          onChange={(e) => onTypeChange(e.target.value as 'first_party' | 'third_party' | 'all')}
        >
          <option value="all">All types</option>
          <option value="first_party">First-party</option>
          <option value="third_party">Third-party</option>
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={source}
          onChange={(e) => onSourceChange(e.target.value as CookieSource | 'all')}
        >
          <option value="all">All sources</option>
          {sources.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CookieFiltersBar;
