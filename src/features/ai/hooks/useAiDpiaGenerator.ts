import { useCallback, useState } from 'react';
import { generateDpia, type GenerateDpiaParams, type GeneratedDpia } from '../api/dpia';

export function useAiDpiaGenerator() {
  const [result, setResult] = useState<GeneratedDpia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: GenerateDpiaParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateDpia(params);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate DPIA with AI';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, generate };
}

export default useAiDpiaGenerator;
