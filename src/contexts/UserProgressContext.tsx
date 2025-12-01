import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '@/lib/apiClient';
import { useAuth } from './AuthContext';

export type UserProgressState = {
  organizationDetails: boolean;
  firstDsr: boolean;
  policyGenerated: boolean;
  dpiaCreated: boolean;
  ropaAdded: boolean;
  tomConfigured: boolean;
  aiAuditRun: boolean;
};

type UserProgressContextValue = {
  progress: UserProgressState;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markComplete: (key: keyof UserProgressState) => Promise<void>;
};

const defaultProgress: UserProgressState = {
  organizationDetails: false,
  firstDsr: false,
  policyGenerated: false,
  dpiaCreated: false,
  ropaAdded: false,
  tomConfigured: false,
  aiAuditRun: false,
};

const UserProgressContext = createContext<UserProgressContextValue | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<UserProgressState>(defaultProgress);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Partial<UserProgressState>>('/user-progress');
      setProgress((prev) => ({
        ...prev,
        ...(response.data ?? {}),
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load progress.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const markComplete = useCallback(async (key: keyof UserProgressState) => {
    setProgress((prev) => ({ ...prev, [key]: true }));
    try {
      await api.patch('/user-progress', { [key]: true });
    } catch (err: unknown) {
      setProgress((prev) => ({ ...prev, [key]: false }));
      throw err;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setProgress(defaultProgress);
      setError(null);
    }
  }, [isAuthenticated, refresh]);

  return (
    <UserProgressContext.Provider value={{ progress, loading, error, refresh, markComplete }}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = (): UserProgressContextValue => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};
