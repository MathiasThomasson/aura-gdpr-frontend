import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/apiClient';

export type TaskStatus = 'open' | 'in_progress' | 'blocked' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  assignee?: string;
  created_at?: string;
  updated_at?: string;
};

type TasksResponse = {
  items: Task[];
};

export const useTasks = (status?: TaskStatus) => {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<TasksResponse>('/api/tasks', {
        params: status ? { status } : undefined,
      });
      setData(res.data.items);
    } catch (err: any) {
      if (err?.status === 404) {
        setData([]);
        setError(null);
        return;
      }
      setError('Something went wrong while loading data. Please try again.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
};

export default useTasks;
