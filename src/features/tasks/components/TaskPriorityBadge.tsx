import React from 'react';
import { TaskPriority } from '../types';

const styles: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-sky-50 text-sky-700 border-sky-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-rose-50 text-rose-700 border-rose-200',
};

const labels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

type Props = { priority: TaskPriority };

const TaskPriorityBadge: React.FC<Props> = ({ priority }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[priority]}`}>
    {labels[priority]}
  </span>
);

export default TaskPriorityBadge;
