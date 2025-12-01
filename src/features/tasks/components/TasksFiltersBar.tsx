import React from 'react';
import { TaskPriority, TaskResourceType, TaskStatus } from '../types';

type DueFilter = 'all' | 'overdue' | 'today' | 'week';

type Props = {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  resource: TaskResourceType | 'general' | 'all';
  due: DueFilter;
  onSearch: (value: string) => void;
  onStatusChange: (value: TaskStatus | 'all') => void;
  onPriorityChange: (value: TaskPriority | 'all') => void;
  onResourceChange: (value: TaskResourceType | 'general' | 'all') => void;
  onDueChange: (value: DueFilter) => void;
};

const statuses: TaskStatus[] = ['open', 'in_progress', 'blocked', 'completed', 'cancelled'];
const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
const resources: TaskResourceType[] = ['dsr', 'policy', 'document', 'dpia', 'ropa', 'incident', 'toms', 'general'];

const TasksFiltersBar: React.FC<Props> = ({
  search,
  status,
  priority,
  resource,
  due,
  onSearch,
  onStatusChange,
  onPriorityChange,
  onResourceChange,
  onDueChange,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search tasks by title or resource..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
        >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
        >
          <option value="all">All priorities</option>
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={resource}
          onChange={(e) => onResourceChange(e.target.value as TaskResourceType | 'general' | 'all')}
        >
          <option value="all">All resources</option>
          {resources.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={due}
          onChange={(e) => onDueChange(e.target.value as DueFilter)}
        >
          <option value="all">All due dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due today</option>
          <option value="week">Due this week</option>
        </select>
      </div>
    </div>
  );
};

export default TasksFiltersBar;
