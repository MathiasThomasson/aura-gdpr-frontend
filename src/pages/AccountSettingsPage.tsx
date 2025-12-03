import React from 'react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/apiClient';

type TenantSettings = {
  companyName: string;
  contactEmail: string;
  publicDsrEnabled: boolean;
  publicDsrLink: string;
};

const AccountSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [tenantSettings, setTenantSettings] = React.useState<TenantSettings>({
    companyName: '',
    contactEmail: '',
    publicDsrEnabled: false,
    publicDsrLink: '',
  });
  const [systemSettings, setSystemSettings] = React.useState<string>('{}');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [savingTenant, setSavingTenant] = React.useState<boolean>(false);
  const [savingSystem, setSavingSystem] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tenantRes, systemRes] = await Promise.allSettled([
        api.get('/api/settings/tenant'),
        api.get('/api/settings'),
      ]);

      if (tenantRes.status === 'fulfilled') {
        const data = tenantRes.value.data ?? {};
        setTenantSettings({
          companyName: data.company_name ?? data.companyName ?? '',
          contactEmail: data.contact_email ?? data.contactEmail ?? '',
          publicDsrEnabled: Boolean(data.public_dsr_enabled ?? data.publicDsrEnabled),
          publicDsrLink: data.public_dsr_link ?? data.publicDsrLink ?? '',
        });
      }

      if (systemRes.status === 'fulfilled') {
        setSystemSettings(JSON.stringify(systemRes.value.data ?? {}, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const saveTenantSettings = async () => {
    setSavingTenant(true);
    try {
      await api.patch('/api/settings/tenant', {
        company_name: tenantSettings.companyName,
        contact_email: tenantSettings.contactEmail,
        public_dsr_enabled: tenantSettings.publicDsrEnabled,
        public_dsr_link: tenantSettings.publicDsrLink,
      });
      toast({ title: 'Tenant settings saved', description: 'Settings updated successfully.' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to save tenant settings',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setSavingTenant(false);
    }
  };

  const saveSystemSettings = async () => {
    setSavingSystem(true);
    try {
      const parsed = systemSettings.trim().length === 0 ? {} : JSON.parse(systemSettings);
      await api.patch('/api/settings', parsed);
      toast({ title: 'System settings saved', description: 'JSON configuration updated.' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Invalid settings',
        description: err instanceof Error ? err.message : 'Please provide valid JSON.',
      });
    } finally {
      setSavingSystem(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Settings"
        subtitle="Manage tenant details and system configuration."
        actions={
          <Button variant="outline" size="sm" onClick={load}>
            Reload
          </Button>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Keep tenant metadata and system flags up to date."
        bullets={[
          'Update company name and contact email for notices.',
          'Manage public DSR portal availability and link.',
          'Edit raw system settings as JSON for advanced configuration.',
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Tenant settings" subtitle="Workspace-level metadata for emails and the DSR portal.">
          {loading ? (
            <Skeleton className="h-32 w-full rounded-md" />
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  value={tenantSettings.companyName}
                  onChange={(e) => setTenantSettings((prev) => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={tenantSettings.contactEmail}
                  onChange={(e) => setTenantSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Public DSR portal</p>
                  <p className="text-xs text-slate-600">Enable to accept requests via the public link.</p>
                </div>
                <Switch
                  checked={tenantSettings.publicDsrEnabled}
                  onCheckedChange={(checked) => setTenantSettings((prev) => ({ ...prev, publicDsrEnabled: checked }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="publicLink">Public DSR link</Label>
                <Input
                  id="publicLink"
                  value={tenantSettings.publicDsrLink}
                  onChange={(e) => setTenantSettings((prev) => ({ ...prev, publicDsrLink: e.target.value }))}
                  placeholder="https://app.example.com/public/dsr/..."
                />
              </div>
              {error ? <p className="text-xs text-rose-600">{error}</p> : null}
              <Button size="sm" onClick={saveTenantSettings} disabled={savingTenant}>
                Save tenant settings
              </Button>
            </div>
          )}
        </Card>

        <Card title="System settings" subtitle="Advanced configuration as JSON key-value pairs.">
          {loading ? (
            <Skeleton className="h-40 w-full rounded-md" />
          ) : (
            <div className="space-y-2">
              <Textarea
                value={systemSettings}
                onChange={(e) => setSystemSettings(e.target.value)}
                rows={14}
                className="font-mono text-xs"
              />
              <Button size="sm" onClick={saveSystemSettings} disabled={savingSystem}>
                Save system settings
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
