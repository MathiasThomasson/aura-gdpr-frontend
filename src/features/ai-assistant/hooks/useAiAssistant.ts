import { useCallback, useState } from 'react';
import { askAura } from '../api';
import type { AiSource } from '../types';

export function useAiAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<AiSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (input?: string) => {
      const nextQuestion = (input ?? question).trim();
      if (!nextQuestion) {
        setError('Please enter a question.');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await askAura(nextQuestion);
        setQuestion(nextQuestion);
        setAnswer(response.answer);
        setSources(response.sources ?? []);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to get answer from AURA AI');
      } finally {
        setIsLoading(false);
      }
    },
    [question]
  );

  const reset = useCallback(() => {
    setQuestion('');
    setAnswer(null);
    setSources([]);
    setError(null);
  }, []);

  return { question, setQuestion, answer, sources, isLoading, error, submit, reset };
}

export default useAiAssistant;
