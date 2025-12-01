export const apiBaseUrl =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim().length > 0
    ? import.meta.env.VITE_API_URL.trim()
    : '/api';

export const API_BASE_URL = apiBaseUrl;
