import { useCallback, useEffect, useRef, useState } from 'react';
import { createDataSubjectRequest, fetchDataSubjectRequests } from '../api';
import { CreateDataSubjectRequestInput, DataSubjectRequest } from '../types';

export const useDataSubjectRequests = () => {
  const [data, setData] = useState<DataSubjectRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
      const requests = await fetchDataSubjectRequests();
      if (isMounted.current) {
        setData(requests);
      }
    } catch (err: any) {
      if (isMounted.current) {
        setError(err?.message ?? 'Failed to load data subject requests.');
        setData([]);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload: CreateDataSubjectRequestInput) => {
      const created = await createDataSubjectRequest(payload);
      if (isMounted.current) {
        setData((prev) => [created, ...prev]);
      }
      return created;
    },
    []
  );

  return {
    data,
    loading,
    error,
    reload: load,
    create,
  };
};

export default useDataSubjectRequests;
