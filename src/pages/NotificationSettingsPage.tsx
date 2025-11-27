import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NotificationToggle from '@/components/notificationsSettings/NotificationToggle';
import EmailPreviewModal from '@/components/notificationsSettings/EmailPreviewModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import useNotificationSettings, { NotificationSettings } from '@/hooks/useNotificationSettings';
import { NavLink } from 'react-router-dom';

const NotificationSettingsPage: React.FC = () => {
  const { data, loading, error, saving, reload, saveSettings } = useNotificationSettings();
  const [local, setLocal] = useState<NotificationSettings | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (data) setLocal(data);
  }, [data]);

  const update = (key: keyof NotificationSettings, value: boolean) => {
    setLocal((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!local) return;
    try {
      await saveSettings(local);
      toast({ title: 'Settings saved', description: 'Notification preferences updated.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Save failed', description: err?.message ?? 'Unable to save settings.' });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Settings"
        description="Configure email alerts for GDPR-critical events."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
              Preview email
            </Button>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              Reload
            </Button>
          </div>
        }
      />
      <div className="flex items-center gap-2">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-slate-200 dark:bg-slate-700 font-semibold' : 'text-muted-foreground'}`
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/app/settings/notifications"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-slate-200 dark:bg-slate-700 font-semibold' : 'text-muted-foreground'}`
          }
        >
          Notifications
        </NavLink>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-destructive flex items-center justify-between">
            <span>Failed to load settings: {error}</span>
            <Button size="sm" variant="outline" onClick={reload}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {loading || !local ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-3">
            <NotificationToggle
              label="DSR reminders"
              description="Email reminders for pending data subject requests."
              checked={local.dsr_reminders}
              onChange={(v) => update('dsr_reminders', v)}
            />
            <NotificationToggle
              label="Incident alerts"
              description="Alerts for new or updated incidents."
              checked={local.incident_alerts}
              onChange={(v) => update('incident_alerts', v)}
            />
            <NotificationToggle
              label="DPIA approvals"
              description="Notifications when DPIAs require or receive approval."
              checked={local.dpia_approvals}
              onChange={(v) => update('dpia_approvals', v)}
            />
            <NotificationToggle
              label="Task reminders"
              description="Reminders for upcoming or overdue tasks."
              checked={local.task_reminders}
              onChange={(v) => update('task_reminders', v)}
            />
            <NotificationToggle
              label="System alerts"
              description="System-level notifications for platform events."
              checked={local.system_alerts}
              onChange={(v) => update('system_alerts', v)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={reload} disabled={loading}>Reset</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <EmailPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
};

export default NotificationSettingsPage;
