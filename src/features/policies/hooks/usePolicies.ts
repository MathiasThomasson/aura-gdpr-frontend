import { useCallback, useEffect, useRef, useState } from 'react';
import { createPolicy, getAllPolicies, getPolicy, patchPolicy, updatePolicy } from '../api';
import type { PolicyItem } from '../types';

export function usePolicies() {
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
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
      const data = await getAllPolicies();
      if (isMounted.current) setPolicies(data);
    } catch (err: any) {
      if (isMounted.current) setError(err?.message ?? 'Failed to load policies.');
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
      const item = await getPolicy(id);
      if (isMounted.current) {
        setPolicies((prev) => prev.map((p) => (p.id === item.id ? item : p)));
      }
      return item;
    } finally {
      if (isMounted.current) setDetailLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: Omit<PolicyItem, 'id'>) => {
    setSaving(true);
    try {
      const created = await createPolicy(payload);
      if (isMounted.current) setPolicies((prev) => [created, ...prev]);
      return created;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, payload: Partial<PolicyItem>) => {
    setSaving(true);
    try {
      const updated = await updatePolicy(id, payload);
      if (isMounted.current) {
        setPolicies((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      }
      return updated;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const patch = useCallback(async (id: string, payload: Partial<PolicyItem>) => {
    const updated = await patchPolicy(id, payload);
    if (isMounted.current) setPolicies((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    return updated;
  }, []);

  return {
    policies,
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

export default usePolicies;
