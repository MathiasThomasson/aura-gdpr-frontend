import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/apiClient';

export type DashboardSummary = {
  documents: number;
  tasks: number;
  projects: number;
  last_ai_query?: {
    question?: string;
    answer?: string;
    summary?: string;
    timestamp?: string;
  } | string | null;
  health_status?: 'green' | 'yellow' | 'red' | string | null;
};

type DashboardSummaryResponse = DashboardSummary;

export const useDashboardSummary = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<DashboardSummaryResponse>('/dashboard/summary');
      setData(res.data);
    } catch (err: any) {
      setError(err?.message ?? 'Unable to load dashboard');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
};

export default useDashboardSummary;
