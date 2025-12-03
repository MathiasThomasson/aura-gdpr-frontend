import { useCallback, useEffect, useRef, useState } from 'react';
import { createTemplate, deleteTemplate, getAllTemplates, getTemplate, updateTemplate } from '../api';
import { TemplateItem } from '../types';

const loadErrorMessage = 'Something went wrong while loading templates. Please try again.';

export function useTemplates() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
      const data = await getAllTemplates();
      if (isMounted.current) setTemplates(data);
    } catch (err: any) {
      if (isMounted.current) {
        if (err?.status === 404) {
          setTemplates([]);
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
    const item = await getTemplate(id);
    if (isMounted.current) {
      setTemplates((prev) => prev.map((t) => (t.id === item.id ? item : t)));
    }
    return item;
  }, []);

  const create = useCallback(async (payload: Omit<TemplateItem, 'id'>) => {
    setSaving(true);
    try {
      const created = await createTemplate(payload);
      if (isMounted.current) setTemplates((prev) => [created, ...prev]);
      return created;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, payload: Partial<TemplateItem>) => {
    setSaving(true);
    try {
      const updated = await updateTemplate(id, payload);
      if (isMounted.current) setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      return updated;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteTemplate(id);
    if (isMounted.current) setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    templates,
    loading,
    saving,
    error,
    refresh: load,
    fetchOne,
    create,
    update,
    remove,
  };
}

export default useTemplates;
