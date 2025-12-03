import { useCallback, useEffect, useRef, useState } from 'react';
import { create, getAll, getOne, patch, remove as deleteTask, update } from '../api';
import { TaskItem } from '../types';

const loadErrorMessage = 'Something went wrong while loading data. Please try again.';

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAll();
      if (isMounted.current) setTasks(data);
    } catch (err: any) {
      if (isMounted.current) {
        if (err?.status === 404) {
          setTasks([]);
          setError(null);
        } else {
          setError(loadErrorMessage);
        }
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fetchOne = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const item = await getOne(id);
      if (isMounted.current) {
        setTasks((prev) => {
          const exists = prev.some((t) => t.id === item.id);
          return exists ? prev.map((t) => (t.id === item.id ? item : t)) : [item, ...prev];
        });
      }
      return item;
    } finally {
      if (isMounted.current) setDetailLoading(false);
    }
  }, []);

  const createTask = useCallback(async (payload: Partial<TaskItem>) => {
    setSaving(true);
    setError(null);
    try {
      const created = await create(payload);
      if (isMounted.current) setTasks((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to create task.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, payload: Partial<TaskItem>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await update(id, payload);
      if (isMounted.current) {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      return updated;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to update task.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const patchTask = useCallback(async (id: string, payload: Partial<TaskItem>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await patch(id, payload);
      if (isMounted.current) {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      return updated;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to update task.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    await deleteTask(id);
    if (isMounted.current) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  return {
    tasks,
    loading,
    detailLoading,
    saving,
    error,
    refresh: load,
    fetchOne,
    create: createTask,
    update: updateTask,
    patch: patchTask,
    remove: removeTask,
  };
}

export default useTasks;
