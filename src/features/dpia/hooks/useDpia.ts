import { useCallback, useEffect, useRef, useState } from 'react';
import { createDpia, getAllDpia, getDpia, patchDpia, updateDpia } from '../api';
import type { DpiaItem } from '../types';

const loadErrorMessage = 'Something went wrong while loading data. Please try again.';

export function useDpia() {
  const [dpias, setDpias] = useState<DpiaItem[]>([]);
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
      const data = await getAllDpia();
      if (isMounted.current) setDpias(data);
    } catch (err: any) {
      if (isMounted.current) {
        if (err?.status === 404) {
          setDpias([]);
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
      const item = await getDpia(id);
      if (isMounted.current) {
        setDpias((prev) => prev.map((d) => (d.id === item.id ? item : d)));
      }
      return item;
    } finally {
      if (isMounted.current) setDetailLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: Omit<DpiaItem, 'id'>) => {
    setSaving(true);
    try {
      const created = await createDpia(payload);
      if (isMounted.current) setDpias((prev) => [created, ...prev]);
      return created;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, payload: Partial<DpiaItem>) => {
    setSaving(true);
    try {
      const updated = await updateDpia(id, payload);
      if (isMounted.current) {
        setDpias((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      }
      return updated;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const patch = useCallback(async (id: string, payload: Partial<DpiaItem>) => {
    const updated = await patchDpia(id, payload);
    if (isMounted.current) setDpias((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    return updated;
  }, []);

  return {
    dpias,
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

export default useDpia;
