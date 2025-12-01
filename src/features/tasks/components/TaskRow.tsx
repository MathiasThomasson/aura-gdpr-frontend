import React from 'react';
import { TaskItem } from '../types';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskStatusBadge from './TaskStatusBadge';

type Props = {
  task: TaskItem;
  onClick: () => void;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatResource = (task: TaskItem) => {
  if (task.resourceName) return `${task.resourceType}: ${task.resourceName}`;
  return task.resourceType;
};

const TaskRow: React.FC<Props> = ({ task, onClick }) => {
  return (
    <tr
      className="cursor-pointer border-b last:border-0 hover:bg-slate-50 focus-within:bg-slate-50"
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <td className="py-3 pr-4 font-semibold text-foreground">{task.title}</td>
      <td className="py-3 pr-4 text-foreground">{formatResource(task)}</td>
      <td className="py-3 pr-4">
        <TaskPriorityBadge priority={task.priority} />
      </td>
      <td className="py-3 pr-4">
        <TaskStatusBadge status={task.status} />
      </td>
      <td className="py-3 pr-4 text-foreground">{task.assignee}</td>
      <td className="py-3 pr-4 text-foreground">{formatDate(task.dueDate)}</td>
    </tr>
  );
};

export default TaskRow;
