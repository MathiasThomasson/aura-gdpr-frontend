import { useCallback, useState } from 'react';
import { runAiAuditV2, type AuditV2Result } from '../api/auditV2';

export function useAiAuditV2() {
  const [result, setResult] = useState<AuditV2Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await runAiAuditV2();
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to run AI audit v2';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, run };
}

export default useAiAuditV2;
