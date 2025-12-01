import { API_URL } from '@/config/api';

const normalizeBaseUrl = (value: string | undefined): string => {
  if (!value || value.trim().length === 0) {
    return '/api';
  }
  return value.trim().replace(/\/+$/, '');
};

export const API_BASE_URL = normalizeBaseUrl(API_URL);
export const apiBaseUrl = API_BASE_URL;
