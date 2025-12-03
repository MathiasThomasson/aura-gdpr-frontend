import React from 'react';
import { Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import useRopa from './hooks/useRopa';
import { RopaItem } from './types';

type FormState = {
  id?: string;
  processName: string;
  purpose: string;
  dataCategories: string;
  dataSubjects: string;
  recipients: string;
  transfersOutsideEu: boolean;
  retentionPeriod: string;
  legalBasis: string;
  createdAt?: string;
};

const createEmptyForm = (): FormState => ({
  processName: '',
  purpose: '',
  dataCategories: '',
  dataSubjects: '',
  recipients: '',
  transfersOutsideEu: false,
  retentionPeriod: '',
  legalBasis: '',
});

const mapToForm = (item: RopaItem): FormState => ({
  id: item.id,
  processName: item.name,
  purpose: item.purpose,
  dataCategories: item.dataCategories,
  dataSubjects: item.dataSubjects,
  recipients: item.recipients,
  transfersOutsideEu: (item.transfersOutsideEU ?? '').toString().toLowerCase() === 'true',
  retentionPeriod: item.retentionPeriod,
  legalBasis: item.legalBasis,
  createdAt: item.createdAt,
});

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const RopaPage: React.FC = () => {
  const { records, loading, saving, error, refresh, create, update, remove } = useRopa();
  const [form, setForm] = React.useState<FormState>(createEmptyForm());
  const [search, setSearch] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(search.toLowerCase()) ||
        record.purpose.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [records, search]);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
  };

  const handleSelect = (item: RopaItem) => {
    setEditingId(item.id);
    setForm(mapToForm(item));
  };

  const buildPayload = (source?: RopaItem): Partial<RopaItem> => ({
    ...source,
    name: form.processName || 'Processing activity',
    systemName: source?.systemName ?? form.processName,
    purpose: form.purpose,
    legalBasis: form.legalBasis,
    processingCategory: source?.processingCategory ?? 'other',
    dataSubjects: form.dataSubjects,
    dataCategories: form.dataCategories,
    recipients: form.recipients,
    transfersOutsideEU: form.transfersOutsideEu ? 'true' : 'false',
    retentionPeriod: form.retentionPeriod,
    securityMeasures: source?.securityMeasures ?? '',
    owner: source?.owner ?? 'Data Protection',
    createdAt: form.createdAt ?? source?.createdAt ?? new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  });

  const handleSave = async () => {
    const source = editingId ? records.find((r) => r.id === editingId) : undefined;
    const payload = buildPayload(source);
    if (editingId) {
      await update(editingId, payload);
    } else {
      await create(payload as Omit<RopaItem, 'id'>);
    }
    await refresh();
    resetForm();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmed = window.confirm('Delete this processing record?');
    if (!confirmed) return;
    await remove(id);
    await refresh();
    if (editingId === id) {
      resetForm();
    }
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
                title="Unable to load ROPA"
                description="We could not fetch processing activities. Retry to try again."
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
                title={records.length === 0 ? 'No ROPA entries yet' : 'No matches for these filters'}
                description={
                  records.length === 0
                    ? 'Start by creating your first processing record.'
                    : 'Adjust your search or add a new record.'
                }
                actionLabel="New processing record"
                onAction={resetForm}
              />
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-slate-100">
        {filtered.map((record) => (
          <tr key={record.id} className="hover:bg-slate-50">
            <td className="p-3">
              <div className="font-semibold text-slate-900">{record.name}</div>
              <p className="text-xs text-slate-500">{record.recipients || 'Not specified'}</p>
            </td>
            <td className="p-3 text-sm text-slate-700">{record.purpose}</td>
            <td className="p-3 text-sm text-slate-700">{record.retentionPeriod || 'Not set'}</td>
            <td className="p-3">
              <Badge className="bg-slate-100 text-slate-800">{record.legalBasis || '—'}</Badge>
            </td>
            <td className="p-3">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSelect(record)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => handleDelete(record.id)}>
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
        title="Record of Processing Activities (ROPA)"
        subtitle="Keep an auditable list of every processing activity and its legal basis."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New record
            </Button>
          </div>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Show accountability by documenting all data processing activities."
        bullets={[
          'Capture purpose, legal basis, and retention for each processing activity.',
          'Track data subjects, categories, recipients, and transfers.',
          'Maintain an export-ready register for audits.',
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Processing activities"
            subtitle="Every processing activity in your tenant."
            actions={
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-48"
              />
            }
          >
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="p-3">Process name</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Retention period</th>
                    <th className="p-3">Legal basis</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                {renderRows()}
              </table>
            </div>
          </Card>
        </div>

        <div>
          <Card
            title={editingId ? 'Edit processing activity' : 'Create processing activity'}
            subtitle="Document purpose, lawful basis, and data flows."
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
                placeholder="Process name"
                value={form.processName}
                onChange={(e) => setForm((prev) => ({ ...prev, processName: e.target.value }))}
              />
              <Textarea
                placeholder="Purpose"
                rows={3}
                value={form.purpose}
                onChange={(e) => setForm((prev) => ({ ...prev, purpose: e.target.value }))}
              />
              <Input
                placeholder="Data categories (comma separated)"
                value={form.dataCategories}
                onChange={(e) => setForm((prev) => ({ ...prev, dataCategories: e.target.value }))}
              />
              <Input
                placeholder="Data subjects (comma separated)"
                value={form.dataSubjects}
                onChange={(e) => setForm((prev) => ({ ...prev, dataSubjects: e.target.value }))}
              />
              <Input
                placeholder="Recipients"
                value={form.recipients}
                onChange={(e) => setForm((prev) => ({ ...prev, recipients: e.target.value }))}
              />
              <Input
                placeholder="Retention period"
                value={form.retentionPeriod}
                onChange={(e) => setForm((prev) => ({ ...prev, retentionPeriod: e.target.value }))}
              />
              <Input
                placeholder="Legal basis"
                value={form.legalBasis}
                onChange={(e) => setForm((prev) => ({ ...prev, legalBasis: e.target.value }))}
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.transfersOutsideEu}
                  onChange={(e) => setForm((prev) => ({ ...prev, transfersOutsideEu: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Transfers outside EU
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>
                  Clear
                </Button>
                {form.createdAt ? (
                  <span className="text-xs text-slate-500">Created {formatDate(form.createdAt)}</span>
                ) : null}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RopaPage;
