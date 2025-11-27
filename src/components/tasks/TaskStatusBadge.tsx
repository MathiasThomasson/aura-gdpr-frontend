import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/hooks/useTasks';

const copy: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
};

const styles: Record<TaskStatus, string> = {
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200',
  done: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200',
};

const TaskStatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => (
  <Badge className={styles[status]}>{copy[status]}</Badge>
);

export default TaskStatusBadge;
