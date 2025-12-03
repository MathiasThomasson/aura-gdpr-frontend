import { useCallback, useEffect, useRef, useState } from 'react';
import { getAuditLogs } from '../api';
import { AuditLogItem } from '../types';

export type AuditLogFilters = {
  action?: string;
  startDate?: string;
  endDate?: string;
};

const loadErrorMessage = 'Something went wrong while loading audit logs. Please try again.';

export function useAuditLogs(initialFilters: AuditLogFilters = {}) {
  const [items, setItems] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const filtersRef = useRef<AuditLogFilters>(initialFilters);

  const load = useCallback(
    async (filters?: AuditLogFilters) => {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);
      try {
        const merged = { ...filtersRef.current, ...(filters ?? {}) };
        const data = await getAuditLogs(merged);
        filtersRef.current = merged;
        setItems(data);
      } catch (err) {
        setIsError(true);
        setErrorMessage(err instanceof Error ? err.message : loadErrorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(filtersRef.current);
  }, [load]);

  return {
    items,
    isLoading,
    isError,
    errorMessage,
    refresh: load,
  };
}

export default useAuditLogs;
