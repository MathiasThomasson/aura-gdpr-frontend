import { createPublicDsr } from '@/features/dsr/api';
import { PublicDsrPayload } from './types';

export const createPublicDataSubjectRequest = async (
  tenantSlug: string,
  payload: PublicDsrPayload
): Promise<void> => {
  if (!tenantSlug) {
    throw new Error('Missing tenant identifier.');
  }

  await createPublicDsr(tenantSlug, payload);
};
