import { useEffect, useState } from 'react';
import type { AiAuditState, AuditRun } from '../types';
import { fetchLatestAiAudit, runAiAudit } from '../api';

export function useAiAuditMockData() {
  const [state, setState] = useState<AiAuditState>({
    latestRun: null,
    history: [],
    isRunning: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const latest = await fetchLatestAiAudit();
      if (cancelled) return;

      setState((prev) => ({
        ...prev,
        latestRun: latest,
        history: latest ? [latest, ...prev.history] : prev.history,
      }));
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const triggerRun = async () => {
    setState((prev) => ({ ...prev, isRunning: true }));
    try {
      const newRun: AuditRun = await runAiAudit();
      setState((prev) => ({
        latestRun: newRun,
        history: [newRun, ...prev.history],
        isRunning: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isRunning: false }));
    }
  };

  return {
    latestRun: state.latestRun,
    history: state.history,
    isRunning: state.isRunning,
    runAudit: triggerRun,
  };
}

export default useAiAuditMockData;
