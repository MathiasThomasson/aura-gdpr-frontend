import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '@/lib/apiClient';
import { useAuth } from './AuthContext';

type VersionInfo = {
  version?: string;
  build?: string;
};

type SystemContextValue = {
  versionInfo: VersionInfo | null;
  isVersionLoading: boolean;
  refreshVersion: () => Promise<void>;
  demoMode: boolean;
  isOffline: boolean;
};

const SystemContext = createContext<SystemContextValue | undefined>(undefined);

const defaultVersion: VersionInfo | null = null;

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(defaultVersion);
  const [isVersionLoading, setIsVersionLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  const demoMode = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const hasDemoParam = searchParams.get('demo') === '1';
    const pathIndicatesDemo = location.pathname.startsWith('/demo');
    return hasDemoParam || pathIndicatesDemo;
  }, [location.pathname, location.search]);

  const refreshVersion = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsVersionLoading(true);
    try {
      const response = await api.get<VersionInfo>('/api/system/version');
      setVersionInfo(response.data);
    } catch (err) {
      // Swallow errors to avoid blocking UI; version will remain null.
      setVersionInfo((prev) => prev);
    } finally {
      setIsVersionLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshVersion();
    } else {
      setVersionInfo(defaultVersion);
    }
  }, [isAuthenticated, refreshVersion]);

  return (
    <SystemContext.Provider value={{ versionInfo, isVersionLoading, refreshVersion, demoMode, isOffline }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystemStatus = (): SystemContextValue => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystemStatus must be used within a SystemProvider');
  }
  return context;
};
