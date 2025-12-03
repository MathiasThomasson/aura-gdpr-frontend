import React from 'react';
import { Plus, RefreshCw, Save, Trash2, Wand2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import useDpia from './hooks/useDpia';
import { DpiaItem, DpiaRiskRating, DpiaStatus } from './types';
import useAiDpiaGenerator from '../ai/hooks/useAiDpiaGenerator';

type RiskLevel = 'low' | 'medium' | 'high';

type FormState = {
  id?: string;
  title: string;
  description: string;
  risksInput: string;
  measuresInput: string;
  riskLevel: RiskLevel;
  status: DpiaStatus;
  createdAt?: string;
};

const statusOptions: DpiaStatus[] = ['draft', 'in_review', 'approved', 'rejected', 'archived'];
const riskLevels: RiskLevel[] = ['low', 'medium', 'high'];

const defaultRisks = `{
  "likelihood": 1,
  "impact": 1,
  "overallScore": 1,
  "level": "low"
}`;

const defaultMeasures = `{
  "controls": [
    "Data minimisation",
    "Encryption at rest",
    "Access reviews"
  ]
}`;

const createEmptyForm = (): FormState => ({
  title: '',
  description: '',
  risksInput: defaultRisks,
  measuresInput: defaultMeasures,
  riskLevel: 'low',
  status: 'draft',
});

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const mapToForm = (item: DpiaItem): FormState => ({
  id: item.id,
  title: item.name,
  description: item.processingDescription ?? '',
  risksInput: JSON.stringify(item.risk ?? {}, null, 2),
  measuresInput: item.mitigationMeasures ? JSON.stringify(item.mitigationMeasures, null, 2) : defaultMeasures,
  riskLevel: item.risk?.level ?? 'low',
  status: item.status,
  createdAt: item.createdAt,
});

const DpiaPage: React.FC = () => {
  const { dpias, loading, saving, error, refresh, create, update, remove } = useDpia();
  const { generate, loading: aiLoading, error: aiError } = useAiDpiaGenerator();
  const [form, setForm] = React.useState<FormState>(createEmptyForm());
  const [formError, setFormError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<DpiaStatus | 'all'>('all');
  const [riskFilter, setRiskFilter] = React.useState<RiskLevel | 'all'>('all');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiContext, setAiContext] = React.useState('');

  const filtered = React.useMemo(() => {
    return dpias.filter((dpia) => {
      const matchesSearch =
        dpia.name.toLowerCase().includes(search.toLowerCase()) ||
        dpia.processingDescription.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : dpia.status === statusFilter;
      const matchesRisk = riskFilter === 'all' ? true : dpia.risk.level === riskFilter;
      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [dpias, search, statusFilter, riskFilter]);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
    setFormError(null);
  };

  const handleSelect = (item: DpiaItem) => {
    setEditingId(item.id);
    setForm(mapToForm(item));
    setFormError(null);
  };

  const buildPayload = (source?: DpiaItem): Partial<DpiaItem> | null => {
    let parsedRisks: any = {};
    let parsedMeasures: any = {};

    try {
      parsedRisks = form.risksInput ? JSON.parse(form.risksInput) : {};
    } catch (err) {
      setFormError('Risks must be valid JSON.');
      return null;
    }

    try {
      parsedMeasures = form.measuresInput ? JSON.parse(form.measuresInput) : {};
    } catch (err) {
      setFormError('Measures must be valid JSON.');
      return null;
    }

    const baseRisk = source?.risk ?? { likelihood: 1, impact: 1, overallScore: 1, level: form.riskLevel };
    const riskLikelihood = (parsedRisks.likelihood ?? baseRisk.likelihood ?? 1) as DpiaRiskRating['likelihood'];
    const riskImpact = (parsedRisks.impact ?? baseRisk.impact ?? 1) as DpiaRiskRating['impact'];

    return {
      ...source,
      name: form.title || 'Untitled DPIA',
      systemName: source?.systemName ?? form.title,
      status: form.status,
      processingDescription: form.description,
      mitigationMeasures: parsedMeasures,
      risk: {
        likelihood: riskLikelihood,
        impact: riskImpact,
        overallScore: parsedRisks.overallScore ?? riskLikelihood * riskImpact,
        level: form.riskLevel,
      },
      purpose: source?.purpose ?? '',
      legalBasis: source?.legalBasis ?? '',
      dataSubjects: source?.dataSubjects ?? '',
      dataCategories: source?.dataCategories ?? '',
      recipients: source?.recipients ?? '',
      transfersOutsideEU: source?.transfersOutsideEU ?? '',
      createdAt: form.createdAt ?? source?.createdAt ?? new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      owner: source?.owner ?? 'Data Protection',
    };
  };

  const handleSave = async () => {
    const source = editingId ? dpias.find((d) => d.id === editingId) : undefined;
    const payload = buildPayload(source);
    if (!payload) return;
    setFormError(null);

    if (editingId) {
      await update(editingId, payload);
    } else {
      await create(payload as Omit<DpiaItem, 'id'>);
    }
    await refresh();
    resetForm();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmDelete = window.confirm('Delete this DPIA? This cannot be undone.');
    if (!confirmDelete) return;
    await remove(id);
    await refresh();
    if (editingId === id) {
      resetForm();
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      setFormError('Add a processing activity before running AI generation.');
      return;
    }
    setFormError(null);
    try {
      const generated = await generate({ processingActivity: aiPrompt, context: aiContext });
      setForm((prev) => ({
        ...prev,
        title: prev.title || aiPrompt,
        description: generated.processingDescription || prev.description,
        measuresInput: generated.mitigationMeasures
          ? JSON.stringify({ details: generated.mitigationMeasures }, null, 2)
          : prev.measuresInput,
      }));
    } catch (err) {
      // errors are handled in hook state
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
                title="Unable to load DPIAs"
                description="We could not load DPIA records. Retry to fetch again."
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
                title={dpias.length === 0 ? 'No DPIAs yet' : 'No results for these filters'}
                description={
                  dpias.length === 0
                    ? 'Start by creating your first DPIA to document high-risk processing.'
                    : 'Update the search or filters, or add a new DPIA.'
                }
                actionLabel="New DPIA"
                onAction={resetForm}
              />
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-slate-100">
        {filtered.map((dpia) => (
          <tr key={dpia.id} className="hover:bg-slate-50">
            <td className="p-3">
              <div className="font-semibold text-slate-900">{dpia.name}</div>
              <p className="text-xs text-slate-500">{dpia.systemName}</p>
            </td>
            <td className="p-3">
              <Badge
                className={
                  dpia.risk.level === 'high'
                    ? 'bg-rose-100 text-rose-700'
                    : dpia.risk.level === 'medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }
              >
                {dpia.risk.level}
              </Badge>
            </td>
            <td className="p-3">
              <Badge className="bg-slate-100 text-slate-800 capitalize">{dpia.status.replace('_', ' ')}</Badge>
            </td>
            <td className="p-3 text-sm text-slate-600">{formatDate(dpia.createdAt)}</td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSelect(dpia)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => handleDelete(dpia.id)}>
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
        title="Data Protection Impact Assessments"
        subtitle="Track high-risk processing, document risks and mitigations, and keep your DPIA register audit ready."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New DPIA
            </Button>
          </div>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Maintain a complete DPIA register for regulators and auditors."
        bullets={[
          'Create DPIAs with risk scoring and mitigation plans.',
          'Filter by status or risk level to prioritise reviews.',
          'Export evidence for audits and stakeholder updates.',
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="DPIA list"
            subtitle="All DPIAs recorded for this tenant."
            actions={
              <div className="flex items-center gap-2">
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as DpiaStatus | 'all')}
                >
                  <option value="all">All statuses</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
                >
                  <option value="all">All risk levels</option>
                  {riskLevels.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Search DPIA"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-40"
                />
              </div>
            }
          >
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Risk</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Created</th>
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
            title={editingId ? 'Edit DPIA' : 'Create DPIA'}
            subtitle="Capture risks, mitigations, and approval status."
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
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Risk level</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
                    value={form.riskLevel}
                    onChange={(e) => setForm((prev) => ({ ...prev, riskLevel: e.target.value as RiskLevel }))}
                  >
                    {riskLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Status</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 capitalize"
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as DpiaStatus }))}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Risks (JSON)</label>
                <Textarea
                  value={form.risksInput}
                  onChange={(e) => setForm((prev) => ({ ...prev, risksInput: e.target.value }))}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Measures (JSON)</label>
                <Textarea
                  value={form.measuresInput}
                  onChange={(e) => setForm((prev) => ({ ...prev, measuresInput: e.target.value }))}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
              {formError ? <p className="text-xs text-rose-600">{formError}</p> : null}
              {aiError ? <p className="text-xs text-rose-600">{aiError}</p> : null}
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          <Card title="AI draft" subtitle="Let AURA draft a DPIA summary for you.">
            <Input
              placeholder="Processing activity"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Textarea
              placeholder="Context or risks to consider (optional)"
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value)}
              rows={3}
            />
            <Button size="sm" variant="outline" onClick={handleAiGenerate} disabled={aiLoading}>
              <Wand2 className="mr-2 h-4 w-4" />
              {aiLoading ? 'Generating...' : 'Generate DPIA with AI'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DpiaPage;
