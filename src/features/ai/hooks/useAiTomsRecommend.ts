import { useCallback, useState } from 'react';
import { recommendToms, type TomsRecommendParams, type TomsRecommendation } from '../toms';

export function useAiTomsRecommend() {
  const [result, setResult] = useState<TomsRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommend = useCallback(async (params: TomsRecommendParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await recommendToms(params);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to recommend TOMs via AI';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, recommend };
}

export default useAiTomsRecommend;
