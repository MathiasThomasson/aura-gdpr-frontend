import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '@/lib/apiClient';
import { useAuth } from './AuthContext';

export type OnboardingState = {
  completed: boolean;
  currentStep?: number;
};

type OnboardingContextValue = {
  state: OnboardingState;
  loading: boolean;
  refresh: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const defaultState: OnboardingState = { completed: true };

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [loading, setLoading] = useState<boolean>(isAuthenticated);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await api.get<OnboardingState>('/api/onboarding/state');
      const nextState = response.data ?? defaultState;
      setState({
        completed: Boolean(nextState.completed),
        currentStep: nextState.currentStep,
      });
    } catch (err) {
      setState((prev) => prev);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const completeOnboarding = useCallback(async () => {
    await api.patch('/api/onboarding/state', { completed: true });
    setState((prev) => ({ ...prev, completed: true }));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      refresh();
    } else {
      setState(defaultState);
      setLoading(false);
    }
  }, [isAuthenticated, refresh]);

  return (
    <OnboardingContext.Provider
      value={{
        state,
        loading,
        refresh,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextValue => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
