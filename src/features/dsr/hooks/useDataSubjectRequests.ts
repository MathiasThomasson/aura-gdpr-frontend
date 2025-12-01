import { useCallback, useEffect, useRef, useState } from 'react';
import { createDsr, getDsrs, updateDsrStatus, getDsr } from '../api';
import { CreateDataSubjectRequestInput, DataSubjectRequest, DataSubjectRequestStatus } from '../types';

export const useDataSubjectRequests = () => {
  const [data, setData] = useState<DataSubjectRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
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
      const requests = await getDsrs();
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
      const created = await createDsr(payload);
      if (isMounted.current) {
        setData((prev) => [created, ...prev]);
      }
      return created;
    },
    []
  );

  const updateStatus = useCallback(async (id: string, status: DataSubjectRequestStatus) => {
    const updated = await updateDsrStatus(id, status);
    if (isMounted.current) {
      setData((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    }
    return updated;
  }, []);

  const fetchDetail = useCallback(
    async (id: string) => {
      setDetailLoading(true);
      try {
        const detail = await getDsr(id);
        if (isMounted.current) {
          setData((prev) => prev.map((item) => (item.id === detail.id ? detail : item)));
        }
        return detail;
      } finally {
        if (isMounted.current) {
          setDetailLoading(false);
        }
      }
    },
    []
  );

  return {
    data,
    loading,
    detailLoading,
    error,
    reload: load,
    create,
    updateStatus,
    fetchDetail,
  };
};

export default useDataSubjectRequests;
