import { useCallback, useState } from 'react';
import { suggestRopaFields, type RopaSuggestion, type RopaSuggestParams } from '../api/ropa';

export function useAiRopaSuggest() {
  const [result, setResult] = useState<RopaSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggest = useCallback(async (params: RopaSuggestParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await suggestRopaFields(params);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch ROPA suggestions';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, suggest };
}

export default useAiRopaSuggest;
