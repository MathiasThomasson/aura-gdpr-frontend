import { useCallback, useState } from 'react';
import { autofillDocument, type AutofillParams, type AutofillResult } from '../autofill';

export function useAiAutofill() {
  const [result, setResult] = useState<AutofillResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autofill = useCallback(async (params: AutofillParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await autofillDocument(params);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to autofill with AI';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, autofill };
}

export default useAiAutofill;
