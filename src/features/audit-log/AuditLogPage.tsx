import React from 'react';
import { RefreshCw } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuditLogs } from './hooks/useAuditLogs';
import { AuditLogItem } from './types';

type DateRange = '24h' | '7d' | '30d' | 'all';

const dateThreshold = (range: DateRange) => {
  const now = Date.now();
  if (range === '24h') return now - 24 * 60 * 60 * 1000;
  if (range === '7d') return now - 7 * 24 * 60 * 60 * 1000;
  if (range === '30d') return now - 30 * 24 * 60 * 60 * 1000;
  return 0;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AuditLogPage: React.FC = () => {
  const { items, isLoading, isError, errorMessage, refresh } = useAuditLogs();
  const [search, setSearch] = React.useState('');
  const [actionFilter, setActionFilter] = React.useState<string>('all');
  const [dateRange, setDateRange] = React.useState<DateRange>('7d');

  const filtered = React.useMemo(() => {
    const threshold = dateThreshold(dateRange);
    return items.filter((item) => {
      const ts = new Date(item.timestamp).getTime();
      const matchesDate = threshold === 0 ? true : ts >= threshold;
      const matchesSearch =
        item.action.toLowerCase().includes(search.toLowerCase()) ||
        (item.targetType || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.userId || item.actor || '').toLowerCase().includes(search.toLowerCase());
      const matchesAction = actionFilter === 'all' ? true : item.action === actionFilter;
      return matchesDate && matchesSearch && matchesAction;
    });
  }, [items, search, dateRange, actionFilter]);

  const uniqueActions = React.useMemo(() => Array.from(new Set(items.map((i) => i.action))), [items]);

  const renderRows = () => {
    if (isLoading) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <tr key={idx}>
              <td colSpan={5} className="p-3">
                <Skeleton className="h-10 w-full rounded-md" />
              </td>
            </tr>
          ))}
        </tbody>
      );
    }

    if (isError) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className="p-4">
              <EmptyState
                title="Unable to load logs"
                description={errorMessage ?? 'Something went wrong loading audit logs.'}
                actionLabel="Retry"
                onAction={() => refresh()}
              />
            </td>
          </tr>
        </tbody>
      );
    }

    if (filtered.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className="p-4">
              <EmptyState
                title={items.length === 0 ? 'No audit events' : 'No matches'}
                description={
                  items.length === 0
                    ? 'Logs will appear here as users perform actions.'
                    : 'Adjust filters or date range to see more events.'
                }
                actionLabel="Refresh"
                onAction={() => refresh()}
              />
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-slate-100">
        {filtered.map((item: AuditLogItem) => (
          <tr key={item.id} className="hover:bg-slate-50">
            <td className="p-3 text-sm text-slate-700">{formatDateTime(item.timestamp)}</td>
            <td className="p-3 text-sm text-slate-800 font-semibold">{item.action}</td>
            <td className="p-3 text-sm text-slate-700">{item.targetType ?? item.resourceType}</td>
            <td className="p-3 text-sm text-slate-700">{item.targetId ?? item.resourceId ?? '—'}</td>
            <td className="p-3 text-sm text-slate-700">{item.userId ?? item.actor ?? 'system'}</td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Audit trail"
        subtitle="Review every action performed in your tenant across modules."
        actions={
          <Button variant="outline" size="sm" onClick={() => refresh()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Filter and export audit events for compliance."
        bullets={[
          'Search by action, target, or user.',
          'Filter by common date ranges.',
          'Export events for regulator or customer requests.',
        ]}
      />

      <Card
        title="Filters"
        subtitle="Narrow down the audit trail."
        actions={
          <div className="flex items-center gap-2">
            <select
              className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
            <select
              className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">All actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-44"
            />
          </div>
        }
      >
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target type</th>
                <th className="p-3">Target ID</th>
                <th className="p-3">User</th>
              </tr>
            </thead>
            {renderRows()}
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AuditLogPage;
