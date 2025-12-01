import { useCallback, useState } from 'react';
import { classifyIncident, type IncidentClassification, type IncidentClassificationRequest } from '../incidents';

export function useAiIncidentClassifier() {
  const [result, setResult] = useState<IncidentClassification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classify = useCallback(async (params: IncidentClassificationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await classifyIncident(params);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to classify incident with AI';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, classify };
}

export default useAiIncidentClassifier;
