import React from 'react';
import { Plus, RefreshCw, Save, Trash2, UploadCloud, Wand2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import usePolicies from './hooks/usePolicies';
import { PolicyItem, PolicyStatus, PolicyType, policyStatusLabels, policyTypeLabels } from './types';
import useAiPolicyGenerator from '../ai/hooks/useAiPolicyGenerator';

type FormState = {
  id?: string;
  title: string;
  policyType: PolicyType;
  content: string;
  status: PolicyStatus;
  version?: string | number;
};

const statusOptions: PolicyStatus[] = ['draft', 'in_review', 'approved', 'published', 'archived'];

const createEmptyForm = (): FormState => ({
  title: '',
  policyType: 'privacy_policy',
  content: '',
  status: 'draft',
});

const mapToForm = (item: PolicyItem): FormState => ({
  id: item.id,
  title: item.name,
  policyType: item.type,
  content: item.content ?? '',
  status: item.status,
  version: item.version,
});

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const PoliciesPage: React.FC = () => {
  const { policies, loading, saving, error, refresh, create, update, remove, publish } = usePolicies();
  const { generate, result: aiResult, loading: aiLoading, error: aiError } = useAiPolicyGenerator();
  const [form, setForm] = React.useState<FormState>(createEmptyForm());
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<PolicyStatus | 'all'>('all');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [aiContext, setAiContext] = React.useState('');

  const filtered = React.useMemo(() => {
    return policies.filter((policy) => {
      const matchesSearch =
        policy.name.toLowerCase().includes(search.toLowerCase()) ||
        (policy.summary || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : policy.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [policies, search, statusFilter]);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
  };

  const handleSelect = (item: PolicyItem) => {
    setEditingId(item.id);
    setForm(mapToForm(item));
  };

  const buildPayload = (source?: PolicyItem): Partial<PolicyItem> => ({
    ...source,
    name: form.title || 'Policy',
    type: form.policyType,
    status: form.status,
    content: form.content,
    summary: source?.summary ?? '',
    owner: source?.owner ?? 'Policy Owner',
    createdAt: source?.createdAt ?? new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    version: form.version ?? source?.version,
  });

  const handleSave = async () => {
    const source = editingId ? policies.find((p) => p.id === editingId) : undefined;
    const payload = buildPayload(source);
    if (editingId) {
      await update(editingId, payload);
    } else {
      await create(payload as Omit<PolicyItem, 'id'>);
    }
    await refresh();
    resetForm();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmed = window.confirm('Delete this policy?');
    if (!confirmed) return;
    await remove(id);
    await refresh();
    if (editingId === id) resetForm();
  };

  const handlePublish = async () => {
    if (!editingId) return;
    await publish(editingId);
    await refresh();
  };

  const handleAiGenerate = async () => {
    const result = await generate({ policyType: form.policyType, context: aiContext });
    setForm((prev) => ({
      ...prev,
      title: result.title || prev.title,
      content: result.content || prev.content,
    }));
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
                title="Unable to load policies"
                description="We could not fetch policies. Retry to try again."
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
                title={policies.length === 0 ? 'No policies yet' : 'No matches'}
                description={
                  policies.length === 0
                    ? 'Create your first policy or generate one with AI.'
                    : 'Adjust filters or add a new policy.'
                }
                actionLabel="New policy"
                onAction={resetForm}
              />
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-slate-100">
        {filtered.map((policy) => (
          <tr key={policy.id} className="hover:bg-slate-50">
            <td className="p-3">
              <div className="font-semibold text-slate-900">{policy.name}</div>
              <p className="text-xs text-slate-500">Updated {formatDate(policy.lastUpdated)}</p>
            </td>
            <td className="p-3 text-sm text-slate-700">{policy.version ?? '—'}</td>
            <td className="p-3 text-sm text-slate-700">{policyTypeLabels[policy.type]}</td>
            <td className="p-3">
              <Badge className="bg-slate-100 text-slate-800 capitalize">{policyStatusLabels[policy.status]}</Badge>
            </td>
            <td className="p-3">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSelect(policy)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => handleDelete(policy.id)}>
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
        title="Policies"
        subtitle="Manage policy drafts and publish approved versions."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New policy
            </Button>
          </div>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Draft, review, and publish privacy and security policies."
        bullets={[
          'Create or edit policies with markdown content.',
          'Publish approved policies to lock the version.',
          'Use AI to draft a starting version for faster turnaround.',
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Policy list"
            subtitle="All policies for this tenant."
            actions={
              <div className="flex items-center gap-2">
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PolicyStatus | 'all')}
                >
                  <option value="all">All statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {policyStatusLabels[status]}
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
                    <th className="p-3">Version</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
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
            title={editingId ? 'Edit policy' : 'Create policy'}
            subtitle="Title, type, and content are required."
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
                placeholder="Policy title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Policy type</label>
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
                  value={form.policyType}
                  onChange={(e) => setForm((prev) => ({ ...prev, policyType: e.target.value as PolicyType }))}
                >
                  {Object.entries(policyTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea
                placeholder="Policy content (markdown supported)"
                rows={8}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Status</label>
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 capitalize"
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as PolicyStatus }))}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {policyStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>
                  Clear
                </Button>
                {editingId ? (
                  <Button size="sm" variant="secondary" onClick={handlePublish}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>

          <Card title="Generate policy with AI" subtitle="Draft a starting version from context.">
            <Textarea
              placeholder="Context (industry, obligations, processing details)"
              rows={3}
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value)}
            />
            <Button size="sm" variant="outline" onClick={handleAiGenerate} disabled={aiLoading}>
              <Wand2 className="mr-2 h-4 w-4" />
              {aiLoading ? 'Generating...' : 'Generate with AI'}
            </Button>
            {aiError ? <p className="text-xs text-rose-600">{aiError}</p> : null}
            {aiResult ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
                <p className="font-semibold">AI suggestion</p>
                <p className="mt-1 text-slate-700">{aiResult.summary}</p>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;
