import { useCallback, useEffect, useRef, useState } from 'react';
import { create, getAll, getOne, patch, update } from '../api';
import { CookieItem } from '../types';

export function useCookies() {
  const [cookies, setCookies] = useState<CookieItem[]>([]);
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
      if (isMounted.current) setCookies(data);
    } catch (err: any) {
      if (isMounted.current) {
        if (err?.status === 404) {
          setCookies([]);
          setError(null);
        } else {
          setError('Something went wrong while loading data. Please try again.');
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
        setCookies((prev) => {
          const exists = prev.some((c) => c.id === item.id);
          return exists ? prev.map((c) => (c.id === item.id ? item : c)) : [item, ...prev];
        });
      }
      return item;
    } finally {
      if (isMounted.current) setDetailLoading(false);
    }
  }, []);

  const createCookie = useCallback(async (payload: Partial<CookieItem>) => {
    setSaving(true);
    setError(null);
    try {
      const created = await create(payload);
      if (isMounted.current) setCookies((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to create cookie.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const updateCookie = useCallback(async (id: string, payload: Partial<CookieItem>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await update(id, payload);
      if (isMounted.current) {
        setCookies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      }
      return updated;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to update cookie.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const patchCookie = useCallback(async (id: string, payload: Partial<CookieItem>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await patch(id, payload);
      if (isMounted.current) {
        setCookies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      }
      return updated;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to update cookie.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  return {
    cookies,
    loading,
    detailLoading,
    saving,
    error,
    refresh: load,
    fetchOne,
    create: createCookie,
    update: updateCookie,
    patch: patchCookie,
  };
}

export default useCookies;
