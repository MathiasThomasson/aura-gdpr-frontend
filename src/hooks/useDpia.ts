import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/apiClient';

export type DpiaRisk = 'low' | 'medium' | 'high';

export type Dpia = {
  id: string;
  title: string;
  process_name: string;
  purpose: string;
  overall_risk: DpiaRisk;
  dpo_approved?: boolean;
  updated_at: string;
};

export type DpiaPayload = Partial<Dpia> & { title: string };

type DpiaListResponse = { items: Dpia[] };

export const useDpia = () => {
  const [data, setData] = useState<Dpia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<DpiaListResponse>('/dpia');
      setData(res.data.items);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load DPIA list');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveDpia = useCallback(
    async (payload: DpiaPayload) => {
      if (payload.id) {
        await api.patch(`/dpia/${payload.id}`, payload);
      } else {
        await api.post('/dpia', payload);
      }
      await load();
    },
    [load]
  );

  return { data, loading, error, reload: load, saveDpia };
};

export default useDpia;
