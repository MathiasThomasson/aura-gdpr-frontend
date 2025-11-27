import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/apiClient';

export type NotificationSettings = {
  dsr_reminders: boolean;
  incident_alerts: boolean;
  dpia_approvals: boolean;
  task_reminders: boolean;
  system_alerts: boolean;
};

const defaultSettings: NotificationSettings = {
  dsr_reminders: false,
  incident_alerts: false,
  dpia_approvals: false,
  task_reminders: false,
  system_alerts: false,
};

export const useNotificationSettings = () => {
  const [data, setData] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<NotificationSettings>('/settings/notifications');
      setData(res.data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load notification settings');
      setData(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveSettings = useCallback(
    async (next: NotificationSettings) => {
      setSaving(true);
      setError(null);
      try {
        await api.patch('/settings/notifications', next);
        setData(next);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to save notification settings');
        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return { data, loading, error, saving, reload: load, saveSettings };
};

export default useNotificationSettings;
