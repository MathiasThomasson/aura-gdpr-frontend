export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return envUrl;

  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }

  return '/api';
};

export const apiBaseUrl = getApiBaseUrl();
