import React from 'react';
import IncidentFiltersBar from './components/IncidentFiltersBar';
import IncidentsTable from './components/IncidentsTable';
import IncidentDetailsDrawer from './components/IncidentDetailsDrawer';
import NewIncidentButton from './components/NewIncidentButton';
import useIncidentsMockData from './hooks/useIncidentsMockData';
import { IncidentItem, IncidentSeverity, IncidentStatus, IncidentTimelineEvent } from './types';
import useNotifications from '../notifications/hooks/useNotifications';

type SeverityFilter = IncidentSeverity | 'all';
type StatusFilter = IncidentStatus | 'all';

const IncidentsPage: React.FC = () => {
  const { incidents, setIncidents, isLoading, isError } = useIncidentsMockData();
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
    setMode('view');
  };

  const handleSave = (incident: IncidentItem, saveMode: 'create' | 'edit') => {
    setIncidents((prev) => {
      if (saveMode === 'edit') {
        return prev.map((i) => (i.id === incident.id ? { ...incident, lastUpdated: new Date().toISOString() } : i));
      }
      return [
        {
          ...incident,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          timeline: [
            {
              id: `event-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actor: 'System',
              action: 'Incident created',
            } as IncidentTimelineEvent,
            ...incident.timeline,
          ],
        },
        ...prev,
      ];
    });
    setSelected(null);
    setMode('view');
  };

  const handleNew = () => {
    const now = new Date().toISOString();
    setSelected({
      id: `inc-${Date.now()}`,
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

  React.useEffect(() => {
    // Mark any mock incident alerts as read when visiting incidents page
    notifications
      .filter((n) => n.type === 'incident_alert' && !n.read)
      .forEach((n) => markAsRead(n.id));
  }, [notifications, markAsRead]);

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

      <IncidentsTable incidents={filtered} onSelect={handleSelect} isLoading={isLoading} isError={isError} />

      <IncidentDetailsDrawer
        incident={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => setSelected(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default IncidentsPage;
