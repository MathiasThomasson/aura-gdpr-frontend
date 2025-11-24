import React, { useEffect, useState } from 'react';
import api, { HealthResponse } from '@/lib/apiClient';

const HealthStatus: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchHealth = async () => {
      try {
        setLoading(true);
        const res = await api.get<HealthResponse>('/health');
        if (!cancelled) {
          setStatus((res.data && (res.data.status as string)) ?? 'ok');
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to connect to backend');
          setStatus(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="px-3 py-2 text-sm text-muted-foreground">Checking backend...</div>;
  if (error)
    return <div className="px-3 py-2 text-sm text-red-500">Backend error: {error}</div>;

  return (
    <div className="px-3 py-2 text-sm text-green-600">
      Backend OK: {status}
    </div>
  );
};

export default HealthStatus;
