import React from 'react';
import { Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import useTemplates from './hooks/useTemplates';
import { TemplateItem } from './types';

type FormState = {
  id?: string;
  templateName: string;
  category: string;
  content: string;
  updatedAt?: string;
};

const createEmptyForm = (): FormState => ({
  templateName: '',
  category: '',
  content: '',
});

const mapToForm = (item: TemplateItem): FormState => ({
  id: item.id,
  templateName: item.templateName,
  category: item.category,
  content: item.content,
  updatedAt: item.updatedAt,
});

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TemplatesPage: React.FC = () => {
  const { templates, loading, saving, error, refresh, create, update, remove } = useTemplates();
  const [form, setForm] = React.useState<FormState>(createEmptyForm());
  const [search, setSearch] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return templates.filter((tpl) => {
      const matchesSearch =
        tpl.templateName.toLowerCase().includes(search.toLowerCase()) ||
        tpl.category.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [templates, search]);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
  };

  const handleSelect = (item: TemplateItem) => {
    setEditingId(item.id);
    setForm(mapToForm(item));
  };

  const buildPayload = (source?: TemplateItem): Partial<TemplateItem> => ({
    ...source,
    templateName: form.templateName || 'Template',
    category: form.category,
    content: form.content,
    createdAt: source?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = async () => {
    const source = editingId ? templates.find((t) => t.id === editingId) : undefined;
    const payload = buildPayload(source);
    if (editingId) {
      await update(editingId, payload);
    } else {
      await create(payload as Omit<TemplateItem, 'id'>);
    }
    await refresh();
    resetForm();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmed = window.confirm('Delete this template?');
    if (!confirmed) return;
    await remove(id);
    await refresh();
    if (editingId === id) resetForm();
  };

  const renderRows = () => {
    if (loading) {
      return (
        <tbody>
          {Array.from({ length: 4 }).map((_, idx) => (
            <tr key={idx}>
              <td colSpan={4} className="p-3">
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
            <td colSpan={4} className="p-4">
              <EmptyState
                title="Unable to load templates"
                description="We could not fetch templates. Retry to try again."
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
            <td colSpan={4} className="p-4">
              <EmptyState
                title={templates.length === 0 ? 'No templates yet' : 'No matches'}
                description={
                  templates.length === 0
                    ? 'Start by creating your first template.'
                    : 'Adjust filters or add a new template.'
                }
                actionLabel="New template"
                onAction={resetForm}
              />
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-slate-100">
        {filtered.map((tpl) => (
          <tr key={tpl.id} className="hover:bg-slate-50">
            <td className="p-3">
              <div className="font-semibold text-slate-900">{tpl.templateName}</div>
              <p className="text-xs text-slate-500">{tpl.category}</p>
            </td>
            <td className="p-3 text-sm text-slate-700">{tpl.category}</td>
            <td className="p-3 text-sm text-slate-700">{formatDate(tpl.updatedAt)}</td>
            <td className="p-3">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSelect(tpl)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => handleDelete(tpl.id)}>
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
        title="Templates"
        subtitle="Manage reusable document and response templates."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New template
            </Button>
          </div>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Create templates for recurring policies, DPIAs, DSR replies, and more."
        bullets={[
          'Store standard text your team can reuse.',
          'Organize by category for faster search.',
          'Keep templates updated with the latest approved content.',
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Template list"
            subtitle="All saved templates."
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
                    <th className="p-3">Template name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Updated</th>
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
            title={editingId ? 'Edit template' : 'Create template'}
            subtitle="Name, category, and content are required."
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
                placeholder="Template name"
                value={form.templateName}
                onChange={(e) => setForm((prev) => ({ ...prev, templateName: e.target.value }))}
              />
              <Input
                placeholder="Category (e.g. DPIA, DSR, Policy)"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              />
              <Textarea
                placeholder="Template content"
                rows={8}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
