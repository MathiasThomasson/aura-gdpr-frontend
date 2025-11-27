import axios from 'axios';
import { clearTokens, clearUser, setTokens, setUser, getUser, StoredUser } from './tokenStorage';
import { apiBaseUrl } from './apiConfig';

export type User = StoredUser;

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user?: User;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

let logoutHandler: (() => void) | null = null;

export const registerLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

export const triggerLogout = () => {
  clearTokens();
  clearUser();
  if (logoutHandler) {
    logoutHandler();
  } else {
    window.location.replace('/login');
  }
};

export const mapAuthResponse = (payload: AuthResponse): { tokens: AuthTokens; user?: User } => ({
  tokens: {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
  },
  user: payload.user,
});

export const refreshAuthTokens = async (refreshToken: string): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(
    `${apiBaseUrl}/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
  );
  return res.data;
};

export const persistSession = (tokens: AuthTokens, user?: User) => {
  setTokens(tokens.accessToken, tokens.refreshToken);
  if (user) {
    setUser(user);
  } else {
    const existing = getUser();
    if (existing) setUser(existing);
  }
};
