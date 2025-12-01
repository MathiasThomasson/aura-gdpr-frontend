import React from 'react';
import AuditLogFiltersBar from './components/AuditLogFiltersBar';
import AuditLogTable from './components/AuditLogTable';
import AuditLogDetailsDrawer from './components/AuditLogDetailsDrawer';
import useAuditLogMockData from './hooks/useAuditLogMockData';
import { AuditLogItem, AuditResourceType, AuditSeverity } from './types';

type DateRange = '24h' | '7d' | '30d' | 'all';
type ResourceFilter = AuditResourceType | 'all';
type SeverityFilter = AuditSeverity | 'all';

const dateThreshold = (range: DateRange) => {
  const now = Date.now();
  if (range === '24h') return now - 24 * 60 * 60 * 1000;
  if (range === '7d') return now - 7 * 24 * 60 * 60 * 1000;
  if (range === '30d') return now - 30 * 24 * 60 * 60 * 1000;
  return 0;
};

const AuditLogPage: React.FC = () => {
  const { items, isLoading, isError } = useAuditLogMockData();
  const [search, setSearch] = React.useState('');
  const [dateRange, setDateRange] = React.useState<DateRange>('7d');
  const [resource, setResource] = React.useState<ResourceFilter>('all');
  const [severity, setSeverity] = React.useState<SeverityFilter>('all');
  const [selected, setSelected] = React.useState<AuditLogItem | null>(null);

  const filtered = React.useMemo(() => {
    const threshold = dateThreshold(dateRange);
    return items.filter((item) => {
      const ts = new Date(item.timestamp).getTime();
      const matchesDate = threshold === 0 ? true : ts >= threshold;
      const matchesSearch =
        item.action.toLowerCase().includes(search.toLowerCase()) ||
        (item.resourceName || '').toLowerCase().includes(search.toLowerCase()) ||
        item.actor.toLowerCase().includes(search.toLowerCase());
      const matchesResource = resource === 'all' ? true : item.resourceType === resource;
      const matchesSeverity = severity === 'all' ? true : item.severity === severity;
      return matchesDate && matchesSearch && matchesResource && matchesSeverity;
    });
  }, [items, search, dateRange, resource, severity]);

  const handleSelect = (item: AuditLogItem) => {
    setSelected(item);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Audit log</h1>
        <p className="text-sm text-slate-600">See who performed which actions in your tenant, and when.</p>
      </div>

      <AuditLogFiltersBar
        search={search}
        dateRange={dateRange}
        resource={resource}
        severity={severity}
        onSearch={setSearch}
        onDateRangeChange={setDateRange}
        onResourceChange={setResource}
        onSeverityChange={setSeverity}
      />

      <AuditLogTable items={filtered} onSelect={handleSelect} isLoading={isLoading} isError={isError} />

      <AuditLogDetailsDrawer item={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
};

export default AuditLogPage;
