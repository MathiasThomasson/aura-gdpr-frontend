const envUrl = import.meta.env.VITE_API_URL;
const normalizedEnvUrl =
  envUrl && envUrl.trim().length > 0 ? envUrl.trim().replace(/^["']|["']$/g, '') : undefined;

export const apiBaseUrl = normalizedEnvUrl && normalizedEnvUrl.length > 0 ? normalizedEnvUrl : '/api';

export const API_BASE_URL = apiBaseUrl;
