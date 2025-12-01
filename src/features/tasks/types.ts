export type TaskStatus = 'open' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskResourceType =
  | 'dsr'
  | 'policy'
  | 'document'
  | 'dpia'
  | 'ropa'
  | 'incident'
  | 'toms'
  | 'general';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignee: string;
  resourceType: TaskResourceType;
  resourceId?: string;
  resourceName?: string;
}
