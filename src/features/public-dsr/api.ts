import axios from 'axios';
import publicApi from '@/lib/publicApiClient';
import { PublicDsrPayload } from './types';

export const submitPublicDsrRequest = async (publicKey: string, payload: PublicDsrPayload): Promise<void> => {
  if (!publicKey) {
    throw new Error('Missing public request key.');
  }

  try {
    await publicApi.post(`/public/dsr/${publicKey}`, payload);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message = (err.response?.data as any)?.message ?? err.message ?? 'Failed to submit request.';
      const error = new Error(message) as Error & { status?: number };
      error.status = status;
      throw error;
    }
    throw err;
  }
};
