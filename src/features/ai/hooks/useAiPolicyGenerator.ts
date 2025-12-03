import { useCallback, useState } from 'react';
import { generatePolicy, type GeneratePolicyParams, type GeneratedPolicy } from '../api/policies';

export function useAiPolicyGenerator() {
  const [result, setResult] = useState<GeneratedPolicy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: GeneratePolicyParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await generatePolicy(params);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate policy with AI';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, generate };
}

export default useAiPolicyGenerator;
