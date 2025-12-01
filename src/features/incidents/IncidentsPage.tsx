import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import IncidentFiltersBar from './components/IncidentFiltersBar';
import IncidentsTable from './components/IncidentsTable';
import IncidentDetailsDrawer from './components/IncidentDetailsDrawer';
import NewIncidentButton from './components/NewIncidentButton';
import useIncidents from './hooks/useIncidents';
import { IncidentItem, IncidentSeverity, IncidentStatus } from './types';
import useNotifications from '../notifications/hooks/useNotifications';

type SeverityFilter = IncidentSeverity | 'all';
type StatusFilter = IncidentStatus | 'all';

const IncidentsPage: React.FC = () => {
  const { incidents, loading, detailLoading, saving, error, refresh, fetchOne, create, update, patch } = useIncidents();
  const { markAsRead, notifications } = useNotifications();
  const [search, setSearch] = React.useState('');
  const [severity, setSeverity] = React.useState<SeverityFilter>('all');
  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [selected, setSelected] = React.useState<IncidentItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');

  const filtered = React.useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(search.toLowerCase()) ||
        incident.systemName.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severity === 'all' ? true : incident.severity === severity;
      const matchesStatus = status === 'all' ? true : incident.status === status;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [incidents, search, severity, status]);

  const handleSelect = (incident: IncidentItem) => {
    setSelected(incident);
    setMode('edit');
    if (incident.id) {
      fetchOne(incident.id)
        .then((detail) => setSelected(detail))
        .catch(() => {});
    }
  };

  const handleSave = async (incident: IncidentItem, saveMode: 'create' | 'edit') => {
    try {
      if (saveMode === 'create') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...payload } = incident;
        await create(payload);
      } else if (incident.id) {
        await update(incident.id, incident);
      }
      await refresh();
      setSelected(null);
      setMode('view');
    } catch (err) {
      // errors are captured in hook state
    }
  };

  const handleNew = () => {
    const now = new Date().toISOString();
    setSelected({
      id: '',
      title: '',
      systemName: '',
      severity: 'medium',
      status: 'open',
      description: '',
      affectedData: '',
      affectedSubjects: '',
      detectionMethod: '',
      createdAt: now,
      lastUpdated: now,
      timeline: [],
    });
    setMode('create');
  };

  const handleStatusChange = async (incidentId: string, nextStatus: IncidentStatus) => {
    try {
      await patch(incidentId, { status: nextStatus });
      await refresh();
    } catch (err) {
      // errors are captured in hook state
    }
  };

  React.useEffect(() => {
    notifications
      .filter((n) => n.type === 'incident_alert' && !n.read)
      .forEach((n) => markAsRead(n.id));
  }, [notifications, markAsRead]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-20 w-full rounded-lg bg-slate-100" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="flex items-center justify-between gap-3">
            <p>{error}</p>
            <button
              type="button"
              className="text-xs font-semibold text-rose-800 underline"
              onClick={() => refresh()}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">No incidents match the current filters.</p>
          <p className="text-slate-600">Try adjusting filters or create a new incident to get started.</p>
        </div>
      );
    }

    return <IncidentsTable incidents={filtered} onSelect={handleSelect} />;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Incidents</h1>
          <p className="text-sm text-slate-600">Log, investigate and resolve personal data breaches.</p>
        </div>
        <NewIncidentButton onNew={handleNew} />
      </div>

      <IncidentFiltersBar
        search={search}
        severity={severity}
        status={status}
        onSearch={setSearch}
        onSeverityChange={setSeverity}
        onStatusChange={setStatus}
      />

      {renderContent()}

      <IncidentDetailsDrawer
        incident={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => {
          setSelected(null);
          setMode('view');
        }}
        onSave={handleSave}
        isLoading={detailLoading}
        isSaving={saving}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default IncidentsPage;
