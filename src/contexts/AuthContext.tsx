import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/lib/apiClient';
import { useToast } from '@/components/ui/use-toast';
import {
  AuthResponse,
  LoginResponse,
  User,
  mapAuthResponse,
  refreshAuthTokens,
  registerLogoutHandler,
  persistSession,
  triggerLogout,
} from '@/lib/authTokens';
import {
  getAccessToken,
  getRefreshToken,
  getUser,
  setTokens,
  setUser,
  clearTokens,
  clearUser,
} from '@/lib/tokenStorage';

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | undefined>;
  register: (email: string, password: string) => Promise<User | undefined>;
  logout: () => void;
  isPlatformOwner: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUserState] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isPlatformOwner, setIsPlatformOwner] = useState<boolean>(false);

  const normalizeUser = useCallback((raw: any, fallbackEmail?: string): User => {
    return {
      id: raw?.id ?? raw?.user_id,
      email: raw?.email ?? fallbackEmail ?? '',
      tenantId: raw?.tenantId ?? raw?.tenant_id,
      role: raw?.role,
      isPlatformOwner: Boolean(raw?.isPlatformOwner ?? raw?.is_platform_owner ?? raw?.role === 'platform_owner'),
    };
  }, []);

  const computePlatformOwner = (nextUser?: User | null) =>
    Boolean(nextUser?.isPlatformOwner || nextUser?.role === 'platform_owner');

  const setSession = useCallback((tokens: { accessToken: string; refreshToken: string }, nextUser?: User) => {
    setTokens(tokens.accessToken, tokens.refreshToken);
    if (nextUser) {
      setUser(nextUser);
      setUserState(nextUser);
      setIsPlatformOwner(computePlatformOwner(nextUser));
    }
    setAccessToken(tokens.accessToken);
    setIsAuthenticated(true);
  }, []);

  const fetchCurrentUser = useCallback(async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    if (!res.data) {
      throw new Error('Failed to load user');
    }
    const normalized = normalizeUser(res.data);
    setUser(normalized);
    setUserState(normalized);
    setIsPlatformOwner(computePlatformOwner(normalized));
    return normalized;
  }, [computePlatformOwner, normalizeUser]);

  const handleLogout = useCallback(() => {
    clearTokens();
    clearUser();
    setUserState(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    setIsPlatformOwner(false);
    if (location.pathname.startsWith('/app') || location.pathname.startsWith('/onboarding')) {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    registerLogoutHandler(handleLogout);
  }, [handleLogout]);

  const refreshSession = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return;
    const existingUser = getUser();

    try {
      const response = await refreshAuthTokens(refreshToken);
      const { tokens, user: refreshedUser } = mapAuthResponse(response);
      persistSession(tokens, refreshedUser ?? existingUser ?? undefined);
      setSession(tokens, refreshedUser ?? existingUser ?? undefined);
      await fetchCurrentUser();
    } catch (err: any) {
      handleLogout();
      toast({
        variant: 'destructive',
        title: 'Session expired',
        description: 'Please sign in again.',
      });
    }
  }, [fetchCurrentUser, handleLogout, setSession, toast]);

  useEffect(() => {
    const bootstrap = async () => {
      const storedAccess = getAccessToken();
      const storedRefresh = getRefreshToken();
      const storedUser = getUser();
      if (storedAccess && storedRefresh) {
        setAccessToken(storedAccess);
        if (storedUser) {
          const normalizedStored = normalizeUser(storedUser);
          setUserState(normalizedStored);
          setIsPlatformOwner(computePlatformOwner(normalizedStored));
        }
        setIsAuthenticated(true);
        try {
          await fetchCurrentUser();
          await refreshSession();
        } catch {
          handleLogout();
        }
      }
    };
    bootstrap();
  }, [fetchCurrentUser, handleLogout, refreshSession]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname.startsWith('/app')) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await api.post<LoginResponse>('/auth/login', { email, password });
        const { tokens, user: mappedUser } = mapAuthResponse(res.data, email);
        const fallbackUser =
          mappedUser ??
          normalizeUser({
            email,
            role: res.data.role,
            tenant_id: res.data.tenant_id,
            user_id: res.data.user_id,
            is_platform_owner: res.data.is_platform_owner,
          });
        setSession(tokens, fallbackUser);
        const platformOwner = computePlatformOwner(fallbackUser);
        setIsPlatformOwner(platformOwner);
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        navigate(platformOwner ? '/admin' : '/app/dashboard', { replace: true });
        return fallbackUser;
      } catch (error: any) {
        const message =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          error?.message ||
          'Login failed. Please check your email and password or try again later.';
        toast({ variant: 'destructive', title: 'Login failed', description: message });
        throw error;
      }
    },
    [navigate, setSession, toast]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<AuthResponse>('/auth/register', { email, password });
      const { tokens } = mapAuthResponse(res.data);
      setSession(tokens);
      try {
        const me = await fetchCurrentUser();
        toast({ title: 'Registration Successful', description: 'Your account has been created.' });
        navigate('/app/dashboard', { replace: true });
        return me;
      } catch (err) {
        handleLogout();
        throw err;
      }
    },
    [fetchCurrentUser, handleLogout, navigate, setSession, toast]
  );

  const logout = useCallback(() => {
    triggerLogout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, isPlatformOwner, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
