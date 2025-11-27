import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, RefreshCcw, X, Calendar, Users, ShieldAlert } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import useTasks, { Task, TaskPriority, TaskStatus } from '@/hooks/useTasks';
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/apiClient';

type DrawerMode = 'create' | 'edit';

type TaskDraft = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  assignee?: string;
};

const defaultDraft: TaskDraft = {
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
  due_date: '',
  assignee: '',
};

const formatDate = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleDateString();
};

const TasksPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);
  const { data: tasks, loading, error, reload } = useTasks(statusFilter);
  const { toast } = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [draft, setDraft] = useState<TaskDraft>(defaultDraft);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setDrawerMode('create');
    setActiveTask(null);
    setDraft(defaultDraft);
    setDrawerOpen(true);
  };

  const openEdit = (task: Task) => {
    setDrawerMode('edit');
    setActiveTask(task);
    setDraft({
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      priority: task.priority ?? 'medium',
      due_date: task.due_date ?? '',
      assignee: task.assignee ?? '',
    });
    setDrawerOpen(true);
  };

  const saveTask = async () => {
    setSaving(true);
    try {
      if (drawerMode === 'create') {
        await api.post('/tasks', draft);
      } else if (activeTask) {
        await api.patch(`/tasks/${activeTask.id}`, draft);
      }
      toast({ title: 'Saved', description: 'Task saved successfully.' });
      setDrawerOpen(false);
      setActiveTask(null);
      setDraft(defaultDraft);
      reload();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: err?.message ?? 'Could not save the task.',
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredTasks = useMemo(() => tasks, [tasks]);

  const renderRows = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, idx) => (
        <tr key={idx} className="border-b border-border/50">
          <td className="p-3"><Skeleton className="h-4 w-24" /></td>
          <td className="p-3"><Skeleton className="h-4 w-48" /></td>
          <td className="p-3"><Skeleton className="h-4 w-16" /></td>
          <td className="p-3"><Skeleton className="h-4 w-24" /></td>
          <td className="p-3"><Skeleton className="h-4 w-20" /></td>
        </tr>
      ));
    }

    if (!filteredTasks.length) {
      return (
        <tr>
          <td colSpan={5} className="p-6 text-center text-muted-foreground">
            No tasks yet. Create your first task to get started.
          </td>
        </tr>
      );
    }

    return filteredTasks.map((task) => (
      <tr
        key={task.id}
        className="border-b border-border/50 hover:bg-muted/50 cursor-pointer"
        onClick={() => openEdit(task)}
      >
        <td className="p-3 w-32">
          <TaskStatusBadge status={task.status} />
        </td>
        <td className="p-3">
          <div className="font-medium">{task.title}</div>
          <div className="text-xs text-muted-foreground line-clamp-1">{task.description || 'No description'}</div>
        </td>
        <td className="p-3 text-sm text-muted-foreground">{task.assignee || 'Unassigned'}</td>
        <td className="p-3 text-sm text-muted-foreground">{formatDate(task.due_date)}</td>
        <td className="p-3">
          <Badge variant="secondary" className="text-[11px] capitalize">
            {task.priority ?? 'medium'}
          </Badge>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Track GDPR tasks and reminders across your tenant."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreate} className="bg-gradient-to-r from-sky-500 to-purple-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        }
      />

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-destructive">Failed to load tasks: {error}</p>
              <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
            </div>
            <Button size="sm" onClick={reload}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Task list</CardTitle>
              <CardDescription>Click a task to edit.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <select
                  value={statusFilter ?? ''}
                  onChange={(e) => setStatusFilter(e.target.value ? (e.target.value as TaskStatus) : undefined)}
                  className="text-sm bg-background border border-border rounded-md px-2 py-1"
                >
                  <option value="">All</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Task</th>
                  <th className="p-3">Assignee</th>
                  <th className="p-3">Due</th>
                  <th className="p-3">Priority</th>
                </tr>
              </thead>
              <tbody>{renderRows()}</tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-sky-500" />
              Reminder
            </CardTitle>
            <CardDescription>Keep tasks updated to reflect tenant readiness.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Set due dates to avoid overdue risks.
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Assign tasks to owners for accountability.
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Use filters to focus on blocked or high-priority work.
            </div>
          </CardContent>
        </Card>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-40">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  {drawerMode === 'create' ? 'New Task' : 'Edit Task'}
                </p>
                <h3 className="text-xl font-semibold">{drawerMode === 'create' ? 'Create task' : activeTask?.title}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="Describe the task"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  className="w-full min-h-[100px] rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="What needs to be done?"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as TaskStatus }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select
                    value={draft.priority}
                    onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as TaskPriority }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Due date</Label>
                  <Input
                    type="date"
                    value={draft.due_date ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, due_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Input
                    placeholder="Assignee email or name"
                    value={draft.assignee ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, assignee: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-border px-4 py-3 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveTask} disabled={saving || !draft.title}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
