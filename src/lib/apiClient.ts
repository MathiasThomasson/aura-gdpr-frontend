import axios, { AxiosInstance } from 'axios';

export type HealthResponse = { status: string; [key: string]: unknown };

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Basic response interceptor for better errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ?? error?.message ?? 'Unknown error';
    return Promise.reject(new Error(message));
  }
);

export default api;
