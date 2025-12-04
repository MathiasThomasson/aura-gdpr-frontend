import api from './apiClient';
import { clearTokens, clearUser, setTokens, setUser, getUser, StoredUser } from './tokenStorage';

export type User = StoredUser & {
  id?: number;
  tenantId?: number;
  role?: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  user?: User;
  user_id?: number;
  tenant_id?: number;
  role?: string;
  email?: string;
};

export type LoginResponse = AuthResponse & {
  token_type: string;
  user_id: number;
  tenant_id: number;
  role: string;
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
    const path = window.location?.pathname ?? '';
    if (path.startsWith('/app') || path.startsWith('/onboarding')) {
      window.location.replace('/login');
    }
  }
};

const buildUserFromPayload = (payload: AuthResponse, fallbackEmail?: string): User | undefined => {
  if (payload.user) return payload.user;
  if (payload.user_id === undefined && payload.tenant_id === undefined && !payload.role) return undefined;
  return {
    id: payload.user_id,
    tenantId: payload.tenant_id,
    role: payload.role,
    email: payload.email ?? fallbackEmail ?? '',
  };
};

export const mapAuthResponse = (payload: AuthResponse, fallbackEmail?: string): { tokens: AuthTokens; user?: User } => ({
  tokens: {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
  },
  user: buildUserFromPayload(payload, fallbackEmail),
});

export const refreshAuthTokens = async (refreshToken: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken });
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
