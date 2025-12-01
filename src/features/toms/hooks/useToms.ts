import { useCallback, useEffect, useRef, useState } from 'react';
import { create, getAll, getOne, patch, update } from '../api';
import { TomItem } from '../types';

export function useToms() {
  const [toms, setToms] = useState<TomItem[]>([]);
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
      if (isMounted.current) setToms(data);
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to load TOMs.');
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
        setToms((prev) => {
          const exists = prev.some((t) => t.id === item.id);
          return exists ? prev.map((t) => (t.id === item.id ? item : t)) : [item, ...prev];
        });
      }
      return item;
    } finally {
      if (isMounted.current) setDetailLoading(false);
    }
  }, []);

  const createTom = useCallback(async (payload: Partial<TomItem>) => {
    setSaving(true);
    setError(null);
    try {
      const created = await create(payload);
      if (isMounted.current) setToms((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to create TOM.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const updateTom = useCallback(async (id: string, payload: Partial<TomItem>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await update(id, payload);
      if (isMounted.current) {
        setToms((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      return updated;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to update TOM.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const patchTom = useCallback(async (id: string, payload: Partial<TomItem>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await patch(id, payload);
      if (isMounted.current) {
        setToms((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      return updated;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to update TOM.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  return {
    toms,
    loading,
    detailLoading,
    saving,
    error,
    refresh: load,
    fetchOne,
    create: createTom,
    update: updateTom,
    patch: patchTom,
  };
}

export default useToms;
