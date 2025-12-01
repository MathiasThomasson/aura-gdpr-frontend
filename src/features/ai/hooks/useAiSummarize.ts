import { useCallback, useState } from 'react';
import { summarizeText, type SummarizeParams, type SummarizeResult } from '../api/summarize';

export function useAiSummarize() {
  const [result, setResult] = useState<SummarizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = useCallback(async (params: SummarizeParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await summarizeText(params);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to summarize content with AI';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, summarize };
}

export default useAiSummarize;
