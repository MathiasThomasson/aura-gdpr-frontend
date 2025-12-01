import api from '@/lib/apiClient';
import type { AiAnswerResponse } from './types';

export async function askAura(question: string): Promise<AiAnswerResponse> {
  try {
    const res = await api.post<AiAnswerResponse>('/api/ai/answer', { question });
    return res.data;
  } catch (error) {
    throw new Error('Failed to get answer from AURA AI');
  }
}
