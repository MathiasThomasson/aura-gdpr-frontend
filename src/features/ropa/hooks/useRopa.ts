import { useCallback, useEffect, useRef, useState } from 'react';
import { createRopa, getAllRopa, getRopa, patchRopa, updateRopa } from '../api';
import type { RopaItem } from '../types';

export function useRopa() {
  const [records, setRecords] = useState<RopaItem[]>([]);
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
      const data = await getAllRopa();
      if (isMounted.current) setRecords(data);
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to load ROPA records.');
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
      const record = await getRopa(id);
      if (isMounted.current) {
        setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)));
      }
      return record;
    } finally {
      if (isMounted.current) setDetailLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: Omit<RopaItem, 'id'>) => {
    setSaving(true);
    try {
      const created = await createRopa(payload);
      if (isMounted.current) setRecords((prev) => [created, ...prev]);
      return created;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, payload: Partial<RopaItem>) => {
    setSaving(true);
    try {
      const updated = await updateRopa(id, payload);
      if (isMounted.current) {
        setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      }
      return updated;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const patch = useCallback(async (id: string, payload: Partial<RopaItem>) => {
    const updated = await patchRopa(id, payload);
    if (isMounted.current) setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    return updated;
  }, []);

  return {
    records,
    loading,
    detailLoading,
    saving,
    error,
    refresh: load,
    fetchOne,
    create,
    update,
    patch,
  };
}

export default useRopa;
