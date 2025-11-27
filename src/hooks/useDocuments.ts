import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/apiClient';

export type DocumentStatus = 'processed' | 'processing' | 'needs_review' | 'failed' | 'unknown';

export type DocumentRecord = {
  id: string;
  name: string;
  type?: string;
  status: DocumentStatus;
  tags?: string[];
  updated_at?: string;
  created_at?: string;
  size_bytes?: number;
  ai_summary?: string;
  metadata?: Record<string, unknown>;
};

export type DocumentsResponse = {
  items: DocumentRecord[];
};

export const useDocuments = () => {
  const [data, setData] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<DocumentsResponse>('/documents');
      setData(res.data.items);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load documents');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
};

export default useDocuments;
