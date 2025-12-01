import React from 'react';
import { IncidentSeverity, IncidentStatus } from '../types';

type Props = {
  search: string;
  severity: IncidentSeverity | 'all';
  status: IncidentStatus | 'all';
  onSearch: (value: string) => void;
  onSeverityChange: (value: IncidentSeverity | 'all') => void;
  onStatusChange: (value: IncidentStatus | 'all') => void;
};

const IncidentFiltersBar: React.FC<Props> = ({ search, severity, status, onSearch, onSeverityChange, onStatusChange }) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search incidents by title or system..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={severity}
          onChange={(e) => onSeverityChange(e.target.value as IncidentSeverity | 'all')}
        >
          <option value="all">All severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as IncidentStatus | 'all')}
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="contained">Contained</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>
  );
};

export default IncidentFiltersBar;
