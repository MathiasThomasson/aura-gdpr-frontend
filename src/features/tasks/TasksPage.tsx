import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import TasksFiltersBar from './components/TasksFiltersBar';
import TasksTable from './components/TasksTable';
import TaskDetailsDrawer from './components/TaskDetailsDrawer';
import NewTaskButton from './components/NewTaskButton';
import useTasks from './hooks/useTasks';
import { TaskItem, TaskPriority, TaskResourceType, TaskStatus } from './types';

type PriorityFilter = TaskPriority | 'all';
type StatusFilter = TaskStatus | 'all';
type ResourceFilter = TaskResourceType | 'general' | 'all';
type DueFilter = 'all' | 'overdue' | 'today' | 'week';

const isDueFilterMatch = (dueDate: string, filter: DueFilter) => {
  if (filter === 'all') return true;
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (filter === 'overdue') return diffDays < 0;
  if (filter === 'today') return diffDays === 0;
  if (filter === 'week') return diffDays >= 0 && diffDays <= 7;
  return true;
};

const TasksPage: React.FC = () => {
  const { tasks, loading, detailLoading, saving, error, refresh, fetchOne, create, update, patch } = useTasks();
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [priority, setPriority] = React.useState<PriorityFilter>('all');
  const [resource, setResource] = React.useState<ResourceFilter>('all');
  const [due, setDue] = React.useState<DueFilter>('all');
  const [selected, setSelected] = React.useState<TaskItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');

  const filtered = React.useMemo(
    () =>
      tasks.filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          (task.resourceName || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' ? true : task.status === status;
        const matchesPriority = priority === 'all' ? true : task.priority === priority;
        const matchesResource = resource === 'all' ? true : task.resourceType === resource;
        const matchesDue = isDueFilterMatch(task.dueDate, due);
        return matchesSearch && matchesStatus && matchesPriority && matchesResource && matchesDue;
      }),
    [tasks, search, status, priority, resource, due]
  );

  const handleSelect = (task: TaskItem) => {
    setSelected(task);
    setMode('edit');
    if (task.id) {
      fetchOne(task.id)
        .then((detail) => setSelected(detail))
        .catch(() => {});
    }
  };

  const handleSave = async (task: TaskItem, saveMode: 'create' | 'edit') => {
    try {
      if (saveMode === 'create') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...payload } = task;
        await create(payload);
      } else if (task.id) {
        await update(task.id, task);
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
      description: '',
      status: 'open',
      priority: 'medium',
      dueDate: now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
      assignee: '',
      resourceType: 'general',
      resourceId: '',
      resourceName: '',
    });
    setMode('create');
  };

  const handleStatusChange = async (taskId: string, nextStatus: TaskStatus) => {
    try {
      await patch(taskId, { status: nextStatus });
      await refresh();
    } catch (err) {
      // errors are captured in hook state
    }
  };

  const handlePriorityChange = async (taskId: string, nextPriority: TaskPriority) => {
    try {
      await patch(taskId, { priority: nextPriority });
      await refresh();
    } catch (err) {
      // errors are captured in hook state
    }
  };

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
          <p className="font-semibold text-slate-900">No tasks match the current filters.</p>
          <p className="text-slate-600">Adjust filters or create a new task.</p>
        </div>
      );
    }

    return <TasksTable tasks={filtered} onSelect={handleSelect} />;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-600">Track and manage your compliance tasks.</p>
        </div>
        <NewTaskButton onNew={handleNew} />
      </div>

      <TasksFiltersBar
        search={search}
        status={status}
        priority={priority}
        resource={resource}
        due={due}
        onSearch={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onResourceChange={setResource}
        onDueChange={setDue}
      />

      {renderContent()}

      <TaskDetailsDrawer
        task={selected}
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
        onPriorityChange={handlePriorityChange}
      />
    </div>
  );
};

export default TasksPage;
