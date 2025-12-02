import axios, { AxiosInstance } from 'axios';
import { apiBaseUrl } from './apiConfig';

const normalizePath = (url?: string): string | undefined => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (!url.startsWith('/')) {
    return `/${url}`;
  }
  return url;
};

const publicApi: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

publicApi.interceptors.request.use((config) => {
  if (config.url) {
    config.url = normalizePath(config.url);
  }
  return config;
});

publicApi.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message ?? error?.message ?? 'Unknown error';
    if (error && typeof error === 'object') {
      // Preserve server-provided error message
      (error as any).message = message;
    }
    return Promise.reject(error);
  }
);

export default publicApi;
