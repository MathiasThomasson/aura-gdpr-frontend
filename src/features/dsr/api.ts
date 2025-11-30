import api from '@/lib/apiClient';
import { CreateDataSubjectRequestInput, DataSubjectRequest } from './types';

const normalizeDataSubjectRequests = (payload: unknown): DataSubjectRequest[] => {
  if (Array.isArray(payload)) return payload as DataSubjectRequest[];
  const value = payload as { items?: unknown; requests?: unknown };
  if (Array.isArray(value?.items)) return value.items as DataSubjectRequest[];
  if (Array.isArray(value?.requests)) return value.requests as DataSubjectRequest[];
  return [];
};

export const fetchDataSubjectRequests = async (): Promise<DataSubjectRequest[]> => {
  const res = await api.get('/dsr');
  return normalizeDataSubjectRequests(res.data);
};

export const createDataSubjectRequest = async (
  payload: CreateDataSubjectRequestInput
): Promise<DataSubjectRequest> => {
  const res = await api.post('/dsr', payload);
  return res.data as DataSubjectRequest;
};
