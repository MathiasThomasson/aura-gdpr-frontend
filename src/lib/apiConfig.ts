const normalizeBaseUrl = (value: string | undefined): string => {
  if (!value || value.trim().length === 0) {
    return 'http://localhost:8010/api';
  }
  // Remove trailing slashes to avoid double-slashing when appending paths.
  return value.trim().replace(/\/+$/, '');
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

export const apiBaseUrl = API_BASE_URL;
