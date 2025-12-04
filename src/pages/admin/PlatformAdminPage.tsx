import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  Building2,
  FileSignature,
  Inbox,
  Loader2,
  ServerCog,
  ShieldAlert,
  Users,
  Zap,
} from 'lucide-react';
import api from '@/lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PlatformOverviewResponse, PlatformTenantListItem } from '@/types/admin';

const platformOwnerEmailSet = new Set(
  (import.meta.env.VITE_PLATFORM_OWNER_EMAILS ?? 'owner1@aura-gdpr.se,admin@aura-gdpr.se')
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean)
);

const formatDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </CardContent>
  </Card>
);

const PlatformAdminPage: React.FC = () => {
  const { user } = useAuth() as { user?: { email?: string; isPlatformOwner?: boolean } };
  const { toast } = useToast();
  const [overview, setOverview] = React.useState<PlatformOverviewResponse | null>(null);
  const [tenants, setTenants] = React.useState<PlatformTenantListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>('overview');
  const [tenantSearch, setTenantSearch] = React.useState('');
  const [selectedTenantId, setSelectedTenantId] = React.useState<number | null>(null);
  const [selectedTenant, setSelectedTenant] = React.useState<PlatformTenantListItem | null>(null);
  const [tenantDetailLoading, setTenantDetailLoading] = React.useState(false);
  const [tenantDetailError, setTenantDetailError] = React.useState<string | null>(null);

  const emailNormalized = user?.email?.toLowerCase() ?? '';
  const isPlatformAdmin = Boolean(user?.isPlatformOwner || platformOwnerEmailSet.has(emailNormalized));

  React.useEffect(() => {
    if (!isPlatformAdmin) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      setAccessDenied(false);
      try {
        const [overviewRes, tenantsRes] = await Promise.all([
          api.get<PlatformOverviewResponse>('/api/admin/platform/overview', {
            validateStatus: (status) => (status >= 200 && status < 300) || status === 403,
          }),
          api.get<PlatformTenantListItem[]>('/api/admin/platform/tenants', {
            validateStatus: (status) => (status >= 200 && status < 300) || status === 403,
          }),
        ]);

        if (overviewRes.status === 403 || tenantsRes.status === 403) {
          setAccessDenied(true);
          setOverview(null);
          setTenants([]);
          return;
        }

        setOverview(overviewRes.data ?? null);
        setTenants(Array.isArray(tenantsRes.data) ? tenantsRes.data : []);
      } catch (err: any) {
        const message = err?.message ?? 'Failed to load platform overview.';
        setError(message);
        toast({
          variant: 'destructive',
          title: 'Failed to load data',
          description: message,
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isPlatformAdmin, toast]);

  if (!isPlatformAdmin) {
    toast({
      variant: 'destructive',
      title: 'Access denied',
      description: 'You are not allowed to access the platform admin console.',
    });
    return <Navigate to="/app/dashboard" replace />;
  }

  const filteredTenants = tenants.filter((t) => {
    const q = tenantSearch.toLowerCase().trim();
    if (!q) return true;
    return `${t.name} ${t.id}`.toLowerCase().includes(q);
  });

  const systemHealth = overview?.system_health ?? {};
  const closeTenantDetail = () => {
    setSelectedTenantId(null);
    setSelectedTenant(null);
    setTenantDetailError(null);
  };

  const openTenantDetail = async (tenantId: number) => {
    setSelectedTenantId(tenantId);
    setTenantDetailLoading(true);
    setTenantDetailError(null);
    try {
      const res = await api.get<PlatformTenantListItem>(`/api/admin/platform/tenants/${tenantId}`);
      const detail = res.data ?? null;
      setSelectedTenant(detail);
    } catch (err: any) {
      setTenantDetailError(err?.message ?? 'Failed to load tenant detail');
      setSelectedTenant(null);
    } finally {
      setTenantDetailLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">Platform Admin Console</p>
            <p className="text-sm text-amber-800">
              You are in the Platform Admin Console. Changes here affect all tenants.
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Platform</p>
        <h1 className="text-3xl font-semibold text-slate-900">Platform Admin</h1>
        <p className="text-sm text-slate-600">Manage tenants, billing, usage, and global settings.</p>
      </div>

      {accessDenied ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="rounded-full bg-white p-2 text-amber-600 shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg text-amber-900">Access denied</CardTitle>
              <CardDescription className="text-amber-800">
                You do not have access to the Platform Admin area.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {[
              'overview',
              'tenants',
              'users',
              'billing',
              'paypal',
              'ai',
              'logs',
              'webhooks',
              'flags',
            ].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'secondary'}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === 'ai' ? 'AI Usage' : tab === 'flags' ? 'Feature Flags' : tab}
              </Button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                  <>
                    {[0, 1, 2, 3].map((idx) => (
                      <Card key={`stat-skeleton-${idx}`} className="shadow-sm">
                        <CardHeader className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-16" />
                        </CardHeader>
                      </Card>
                    ))}
                  </>
                ) : (
                  <>
                    <StatCard
                      title="Total tenants"
                      value={overview?.total_tenants ?? 0}
                      icon={<Building2 className="h-5 w-5 text-slate-500" />}
                    />
                    <StatCard
                      title="Total users"
                      value={overview?.total_users ?? 0}
                      icon={<Users className="h-5 w-5 text-slate-500" />}
                    />
                    <StatCard
                      title="Active subscriptions"
                      value={overview?.active_subscriptions ?? 0}
                      icon={<FileSignature className="h-5 w-5 text-slate-500" />}
                    />
                    <StatCard
                      title="MRR (EUR)"
                      value={(overview?.mrr_eur ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      icon={<Zap className="h-5 w-5 text-slate-500" />}
                    />
                  </>
                )}
              </div>

              <Card className="shadow-sm">
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">System health</CardTitle>
                    <CardDescription>Current backend and database status.</CardDescription>
                  </div>
                  {loading && <Loader2 className="h-5 w-5 animate-spin text-slate-500" />}
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Badge variant="secondary">
                    Backend:{' '}
                    <span className="ml-1 font-semibold">
                      {systemHealth.backend ? systemHealth.backend.toUpperCase() : 'UNKNOWN'}
                    </span>
                  </Badge>
                  <Badge variant="secondary">
                    Database:{' '}
                    <span className="ml-1 font-semibold">
                      {systemHealth.database ? systemHealth.database.toUpperCase() : 'UNKNOWN'}
                    </span>
                  </Badge>
                  {systemHealth.last_deploy && (
                    <Badge variant="secondary">Last deploy: {formatDate(systemHealth.last_deploy)}</Badge>
                  )}
                  {systemHealth.git_sha && <Badge variant="secondary">Git: {systemHealth.git_sha}</Badge>}
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>New tenants (12 mo)</CardTitle>
                    <CardDescription>Monthly tenant signup trend.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-32 w-full" />
                    ) : (
                      <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                        Chart placeholder
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>AI tokens (6 mo)</CardTitle>
                    <CardDescription>Usage trend across tenants.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-32 w-full" />
                    ) : (
                      <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                        Chart placeholder
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <Card className="shadow-sm">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900">Tenants</CardTitle>
                  <CardDescription>List of all tenants across the platform.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search tenants..."
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={tenantSearch}
                    onChange={(e) => setTenantSearch(e.target.value)}
                  />
                  {loading && <Loader2 className="h-5 w-5 animate-spin text-slate-500" aria-label="Loading tenants" />}
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="space-y-2">
                    {[0, 1, 2].map((idx) => (
                      <div
                        key={`tenant-skeleton-${idx}`}
                        className="grid grid-cols-12 items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                      >
                        <Skeleton className="col-span-3 h-4" />
                        <Skeleton className="col-span-2 h-4" />
                        <Skeleton className="col-span-2 h-4" />
                        <Skeleton className="col-span-2 h-4" />
                        <Skeleton className="col-span-3 h-8" />
                      </div>
                    ))}
                  </div>
                ) : filteredTenants.length === 0 ? (
                  <p className="text-sm text-slate-600">No tenants found.</p>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <div className="col-span-3">Name</div>
                      <div className="col-span-2">Plan</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Created</div>
                      <div className="col-span-3">Actions</div>
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                      {filteredTenants.map((tenant) => (
                        <div key={tenant.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3">
                          <div className="col-span-3">
                            <p className="text-sm font-semibold text-slate-900">{tenant.name}</p>
                            <p className="text-xs text-slate-500">ID: {tenant.id}</p>
                          </div>
                          <div className="col-span-2 text-sm text-slate-700">{tenant.plan}</div>
                          <div className="col-span-2 text-sm text-slate-700">{tenant.status}</div>
                          <div className="col-span-2 text-sm text-slate-700">{formatDate(tenant.created_at)}</div>
                      <div className="col-span-3 flex flex-wrap gap-2">
                            <Button size="sm" variant="secondary" onClick={() => openTenantDetail(tenant.id as number)}>
                              View
                            </Button>
                            <Button size="sm" variant="secondary" disabled>
                              Impersonate (coming soon)
                            </Button>
                            <Button size="sm" variant="destructive" disabled>
                              Suspend (coming soon)
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'users' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Global user view (coming soon).</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                  Global user inspection and disable/enable controls will appear here.
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Billing & Plans</CardTitle>
                <CardDescription>Manage subscription plans and per-tenant billing.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                  Plan configuration and tenant billing details will appear here.
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'paypal' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>PayPal Integration</CardTitle>
                <CardDescription>Configure PayPal credentials and monitor webhooks.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                  PayPal API configuration and webhook monitoring will appear here.
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'ai' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>AI Usage & Limits</CardTitle>
                <CardDescription>Monitor AI token usage and set per-tenant limits.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                  AI usage summaries and limit controls will appear here.
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'logs' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Logs & Monitoring</CardTitle>
                <CardDescription>Inspect platform logs and background jobs.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                  Log streams and job status dashboards will appear here.
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'webhooks' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Webhooks & API Keys</CardTitle>
                <CardDescription>Manage outgoing webhooks and partner API keys.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                  Webhook configuration and API key management will appear here.
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'flags' && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Feature Flags & Config</CardTitle>
                <CardDescription>Toggle features and adjust global configuration.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                  Feature flags and global configuration controls will appear here.
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {selectedTenantId !== null && (
        <div className="fixed inset-0 z-40 flex items-start justify-end bg-black/30">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Tenant detail</p>
                <h3 className="text-lg font-semibold text-slate-900">Tenant #{selectedTenantId}</h3>
              </div>
              <Button size="sm" variant="secondary" onClick={closeTenantDetail}>
                Close
              </Button>
            </div>
            <div className="space-y-3 p-4">
              {tenantDetailLoading ? (
                <>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </>
              ) : tenantDetailError ? (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {tenantDetailError}
                </div>
              ) : selectedTenant ? (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">Name</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedTenant.name}</p>
                    <p className="text-xs text-slate-500">ID: {selectedTenant.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Plan</p>
                      <p className="font-semibold text-slate-900">{selectedTenant.plan}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
                      <p className="font-semibold text-slate-900">{selectedTenant.status}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Created</p>
                      <p className="font-semibold text-slate-900">{formatDate(selectedTenant.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Users</p>
                      <p className="font-semibold text-slate-900">{selectedTenant.users ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Next billing</p>
                      <p className="font-semibold text-slate-900">
                        {formatDate(selectedTenant.next_billing_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Contact email</p>
                      <p className="font-semibold text-slate-900">{selectedTenant.contact_email ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">PayPal subscription</p>
                      <p className="font-semibold text-slate-900">{selectedTenant.paypal_subscription_id ?? '—'}</p>
                    </div>
                  </div>
                  <div className="rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-600">
                    Tenant-level actions (impersonate, suspend, billing) will be added here. Feature flags:{' '}
                    {selectedTenant.feature_flags
                      ? JSON.stringify(selectedTenant.feature_flags)
                      : 'n/a'}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-600">No tenant detail.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformAdminPage;
