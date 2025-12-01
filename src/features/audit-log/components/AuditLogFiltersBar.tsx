import React from 'react';
import { AuditResourceType, AuditSeverity } from '../types';

type DateRange = '24h' | '7d' | '30d' | 'all';

type Props = {
  search: string;
  dateRange: DateRange;
  resource: AuditResourceType | 'all';
  severity: AuditSeverity | 'all';
  onSearch: (value: string) => void;
  onDateRangeChange: (value: DateRange) => void;
  onResourceChange: (value: AuditResourceType | 'all') => void;
  onSeverityChange: (value: AuditSeverity | 'all') => void;
};

const resources: AuditResourceType[] = [
  'dsr',
  'policy',
  'document',
  'dpia',
  'ropa',
  'incident',
  'toms',
  'user',
  'tenant',
  'system',
];

const AuditLogFiltersBar: React.FC<Props> = ({
  search,
  dateRange,
  resource,
  severity,
  onSearch,
  onDateRangeChange,
  onResourceChange,
  onSeverityChange,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search audit log (action, resource, actor)..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="all">All time</option>
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={resource}
          onChange={(e) => onResourceChange(e.target.value as AuditResourceType | 'all')}
        >
          <option value="all">All resources</option>
          {resources.map((res) => (
            <option key={res} value={res}>
              {res}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={severity}
          onChange={(e) => onSeverityChange(e.target.value as AuditSeverity | 'all')}
        >
          <option value="all">All severities</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>
  );
};

export default AuditLogFiltersBar;
