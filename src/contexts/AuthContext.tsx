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
    } catch (err: any) {
      handleLogout();
      toast({
        variant: 'destructive',
        title: 'Session expired',
        description: 'Please sign in again.',
      });
    }
  }, [handleLogout, setSession, toast]);

  useEffect(() => {
    const bootstrap = async () => {
      const storedAccess = getAccessToken();
      const storedUser = getUser();
      if (storedAccess && storedUser) {
        setAccessToken(storedAccess);
        setUserState(storedUser);
        setIsAuthenticated(true);
      }
      await refreshSession();
    };
    bootstrap();
  }, [refreshSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      const { tokens, user: nextUser } = mapAuthResponse(res.data);
      setSession(tokens, nextUser);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      navigate('/app/dashboard', { replace: true });
      return nextUser;
    },
    [navigate, setSession, toast]
  );

  const logout = useCallback(() => {
    triggerLogout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login, logout }}>
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
