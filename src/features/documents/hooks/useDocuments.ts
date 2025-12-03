import { useCallback, useEffect, useRef, useState } from 'react';
import { createDocument, getAllDocuments, getDocument, patchDocument, updateDocument } from '../api';
import type { DocumentItem } from '../types';

const loadErrorMessage = 'Something went wrong while loading data. Please try again.';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
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
      const data = await getAllDocuments();
      if (isMounted.current) setDocuments(data);
    } catch (err: any) {
      if (isMounted.current) {
        if (err?.status === 404) {
          setDocuments([]);
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
      const item = await getDocument(id);
      if (isMounted.current) {
        setDocuments((prev) => prev.map((d) => (d.id === item.id ? item : d)));
      }
      return item;
    } finally {
      if (isMounted.current) setDetailLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: Omit<DocumentItem, 'id'>) => {
    setSaving(true);
    try {
      const created = await createDocument(payload);
      if (isMounted.current) setDocuments((prev) => [created, ...prev]);
      return created;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, payload: Partial<DocumentItem>) => {
    setSaving(true);
    try {
      const updated = await updateDocument(id, payload);
      if (isMounted.current) {
        setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      }
      return updated;
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, []);

  const patch = useCallback(async (id: string, payload: Partial<DocumentItem>) => {
    const updated = await patchDocument(id, payload);
    if (isMounted.current) setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    return updated;
  }, []);

  return {
    documents,
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

export default useDocuments;
