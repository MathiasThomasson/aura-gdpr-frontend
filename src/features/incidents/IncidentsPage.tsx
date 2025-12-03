import React from 'react';
import { CheckCircle2, Plus, RefreshCw, Save, Trash2, Wand2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import useIncidents from './hooks/useIncidents';
import { IncidentItem, IncidentSeverity, IncidentStatus } from './types';
import useAiIncidentClassifier from '../ai/hooks/useAiIncidentClassifier';

type FormState = {
  id?: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  occurredAt: string;
  resolutionSummary: string;
};

const severityOptions: IncidentSeverity[] = ['low', 'medium', 'high', 'critical'];
const statusOptions: IncidentStatus[] = ['open', 'investigating', 'contained', 'resolved', 'closed'];

const createEmptyForm = (): FormState => ({
  title: '',
  description: '',
  severity: 'medium',
  status: 'open',
  occurredAt: new Date().toISOString(),
  resolutionSummary: '',
});

const mapToForm = (item: IncidentItem): FormState => ({
  id: item.id,
  title: item.title,
  description: item.description,
  severity: item.severity,
  status: item.status,
  occurredAt: item.occurredAt ?? item.createdAt,
  resolutionSummary: item.resolutionSummary ?? '',
});

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const severityBadge = (severity: IncidentSeverity) => {
  switch (severity) {
    case 'critical':
      return 'bg-rose-100 text-rose-700';
    case 'high':
      return 'bg-orange-100 text-orange-700';
    case 'medium':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-emerald-100 text-emerald-700';
  }
};

const IncidentsPage: React.FC = () => {
  const { incidents, loading, saving, error, refresh, create, update, patch, remove } = useIncidents();
  const { classify, result: aiResult, loading: aiLoading, error: aiError } = useAiIncidentClassifier();
  const [form, setForm] = React.useState<FormState>(createEmptyForm());
  const [search, setSearch] = React.useState('');
  const [severityFilter, setSeverityFilter] = React.useState<IncidentSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = React.useState<IncidentStatus | 'all'>('all');
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(search.toLowerCase()) ||
        incident.description.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === 'all' ? true : incident.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' ? true : incident.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [incidents, search, severityFilter, statusFilter]);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
  };

  const handleSelect = (item: IncidentItem) => {
    setEditingId(item.id);
    setForm(mapToForm(item));
  };

  const buildPayload = (source?: IncidentItem): Partial<IncidentItem> => ({
    ...source,
    title: form.title || 'Incident',
    systemName: source?.systemName ?? form.title,
    severity: form.severity,
    status: form.status,
    description: form.description,
    affectedData: source?.affectedData ?? '',
    affectedSubjects: source?.affectedSubjects ?? '',
    detectionMethod: source?.detectionMethod ?? '',
    occurredAt: form.occurredAt,
    resolutionSummary: form.resolutionSummary,
    createdAt: form.occurredAt || source?.createdAt || new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  });

  const handleSave = async () => {
    const source = editingId ? incidents.find((i) => i.id === editingId) : undefined;
    const payload = buildPayload(source);
    if (editingId) {
      await update(editingId, payload);
    } else {
      await create(payload as Omit<IncidentItem, 'id'>);
    }
    await refresh();
    resetForm();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmed = window.confirm('Delete this incident?');
    if (!confirmed) return;
    await remove(id);
    await refresh();
    if (editingId === id) resetForm();
  };

  const handleMarkResolved = async (id: string) => {
    await patch(id, { status: 'resolved' });
    await refresh();
  };

  const handleAiAnalyze = async () => {
    await classify({
      title: form.title,
      description: form.description,
      detectedAt: form.occurredAt,
    });
  };

  const renderRows = () => {
    if (loading) {
      return (
        <tbody>
          {Array.from({ length: 4 }).map((_, idx) => (
            <tr key={idx}>
              <td colSpan={5} className="p-3">
                <Skeleton className="h-10 w-full rounded-md" />
              </td>
            </tr>
          ))}
        </tbody>
      );
    }

    if (error) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className="p-4">
              <EmptyState
                title="Unable to load incidents"
                description="We could not fetch incidents. Retry to try again."
                actionLabel="Retry"
                onAction={refresh}
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
                title={incidents.length === 0 ? 'No incidents yet' : 'No matches'}
                description={
                  incidents.length === 0
                    ? 'Start by logging your first incident.'
                    : 'Adjust filters or add a new incident.'
                }
                actionLabel="New incident"
                onAction={resetForm}
              />
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-slate-100">
        {filtered.map((incident) => (
          <tr key={incident.id} className="hover:bg-slate-50">
            <td className="p-3">
              <div className="font-semibold text-slate-900">{incident.title}</div>
              <p className="text-xs text-slate-500">{incident.description.slice(0, 80)}</p>
            </td>
            <td className="p-3">
              <Badge className={severityBadge(incident.severity)}>{incident.severity}</Badge>
            </td>
            <td className="p-3">
              <Badge className="bg-slate-100 text-slate-800 capitalize">{incident.status}</Badge>
            </td>
            <td className="p-3 text-sm text-slate-600">{formatDate(incident.occurredAt ?? incident.createdAt)}</td>
            <td className="p-3">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSelect(incident)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-emerald-700" onClick={() => handleMarkResolved(incident.id)}>
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Mark resolved
                </Button>
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => handleDelete(incident.id)}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Incidents"
        subtitle="Log and triage personal data breaches with clear ownership and timelines."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Log incident
            </Button>
          </div>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Capture, classify, and close security incidents."
        bullets={[
          'Record incident facts, severity, and containment status.',
          'Mark incidents as resolved when remediation is complete.',
          'Run AI analysis for severity and next steps.',
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Incident list"
            subtitle="All incidents for this tenant."
            actions={
              <div className="flex items-center gap-2">
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as IncidentSeverity | 'all')}
                >
                  <option value="all">All severities</option>
                  {severityOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'all')}
                >
                  <option value="all">All statuses</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
                    <th className="p-3">Title</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Occurred at</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                {renderRows()}
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card
            title={editingId ? 'Edit incident' : 'Log incident'}
            subtitle="Capture severity, status, and timeline details."
            actions={
              editingId ? (
                <Button variant="ghost" className="text-rose-600" size="sm" onClick={() => handleDelete(editingId)}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              ) : null
            }
          >
            <div className="space-y-3">
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Severity</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
                    value={form.severity}
                    onChange={(e) => setForm((prev) => ({ ...prev, severity: e.target.value as IncidentSeverity }))}
                  >
                    {severityOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Status</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as IncidentStatus }))}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Occurred at</label>
                <Input
                  type="datetime-local"
                  value={form.occurredAt ? form.occurredAt.slice(0, 16) : ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, occurredAt: e.target.value }))}
                />
              </div>
              <Textarea
                placeholder="Resolution summary"
                rows={3}
                value={form.resolutionSummary}
                onChange={(e) => setForm((prev) => ({ ...prev, resolutionSummary: e.target.value }))}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>
                  Clear
                </Button>
                {form.occurredAt ? (
                  <span className="text-xs text-slate-500">Occurred {formatDate(form.occurredAt)}</span>
                ) : null}
              </div>
            </div>
          </Card>

          <Card title="Analyze incident with AI" subtitle="Get severity and recommended actions.">
            <Button size="sm" variant="outline" onClick={handleAiAnalyze} disabled={aiLoading}>
              <Wand2 className="mr-2 h-4 w-4" />
              {aiLoading ? 'Analyzing...' : 'Analyze incident'}
            </Button>
            {aiError ? <p className="text-xs text-rose-600">{aiError}</p> : null}
            {aiResult ? (
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
                <div className="flex items-center gap-2">
                  <Badge className={severityBadge(aiResult.severity)}>AI severity: {aiResult.severity}</Badge>
                </div>
                {aiResult.summary ? <p className="text-slate-700">{aiResult.summary}</p> : null}
                <div>
                  <p className="font-semibold">Recommended actions</p>
                  <ul className="list-disc pl-4">
                    {aiResult.recommendedActions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncidentsPage;
