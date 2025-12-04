import React from 'react';
import { Navigate } from 'react-router-dom';
import { Building2, FileSignature, Inbox, Loader2, ShieldAlert, Users } from 'lucide-react';
import api from '@/lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const formatDate = (value?: string) => {
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
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Platform</p>
        <h1 className="text-3xl font-semibold text-slate-900">Platform Admin</h1>
        <p className="text-sm text-slate-600">Global overview of all tenants.</p>
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
                  title="Tenants total"
                  value={overview?.total_tenants ?? 0}
                  icon={<Building2 className="h-5 w-5 text-slate-500" />}
                />
                <StatCard
                  title="Users total"
                  value={overview?.total_users ?? 0}
                  icon={<Users className="h-5 w-5 text-slate-500" />}
                />
                <StatCard
                  title="DSRs total"
                  value={overview?.total_dsrs ?? 0}
                  icon={<Inbox className="h-5 w-5 text-slate-500" />}
                />
                <StatCard
                  title="DPIAs total"
                  value={overview?.total_dpias ?? 0}
                  icon={<FileSignature className="h-5 w-5 text-slate-500" />}
                />
              </>
            )}
          </div>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-slate-900">Tenants</CardTitle>
                <CardDescription>List of all tenants across the platform.</CardDescription>
              </div>
              {loading && <Loader2 className="h-5 w-5 animate-spin text-slate-500" aria-label="Loading tenants" />}
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
                      <Skeleton className="col-span-4 h-4" />
                      <Skeleton className="col-span-3 h-4" />
                      <Skeleton className="col-span-3 h-4" />
                      <Skeleton className="col-span-2 h-4" />
                    </div>
                  ))}
                </div>
              ) : tenants.length === 0 ? (
                <p className="text-sm text-slate-600">No tenants found.</p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-3">Plan</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-2">Created</div>
                  </div>
                  <div className="divide-y divide-slate-200 bg-white">
                    {tenants.map((tenant) => (
                      <div key={tenant.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3">
                        <div className="col-span-4">
                          <p className="text-sm font-semibold text-slate-900">{tenant.name}</p>
                        </div>
                        <div className="col-span-3 text-sm text-slate-700">{tenant.plan}</div>
                        <div className="col-span-3 text-sm text-slate-700">{tenant.status}</div>
                        <div className="col-span-2 text-sm text-slate-700">{formatDate(tenant.created_at)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PlatformAdminPage;
