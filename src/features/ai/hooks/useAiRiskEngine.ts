import { useCallback, useState } from 'react';
import { evaluateRisk, type RiskEvaluation, type RiskEvaluationParams } from '../api/risk';

export function useAiRiskEngine() {
  const [result, setResult] = useState<RiskEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback(async (params: RiskEvaluationParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await evaluateRisk(params);
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to evaluate risk with AI';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, evaluate };
}

export default useAiRiskEngine;
