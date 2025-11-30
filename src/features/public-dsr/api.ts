import api from '@/lib/apiClient';
import { PublicDsrPayload } from './types';

export const createPublicDataSubjectRequest = async (
  tenantSlug: string,
  payload: PublicDsrPayload
): Promise<void> => {
  if (!tenantSlug) {
    throw new Error('Missing tenant identifier.');
  }

  await api.post(`/public/tenants/${tenantSlug}/data-subject-requests`, payload);
};
