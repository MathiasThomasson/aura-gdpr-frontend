import { useCallback, useMemo, useState } from 'react';
import api from '@/lib/apiClient';

export type PolicyType =
  | 'privacy_policy'
  | 'cookie_policy'
  | 'incident_policy'
  | 'dsr_procedure'
  | 'data_protection_policy';

export type PolicyFormInput = {
  policy_type: PolicyType;
  organization_name: string;
  audience: 'public' | 'internal';
  tone: 'formal' | 'simple';
  data_categories: string[];
  notes?: string;
};

export const usePolicyGenerator = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<PolicyFormInput | null>(null);

  const buildPrompt = useCallback((input: PolicyFormInput) => {
    const categories = input.data_categories.join(', ') || 'unspecified data categories';
    const notes = input.notes ? `Additional notes: ${input.notes}.` : '';
    return `Generate a ${input.policy_type} for ${input.organization_name}. Audience is ${input.audience}. Tone should be ${input.tone}. Data categories: ${categories}. ${notes}`;
  }, []);

  const generatePolicy = useCallback(
    async (input: PolicyFormInput) => {
      setLoading(true);
      setError(null);
      setLastInput(input);
      try {
        const prompt = buildPrompt(input);
        const res = await api.post<{ text: string }>('/ai/generate', { prompt });
        setResult(res.data?.text ?? '');
      } catch (err: any) {
        setError(err?.message ?? 'Failed to generate policy');
      } finally {
        setLoading(false);
      }
    },
    [buildPrompt]
  );

  const regenerate = useCallback(async () => {
    if (!lastInput) return;
    await generatePolicy(lastInput);
  }, [generatePolicy, lastInput]);

  const exportPdf = useCallback(() => {
    const blob = new Blob([result || ''], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'policy.pdf';
    link.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const hasResult = useMemo(() => !!result, [result]);

  return { result, loading, error, generatePolicy, regenerate, exportPdf, hasResult };
};

export default usePolicyGenerator;
