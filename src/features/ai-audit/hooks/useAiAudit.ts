import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAiAuditHistory, fetchLatestAiAudit, runAiAudit } from '../api';
import type { AuditRun } from '../types';

export function useAiAudit() {
  const [latestRun, setLatestRun] = useState<AuditRun | null>(null);
  const [history, setHistory] = useState<AuditRun[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [latest, historyList] = await Promise.all([fetchLatestAiAudit(), fetchAiAuditHistory()]);
      if (!isMounted.current) return;
      if (latest) {
        setLatestRun(latest);
      }
      setHistory(historyList);
    } catch (error) {
      if (isMounted.current) setIsError(true);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setIsError(false);
    try {
      const newRun = await runAiAudit();
      if (!isMounted.current) return;
      setLatestRun(newRun);
      setHistory((prev) => [newRun, ...prev]);
    } catch (error) {
      if (isMounted.current) setIsError(true);
    } finally {
      if (isMounted.current) setIsRunning(false);
    }
  }, []);

  return {
    latestRun,
    history,
    isRunning,
    isLoading,
    isError,
    runAudit: handleRun,
  };
}

export default useAiAudit;
