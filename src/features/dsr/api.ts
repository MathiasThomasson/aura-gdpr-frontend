import api from '@/lib/apiClient';
import {
  CreateDataSubjectRequestInput,
  DataSubjectRequest,
  DataSubjectRequestStatus,
} from './types';

const statusFallback = (value: any): DataSubjectRequestStatus => {
  const allowed: DataSubjectRequestStatus[] = [
    'received',
    'identity_required',
    'in_progress',
    'waiting_for_information',
    'completed',
    'rejected',
  ];
  return allowed.includes(value) ? value : 'received';
};

const mapDsr = (item: any): DataSubjectRequest => ({
  ...item,
  status: statusFallback(item?.status),
  dueDate: item?.dueDate ?? item?.due_at ?? null,
  createdAt: item?.createdAt ?? item?.created_at,
  updatedAt: item?.updatedAt ?? item?.updated_at,
});

const normalizeDataSubjectRequests = (payload: unknown): DataSubjectRequest[] => {
  if (Array.isArray(payload)) return payload.map(mapDsr);
  const value = payload as { items?: unknown; requests?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapDsr);
  if (Array.isArray(value?.requests)) return value.requests.map(mapDsr);
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
  return mapDsr(res.data);
};

export const updateDataSubjectRequestStatus = async (
  id: string,
  status: DataSubjectRequestStatus
): Promise<DataSubjectRequest> => {
  const res = await api.patch(`/dsr/${id}`, { status });
  return mapDsr(res.data);
};
