import React from 'react';
import TasksFiltersBar from './components/TasksFiltersBar';
import TasksTable from './components/TasksTable';
import TaskDetailsDrawer from './components/TaskDetailsDrawer';
import NewTaskButton from './components/NewTaskButton';
import useTasksMockData from './hooks/useTasksMockData';
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
  const { tasks, setTasks, isLoading, isError } = useTasksMockData();
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
    setMode('view');
  };

  const handleSave = (task: TaskItem, saveMode: 'create' | 'edit') => {
    const now = new Date().toISOString();
    setTasks((prev) => {
      if (saveMode === 'edit') {
        return prev.map((t) => (t.id === task.id ? { ...task, updatedAt: now } : t));
      }
      return [
        {
          ...task,
          createdAt: now,
          updatedAt: now,
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
      id: `task-${Date.now()}`,
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

      <TasksTable tasks={filtered} onSelect={handleSelect} isLoading={isLoading} isError={isError} />

      <TaskDetailsDrawer
        task={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => setSelected(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default TasksPage;
