import { useCallback, useEffect, useRef, useState } from 'react';
import { create, getAll, getOne, patch, update } from '../api';
import { IncidentItem, IncidentStatus } from '../types';

const loadErrorMessage = 'Something went wrong while loading data. Please try again.';

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
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
      if (isMounted.current) setIncidents(data);
    } catch (err: any) {
      if (isMounted.current) {
        if (err?.status === 404) {
          setIncidents([]);
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
        setIncidents((prev) => {
          const exists = prev.some((i) => i.id === item.id);
          return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev];
        });
      }
      return item;
    } finally {
      if (isMounted.current) setDetailLoading(false);
    }
  }, []);

  const createIncident = useCallback(async (payload: Partial<IncidentItem>) => {
    setSaving(true);
    setError(null);
    try {
      const created = await create(payload);
      if (isMounted.current) setIncidents((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to create incident.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const updateIncident = useCallback(async (id: string, payload: Partial<IncidentItem>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await update(id, payload);
      if (isMounted.current) {
        setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      }
      return updated;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to update incident.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const patchIncident = useCallback(async (id: string, payload: Partial<IncidentItem>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await patch(id, payload);
      if (isMounted.current) {
        setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      }
      return updated;
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to update incident.');
      throw err;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  return {
    incidents,
    loading,
    detailLoading,
    saving,
    error,
    refresh: load,
    fetchOne,
    create: createIncident,
    update: updateIncident,
    patch: patchIncident,
  };
}

export default useIncidents;
