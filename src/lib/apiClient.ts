import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens, clearUser } from './tokenStorage';
import { refreshAuthTokens, triggerLogout, mapAuthResponse } from './authTokens';
import { apiBaseUrl } from './apiConfig';

export type HealthResponse = { status: string; [key: string]: unknown };

const normalizePath = (url?: string): string | undefined => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url; // absolute URL, leave untouched
  if (!url.startsWith('/')) {
    return `/${url}`;
  }
  return url;
};

const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (config.url) {
    config.url = normalizePath(config.url);
  }
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
};

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config ?? {};
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        triggerLogout();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await refreshAuthTokens(refreshToken);
        const { tokens } = mapAuthResponse(refreshResponse);
        setTokens(tokens.accessToken, tokens.refreshToken);
        isRefreshing = false;
        processQueue(tokens.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(null);
        clearTokens();
        clearUser();
        triggerLogout();
        return Promise.reject(refreshError);
      }
    }

    const message = error?.response?.data?.message ?? error?.message ?? 'Unknown error';
    const normalizedError = new Error(message) as Error & {
      status?: number;
      data?: unknown;
      response?: unknown;
    };
    normalizedError.status = status;
    normalizedError.data = error?.response?.data;
    normalizedError.response = error?.response;
    return Promise.reject(normalizedError);
  }
);

export default api;
