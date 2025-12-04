import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  AlertTriangle,
  Ban,
  BarChart3,
  Building2,
  CheckCircle2,
  FileSignature,
  Inbox,
  Loader2,
  ServerCog,
  ShieldAlert,
  UserMinus,
  UserPlus,
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
import {
  PlatformOverviewResponse,
  PlatformTenantListItem,
  PlatformUserItem,
  PlatformPlan,
  PayPalConfig,
  PayPalWebhookEvent,
  AIUsageSummary,
  LogItem,
  JobStatus,
  WebhookItem,
  ApiKeyItem,
  FeatureFlagItem,
  GlobalConfig,
} from '@/types/admin';

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
  const [users, setUsers] = React.useState<PlatformUserItem[]>([]);
  const [usersLoading, setUsersLoading] = React.useState(false);
  const [usersError, setUsersError] = React.useState<string | null>(null);
  const [userSearch, setUserSearch] = React.useState('');
  const [plans, setPlans] = React.useState<PlatformPlan[]>([]);
  const [plansLoading, setPlansLoading] = React.useState(false);
  const [plansError, setPlansError] = React.useState<string | null>(null);
  const [paypalConfig, setPaypalConfig] = React.useState<PayPalConfig | null>(null);
  const [paypalEvents, setPaypalEvents] = React.useState<PayPalWebhookEvent[]>([]);
  const [paypalLoading, setPaypalLoading] = React.useState(false);
  const [paypalError, setPaypalError] = React.useState<string | null>(null);
  const [aiUsage, setAiUsage] = React.useState<AIUsageSummary | null>(null);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [logs, setLogs] = React.useState<LogItem[]>([]);
  const [jobs, setJobs] = React.useState<JobStatus[]>([]);
  const [logsLoading, setLogsLoading] = React.useState(false);
  const [logsError, setLogsError] = React.useState<string | null>(null);
  const [webhooks, setWebhooks] = React.useState<WebhookItem[]>([]);
  const [webhooksLoading, setWebhooksLoading] = React.useState(false);
  const [webhooksError, setWebhooksError] = React.useState<string | null>(null);
  const [apiKeys, setApiKeys] = React.useState<ApiKeyItem[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = React.useState(false);
  const [apiKeysError, setApiKeysError] = React.useState<string | null>(null);
  const [featureFlags, setFeatureFlags] = React.useState<FeatureFlagItem[]>([]);
  const [config, setConfig] = React.useState<GlobalConfig | null>(null);
  const [flagsLoading, setFlagsLoading] = React.useState(false);
  const [flagsError, setFlagsError] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    if (!isPlatformAdmin) return;
    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const res = await api.get<PlatformUserItem[]>('/api/admin/platform/users', {
          validateStatus: (s) => (s >= 200 && s < 300) || s === 403,
        });
        if (res.status === 403) {
          setUsers([]);
          setUsersError('Access denied');
          return;
        }
        setUsers(res.data ?? []);
      } catch (err: any) {
        setUsersError(err?.message ?? 'Failed to load users');
      } finally {
        setUsersLoading(false);
      }
    };
    const loadPlans = async () => {
      setPlansLoading(true);
      setPlansError(null);
      try {
        const res = await api.get<PlatformPlan[]>('/api/admin/platform/plans');
        setPlans(res.data ?? []);
      } catch (err: any) {
        setPlansError(err?.message ?? 'Failed to load plans');
      } finally {
        setPlansLoading(false);
      }
    };
    const loadPaypal = async () => {
      setPaypalLoading(true);
      setPaypalError(null);
      try {
        const [cfg, events] = await Promise.all([
          api.get<PayPalConfig>('/api/admin/platform/paypal/config'),
          api.get<PayPalWebhookEvent[]>('/api/admin/platform/paypal/webhook-events'),
        ]);
        setPaypalConfig(cfg.data ?? null);
        setPaypalEvents(events.data ?? []);
      } catch (err: any) {
        setPaypalError(err?.message ?? 'Failed to load PayPal data');
      } finally {
        setPaypalLoading(false);
      }
    };
    const loadAi = async () => {
      setAiLoading(true);
      setAiError(null);
      try {
        const res = await api.get<AIUsageSummary>('/api/admin/platform/ai/usage');
        setAiUsage(res.data ?? null);
      } catch (err: any) {
        setAiError(err?.message ?? 'Failed to load AI usage');
      } finally {
        setAiLoading(false);
      }
    };
    const loadLogs = async () => {
      setLogsLoading(true);
      setLogsError(null);
      try {
        const [logRes, jobRes] = await Promise.all([
          api.get<LogItem[]>('/api/admin/platform/logs'),
          api.get<JobStatus[]>('/api/admin/platform/jobs'),
        ]);
        setLogs(logRes.data ?? []);
        setJobs(jobRes.data ?? []);
      } catch (err: any) {
        setLogsError(err?.message ?? 'Failed to load logs/jobs');
      } finally {
        setLogsLoading(false);
      }
    };
    const loadWebhooks = async () => {
      setWebhooksLoading(true);
      setWebhooksError(null);
      try {
        const [whRes, apiKeyRes, flagsRes, cfgRes] = await Promise.all([
          api.get<WebhookItem[]>('/api/admin/platform/webhooks'),
          api.get<ApiKeyItem[]>('/api/admin/platform/api-keys'),
          api.get<FeatureFlagItem[]>('/api/admin/platform/feature-flags'),
          api.get<GlobalConfig>('/api/admin/platform/config'),
        ]);
        setWebhooks(whRes.data ?? []);
        setApiKeys(apiKeyRes.data ?? []);
        setFeatureFlags(flagsRes.data ?? []);
        setConfig(cfgRes.data ?? null);
      } catch (err: any) {
        setWebhooksError(err?.message ?? 'Failed to load webhooks/API keys/config');
      } finally {
        setWebhooksLoading(false);
        setFlagsLoading(false);
      }
    };

    loadUsers();
    loadPlans();
    loadPaypal();
    loadAi();
    loadLogs();
    loadWebhooks();
  }, [isPlatformAdmin]);

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
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Global user view across all tenants.</CardDescription>
                  </div>
                  <input
                    type="text"
                    placeholder="Search email..."
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {usersError && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {usersError}
                  </div>
                )}
                {usersLoading ? (
                  <div className="space-y-2">
                    {[0, 1, 2].map((idx) => (
                      <div key={`user-skel-${idx}`} className="grid grid-cols-12 gap-3 rounded-md border p-3">
                        <Skeleton className="col-span-4 h-4" />
                        <Skeleton className="col-span-2 h-4" />
                        <Skeleton className="col-span-3 h-4" />
                        <Skeleton className="col-span-2 h-4" />
                        <Skeleton className="col-span-1 h-8" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <div className="col-span-4">Email</div>
                      <div className="col-span-2">Role</div>
                      <div className="col-span-3">Tenant</div>
                      <div className="col-span-2">Last login</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                      {users
                        .filter((u) =>
                          userSearch ? u.email.toLowerCase().includes(userSearch.toLowerCase()) : true
                        )
                        .map((u) => (
                          <div key={u.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3 text-sm">
                            <div className="col-span-4">
                              <p className="font-semibold text-slate-900">{u.email}</p>
                              <p className="text-xs text-slate-500">ID: {u.id}</p>
                            </div>
                            <div className="col-span-2 text-slate-700">{u.role}</div>
                            <div className="col-span-3 text-slate-700">{u.tenant_name ?? '—'}</div>
                            <div className="col-span-2 text-slate-700">{u.last_login_at ?? '—'}</div>
                            <div className="col-span-1 flex gap-1">
                              <Button size="sm" variant="ghost" disabled>
                                View
                              </Button>
                              {u.status === 'active' ? (
                                <Button size="sm" variant="destructive" disabled>
                                  <UserMinus className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="secondary" disabled>
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
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
                {plansError && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {plansError}
                  </div>
                )}
                {plansLoading ? (
                  <div className="space-y-2">
                    {[0, 1].map((idx) => (
                      <div key={`plan-skel-${idx}`} className="grid grid-cols-6 gap-3 rounded-md border p-3">
                        <Skeleton className="col-span-2 h-4" />
                        <Skeleton className="col-span-1 h-4" />
                        <Skeleton className="col-span-1 h-4" />
                        <Skeleton className="col-span-2 h-4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <div className="grid grid-cols-6 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <div className="col-span-2">Plan</div>
                      <div className="col-span-1">Monthly</div>
                      <div className="col-span-1">Yearly</div>
                      <div className="col-span-2">Features</div>
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                      {plans.map((p) => (
                        <div key={p.id} className="grid grid-cols-6 items-center gap-3 px-4 py-3 text-sm">
                          <div className="col-span-2">
                            <p className="font-semibold text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-500">AI tokens: {p.included_ai_tokens}</p>
                          </div>
                          <div className="col-span-1 text-slate-700">€{p.monthly_price_eur}</div>
                          <div className="col-span-1 text-slate-700">€{p.yearly_price_eur}</div>
                          <div className="col-span-2 text-slate-700 text-xs">
                            {p.features?.length ? p.features.join(', ') : '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-3 rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-600">
                  Tenant billing detail and resync actions will appear here.
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
                {paypalError && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {paypalError}
                  </div>
                )}
                <div className="rounded-md border border-slate-200 p-3 text-sm">
                  {paypalLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900">Mode: {paypalConfig?.mode ?? 'n/a'}</p>
                      <p className="text-slate-700">Client ID: {paypalConfig?.client_id_masked ?? '—'}</p>
                      <p className="text-slate-700">Webhook ID: {paypalConfig?.webhook_id ?? '—'}</p>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="secondary" disabled>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" disabled>
                          Test connection
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-800">Webhook events</p>
                  <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
                    <div className="grid grid-cols-5 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <div>ID</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div>Received</div>
                      <div>Message</div>
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                      {paypalEvents.map((e) => (
                        <div key={e.event_id} className="grid grid-cols-5 gap-2 px-3 py-2 text-xs text-slate-700">
                          <div className="truncate">{e.event_id}</div>
                          <div>{e.event_type}</div>
                          <div>{e.status}</div>
                          <div>{formatDate(e.received_at)}</div>
                          <div className="truncate">{e.message ?? '—'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                {aiError && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {aiError}
                  </div>
                )}
                {aiLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <div className="rounded-md border border-slate-200 p-3 text-sm">
                    <div className="flex flex-wrap gap-4 text-sm text-slate-800">
                      <span>24h: {aiUsage?.tokens_24h ?? 0} tokens</span>
                      <span>7d: {aiUsage?.tokens_7d ?? 0} tokens</span>
                      <span>30d: {aiUsage?.tokens_30d ?? 0} tokens</span>
                      <span>Cost est: €{aiUsage?.cost_eur_estimate ?? 0}</span>
                    </div>
                    <div className="mt-3 rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-600">
                      Per-tenant usage and limit controls will appear here.
                    </div>
                  </div>
                )}
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
                {logsError && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {logsError}
                  </div>
                )}
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <div className="grid grid-cols-5 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <div>Time</div>
                    <div>Level</div>
                    <div>Service</div>
                    <div>Tenant</div>
                    <div>Message</div>
                  </div>
                  <div className="divide-y divide-slate-200 bg-white text-xs">
                    {logsLoading ? (
                      <div className="p-3">
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ) : logs.length === 0 ? (
                      <div className="p-3 text-slate-600">No logs.</div>
                    ) : (
                      logs.map((log, idx) => (
                        <div key={`${log.timestamp}-${idx}`} className="grid grid-cols-5 gap-2 px-3 py-2">
                          <div>{formatDate(log.timestamp)}</div>
                          <div>{log.level}</div>
                          <div>{log.service}</div>
                          <div>{log.tenant_id ?? '—'}</div>
                          <div className="truncate">{log.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-800">Jobs</p>
                  <div className="mt-2 grid gap-2 md:grid-cols-3">
                    {jobs.map((job) => (
                      <Card key={job.name}>
                        <CardHeader>
                          <CardTitle className="text-sm">{job.name}</CardTitle>
                          <CardDescription className="text-xs">
                            Last run: {job.last_run ? formatDate(job.last_run) : 'n/a'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <div className="flex items-center gap-2">
                            {job.status === 'ok' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Ban className="h-4 w-4 text-rose-600" />
                            )}
                            <span className="font-semibold text-slate-900">{job.status}</span>
                          </div>
                          <p className="text-xs text-slate-600">{job.message ?? '—'}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                {webhooksError && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {webhooksError}
                  </div>
                )}
                <div className="rounded-md border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">Webhooks</p>
                    <Button size="sm" variant="secondary" disabled>
                      Add webhook
                    </Button>
                  </div>
                  <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 text-sm">
                    <div className="grid grid-cols-5 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <div>Name</div>
                      <div>Target</div>
                      <div>Events</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                      {webhooksLoading ? (
                        <div className="p-3">
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ) : webhooks.length === 0 ? (
                        <div className="p-3 text-slate-600 text-xs">No webhooks.</div>
                      ) : (
                        webhooks.map((wh) => (
                          <div key={wh.id} className="grid grid-cols-5 gap-2 px-3 py-2 text-xs text-slate-700">
                            <div className="font-semibold text-slate-900">{wh.name}</div>
                            <div className="truncate">{wh.target_url}</div>
                            <div>{wh.events.join(', ')}</div>
                            <div>{wh.status}</div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" disabled>
                                Edit
                              </Button>
                              <Button size="sm" variant="ghost" disabled>
                                Test
                              </Button>
                              <Button size="sm" variant="destructive" disabled>
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-md border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">API Keys</p>
                    <Button size="sm" variant="secondary" disabled>
                      Create key
                    </Button>
                  </div>
                  <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 text-sm">
                    <div className="grid grid-cols-6 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <div>Name</div>
                      <div>Key ID</div>
                      <div>Scopes</div>
                      <div>Created</div>
                      <div>Last used</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                      {apiKeysLoading ? (
                        <div className="p-3">
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ) : apiKeys.length === 0 ? (
                        <div className="p-3 text-slate-600 text-xs">No API keys.</div>
                      ) : (
                        apiKeys.map((k) => (
                          <div key={k.id} className="grid grid-cols-6 gap-2 px-3 py-2 text-xs text-slate-700">
                            <div className="font-semibold text-slate-900">{k.name}</div>
                            <div>{k.key_id}</div>
                            <div>{k.scopes.join(', ')}</div>
                            <div>{formatDate(k.created_at)}</div>
                            <div>{k.last_used ? formatDate(k.last_used) : '—'}</div>
                            <div>{k.status}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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
                {flagsError && (
                  <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {flagsError}
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-md border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">Feature flags</p>
                      <Button size="sm" variant="secondary" disabled>
                        Save
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {flagsLoading ? (
                        <Skeleton className="h-20 w-full" />
                      ) : featureFlags.length === 0 ? (
                        <p className="text-xs text-slate-600">No flags.</p>
                      ) : (
                        featureFlags.map((f) => (
                          <div key={f.name} className="rounded border border-slate-200 p-2 text-sm">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-900">{f.name}</p>
                                <p className="text-xs text-slate-600">{f.description ?? '—'}</p>
                              </div>
                              <Badge variant={f.status ? 'default' : 'secondary'}>
                                {f.status ? 'On' : 'Off'}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 p-3 text-sm">
                    <p className="text-sm font-semibold text-slate-800">Global config</p>
                    {flagsLoading ? (
                      <Skeleton className="h-24 w-full" />
                    ) : (
                      <div className="mt-2 space-y-2">
                        <p>Default AI model: {config?.default_ai_model ?? 'gpt-4o'}</p>
                        <p>Max upload size: {config?.max_upload_mb ?? 20} MB</p>
                        <p>Global rate limit: {config?.global_rate_limit_rpm ?? 1000} rpm</p>
                        <p>DSR deadline: {config?.dsr_default_deadline_days ?? 30} days</p>
                        <p>Monthly audit day: {config?.monthly_audit_day ?? 1}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" disabled>
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
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
