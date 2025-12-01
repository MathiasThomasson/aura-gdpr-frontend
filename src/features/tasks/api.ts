import api from '@/lib/apiClient';
import { TaskItem, TaskPriority, TaskStatus } from './types';

const statusFallback = (value: any): TaskStatus => {
  const allowed: TaskStatus[] = ['open', 'in_progress', 'blocked', 'completed', 'cancelled'];
  return allowed.includes(value) ? value : 'open';
};

const priorityFallback = (value: any): TaskPriority => {
  const allowed: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
  return allowed.includes(value) ? value : 'medium';
};

const mapTask = (item: any): TaskItem => {
  const createdAt = item?.createdAt ?? item?.created_at ?? new Date().toISOString();
  const updatedAt = item?.updatedAt ?? item?.updated_at ?? createdAt;

  return {
    id: item?.id ?? item?._id ?? '',
    title: item?.title ?? '',
    description: item?.description ?? '',
    status: statusFallback(item?.status),
    priority: priorityFallback(item?.priority),
    dueDate: item?.dueDate ?? item?.due_date ?? '',
    createdAt,
    updatedAt,
    assignee: item?.assignee ?? '',
    resourceType: item?.resourceType ?? item?.resource_type ?? 'general',
    resourceId: item?.resourceId ?? item?.resource_id ?? '',
    resourceName: item?.resourceName ?? item?.resource_name ?? '',
  };
};

const normalizeList = (payload: unknown): TaskItem[] => {
  if (Array.isArray(payload)) return payload.map(mapTask);
  const value = payload as { items?: unknown; tasks?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapTask);
  if (Array.isArray(value?.tasks)) return value.tasks.map(mapTask);
  return [];
};

export async function getAll(): Promise<TaskItem[]> {
  const res = await api.get('/tasks');
  return normalizeList(res.data);
}

export async function getOne(id: string): Promise<TaskItem> {
  const res = await api.get(`/tasks/${id}`);
  return mapTask(res.data);
}

export async function create(payload: Partial<TaskItem>): Promise<TaskItem> {
  const res = await api.post('/tasks', payload);
  return mapTask(res.data);
}

export async function update(id: string, payload: Partial<TaskItem>): Promise<TaskItem> {
  const res = await api.put(`/tasks/${id}`, payload);
  return mapTask(res.data);
}

export async function patch(id: string, payload: Partial<TaskItem>): Promise<TaskItem> {
  const res = await api.patch(`/tasks/${id}`, payload);
  return mapTask(res.data);
}
