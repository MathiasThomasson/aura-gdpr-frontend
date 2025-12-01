import React from 'react';
import { TaskItem } from '../types';
import TaskRow from './TaskRow';

type Props = {
  tasks: TaskItem[];
  onSelect: (task: TaskItem) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const TasksTable: React.FC<Props> = ({ tasks, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading tasks...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load tasks.</p>;
  }
  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks found for the selected filters.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Title</th>
            <th className="py-3 pr-4 font-semibold">Resource</th>
            <th className="py-3 pr-4 font-semibold">Priority</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Assignee</th>
            <th className="py-3 pr-4 font-semibold">Due date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onClick={() => onSelect(task)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
