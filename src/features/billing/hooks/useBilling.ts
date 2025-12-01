import { useCallback, useEffect, useRef, useState } from 'react';
import { getBillingHistory, getCurrentPlan, getUsage, openBillingPortal } from '../api';
import type { BillingHistoryItem, TenantPlan, UsageSummaryData } from '../types';

export function useBilling() {
  const [currentPlan, setCurrentPlan] = useState<TenantPlan | null>(null);
  const [usage, setUsage] = useState<UsageSummaryData | null>(null);
  const [history, setHistory] = useState<BillingHistoryItem[]>([]);
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
      const [planRes, usageRes, historyRes] = await Promise.all([getCurrentPlan(), getUsage(), getBillingHistory()]);
      if (!isMounted.current) return;
      setCurrentPlan(planRes);
      setUsage(usageRes);
      setHistory(historyRes);
    } catch (error) {
      if (isMounted.current) setIsError(true);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleOpenPortal = useCallback(async () => {
    await openBillingPortal();
  }, []);

  return {
    currentPlan,
    usage,
    history,
    isLoading,
    isError,
    openPortal: handleOpenPortal,
    refresh: load,
  };
}

export default useBilling;
