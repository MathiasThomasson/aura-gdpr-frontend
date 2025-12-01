import React from 'react';
import { DpiaStatus, DpiaItem } from '../types';

type RiskLevel = 'all' | 'low' | 'medium' | 'high';

type Props = {
  search: string;
  status: DpiaStatus | 'all';
  risk: RiskLevel;
  onSearch: (value: string) => void;
  onStatusChange: (value: DpiaStatus | 'all') => void;
  onRiskChange: (value: RiskLevel) => void;
};

const DpiaFiltersBar: React.FC<Props> = ({ search, status, risk, onSearch, onStatusChange, onRiskChange }) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search DPIAs by name or system..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as DpiaStatus | 'all')}
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="in_review">In review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="archived">Archived</option>
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={risk}
          onChange={(e) => onRiskChange(e.target.value as RiskLevel)}
        >
          <option value="all">All risk levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
};

export default DpiaFiltersBar;
