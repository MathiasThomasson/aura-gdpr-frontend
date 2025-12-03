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
  tenantPlan: string | null;
  isTestTenant: boolean;
  isTenantStatusLoading: boolean;
  refreshTenantStatus: () => Promise<void>;
};

const SystemContext = createContext<SystemContextValue | undefined>(undefined);

const defaultVersion: VersionInfo | null = null;
const defaultTenantPlan = null;

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(defaultVersion);
  const [isVersionLoading, setIsVersionLoading] = useState<boolean>(false);
  const [tenantPlan, setTenantPlan] = useState<string | null>(defaultTenantPlan);
  const [isTestTenant, setIsTestTenant] = useState<boolean>(false);
  const [isTenantStatusLoading, setIsTenantStatusLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  const demoMode = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const hasDemoParam = searchParams.get('demo') === '1';
    const pathIndicatesDemo = location.pathname.startsWith('/demo');
    const envDemo = import.meta.env.VITE_DEMO_MODE === 'true';
    return hasDemoParam || pathIndicatesDemo || envDemo;
  }, [location.pathname, location.search]);

  const refreshVersion = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsVersionLoading(true);
    try {
      const response = await api.get<VersionInfo>('/system/version');
      setVersionInfo(response.data);
    } catch (err) {
      // Swallow errors to avoid blocking UI; version will remain null.
      setVersionInfo((prev) => prev);
    } finally {
      setIsVersionLoading(false);
    }
  }, [isAuthenticated]);

  const refreshTenantStatus = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsTenantStatusLoading(true);
    try {
      const response = await api.get<{ plan?: string; is_test_tenant?: boolean }>('/api/system/tenant-status');
      const nextPlan = response.data?.plan ?? null;
      const nextIsTest = Boolean(response.data?.is_test_tenant);
      setTenantPlan(nextPlan);
      setIsTestTenant(nextIsTest);
    } catch (err) {
      // keep previous values to avoid blocking the UI
      setTenantPlan((prev) => prev);
      setIsTestTenant((prev) => prev);
    } finally {
      setIsTenantStatusLoading(false);
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
      refreshTenantStatus();
    } else {
      setVersionInfo(defaultVersion);
      setTenantPlan(defaultTenantPlan);
      setIsTestTenant(false);
    }
  }, [isAuthenticated, refreshTenantStatus, refreshVersion]);

  return (
    <SystemContext.Provider
      value={{
        versionInfo,
        isVersionLoading,
        refreshVersion,
        demoMode,
        isOffline,
        tenantPlan,
        isTestTenant,
        isTenantStatusLoading,
        refreshTenantStatus,
      }}
    >
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
