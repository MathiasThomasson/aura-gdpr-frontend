import React from 'react';
import { PolicyStatus, PolicyType, policyStatusLabels, policyTypeLabels } from '../types';

type Props = {
  search: string;
  status: PolicyStatus | 'all';
  type: PolicyType | 'all';
  onSearch: (value: string) => void;
  onStatusChange: (value: PolicyStatus | 'all') => void;
  onTypeChange: (value: PolicyType | 'all') => void;
};

const PolicyFiltersBar: React.FC<Props> = ({ search, status, type, onSearch, onStatusChange, onTypeChange }) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search policies..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as PolicyStatus | 'all')}
        >
          <option value="all">All statuses</option>
          {(Object.keys(policyStatusLabels) as PolicyStatus[]).map((s) => (
            <option key={s} value={s}>
              {policyStatusLabels[s]}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={type}
          onChange={(e) => onTypeChange(e.target.value as PolicyType | 'all')}
        >
          <option value="all">All types</option>
          {(Object.keys(policyTypeLabels) as PolicyType[]).map((t) => (
            <option key={t} value={t}>
              {policyTypeLabels[t]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PolicyFiltersBar;
