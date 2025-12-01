import { useCallback, useState } from 'react';
import { explainText, type ExplainParams, type ExplainResult } from '../explain';

export function useAiExplain() {
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const explain = useCallback(async (params: ExplainParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await explainText(params);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to explain content with AI';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, explain };
}

export default useAiExplain;
