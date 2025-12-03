import React from 'react';
import { CheckCircle2, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import useTasks from './hooks/useTasks';
import { TaskItem, TaskResourceType, TaskStatus } from './types';

type FormState = {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  resourceType: TaskResourceType;
  resourceId: string;
  assignee: string;
};

const statusOptions: TaskStatus[] = ['open', 'in_progress', 'blocked', 'completed', 'cancelled'];
const resourceOptions: TaskResourceType[] = ['dsr', 'policy', 'document', 'dpia', 'ropa', 'incident', 'toms', 'general'];

const createEmptyForm = (): FormState => ({
  title: '',
  description: '',
  status: 'open',
  dueDate: '',
  resourceType: 'general',
  resourceId: '',
  assignee: '',
});

const mapToForm = (item: TaskItem): FormState => ({
  id: item.id,
  title: item.title,
  description: item.description,
  status: item.status,
  dueDate: item.dueDate,
  resourceType: item.resourceType,
  resourceId: item.resourceId ?? '',
  assignee: item.assignee,
});

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TasksPage: React.FC = () => {
  const { tasks, loading, saving, error, refresh, create, update, patch, remove } = useTasks();
  const [form, setForm] = React.useState<FormState>(createEmptyForm());
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | 'all'>('all');
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
  };

  const handleSelect = (task: TaskItem) => {
    setEditingId(task.id);
    setForm(mapToForm(task));
  };

  const buildPayload = (source?: TaskItem): Partial<TaskItem> => ({
    ...source,
    title: form.title || 'Task',
    description: form.description,
    status: form.status,
    priority: source?.priority ?? 'medium',
    dueDate: form.dueDate,
    resourceType: form.resourceType,
    resourceId: form.resourceId,
    assignee: form.assignee,
    createdAt: source?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = async () => {
    const source = editingId ? tasks.find((t) => t.id === editingId) : undefined;
    const payload = buildPayload(source);
    if (editingId) {
      await update(editingId, payload);
    } else {
      await create(payload as Omit<TaskItem, 'id'>);
    }
    await refresh();
    resetForm();
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;
    await remove(id);
    await refresh();
    if (editingId === id) resetForm();
  };

  const markComplete = async (id: string) => {
    await patch(id, { status: 'completed' });
    await refresh();
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
                title="Unable to load tasks"
                description="We could not fetch tasks. Retry to try again."
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
                title={tasks.length === 0 ? 'No tasks yet' : 'No matches'}
                description={
                  tasks.length === 0 ? 'Create your first task to keep teams accountable.' : 'Adjust filters or add a new task.'
                }
                actionLabel="New task"
                onAction={resetForm}
              />
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-slate-100">
        {filtered.map((task) => (
          <tr key={task.id} className="hover:bg-slate-50">
            <td className="p-3">
              <div className="font-semibold text-slate-900">{task.title}</div>
              <p className="text-xs text-slate-500">{task.description.slice(0, 80)}</p>
            </td>
            <td className="p-3 text-sm text-slate-700">{formatDate(task.dueDate)}</td>
            <td className="p-3">
              <Badge className="bg-slate-100 text-slate-800 capitalize">{task.status.replace('_', ' ')}</Badge>
            </td>
            <td className="p-3 text-sm text-slate-700">
              {task.resourceType}
              {task.resourceId ? ` · ${task.resourceId}` : ''}
            </td>
            <td className="p-3">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSelect(task)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-emerald-700" onClick={() => markComplete(task.id)}>
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Complete
                </Button>
                <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => handleDelete(task.id)}>
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
        title="Tasks"
        subtitle="Assign and complete tasks across DPIA, ROPA, incidents, and policies."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New task
            </Button>
          </div>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Keep all compliance tasks visible and actionable."
        bullets={[
          'Create tasks tied to DPIA, ROPA, incidents, or documents.',
          'Set due dates and mark tasks complete when finished.',
          'Filter by status to focus on what is due now.',
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Task list"
            subtitle="Every task for your tenant."
            actions={
              <div className="flex items-center gap-2">
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
                >
                  <option value="all">All statuses</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
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
                    <th className="p-3">Due date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Related module</th>
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
            title={editingId ? 'Edit task' : 'Create task'}
            subtitle="Track work items across modules."
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
                  <label className="text-xs font-semibold text-slate-600">Status</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Due date</label>
                  <Input
                    type="date"
                    value={form.dueDate ? form.dueDate.slice(0, 10) : ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Related module</label>
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 capitalize"
                  value={form.resourceType}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, resourceType: e.target.value as TaskResourceType }))
                  }
                >
                  {resourceOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                placeholder="Related ID (optional)"
                value={form.resourceId}
                onChange={(e) => setForm((prev) => ({ ...prev, resourceId: e.target.value }))}
              />
              <Input
                placeholder="Assignee"
                value={form.assignee}
                onChange={(e) => setForm((prev) => ({ ...prev, assignee: e.target.value }))}
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

export default TasksPage;
