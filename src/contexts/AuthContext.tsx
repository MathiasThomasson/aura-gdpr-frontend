import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/apiClient';
import { useToast } from '@/components/ui/use-toast';
import {
  AuthResponse,
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
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUserState] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const setSession = useCallback((tokens: { accessToken: string; refreshToken: string }, nextUser?: User) => {
    setTokens(tokens.accessToken, tokens.refreshToken);
    if (nextUser) {
      setUser(nextUser);
      setUserState(nextUser);
    }
    setAccessToken(tokens.accessToken);
    setIsAuthenticated(true);
  }, []);

  const fetchCurrentUser = useCallback(async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    if (!res.data) {
      throw new Error('Failed to load user');
    }
    setUser(res.data);
    setUserState(res.data);
    return res.data;
  }, []);

  const handleLogout = useCallback(() => {
    clearTokens();
    clearUser();
    setUserState(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  }, [navigate]);

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
        if (storedUser) setUserState(storedUser);
        setIsAuthenticated(true);
        try {
          await fetchCurrentUser();
        } catch {
          handleLogout();
          return;
        }
        await refreshSession();
      }
    };
    bootstrap();
  }, [fetchCurrentUser, handleLogout, refreshSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      const { tokens } = mapAuthResponse(res.data);
      setSession(tokens);
      try {
        const me = await fetchCurrentUser();
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        navigate('/app/dashboard', { replace: true });
        return me;
      } catch (err) {
        handleLogout();
        throw err;
      }
    },
    [fetchCurrentUser, handleLogout, navigate, setSession, toast]
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
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login, register, logout }}>
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
