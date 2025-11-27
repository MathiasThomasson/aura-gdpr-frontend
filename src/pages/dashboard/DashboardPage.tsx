import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ClipboardList, Briefcase, MessageSquare, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import KpiCard from '@/components/dashboard/KpiCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyStateCard from '@/components/dashboard/EmptyStateCard';
import useDashboardSummary from '@/hooks/useDashboardSummary';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useDashboardSummary();

  const lastQuerySummary = React.useMemo(() => {
    if (!data?.last_ai_query) return 'No AI queries yet.';
    if (typeof data.last_ai_query === 'string') return data.last_ai_query;
    return data.last_ai_query.summary || data.last_ai_query.answer || data.last_ai_query.question || 'No AI queries yet.';
  }, [data]);

  const showGetStarted = data && (data.documents === 0 || data.projects === 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Tenant overview, activity, and system health."
        actions={
          <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        }
      />

      {error && (
        <Card className="border-destructive/40">
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-destructive">Failed to load dashboard: {error}</p>
              <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
            </div>
            <Button size="sm" onClick={reload}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Documents"
          value={data?.documents ?? '--'}
          icon={<FileText className="h-4 w-4 text-sky-500" />}
          loading={loading}
        />
        <KpiCard
          title="Open Tasks"
          value={data?.tasks ?? '--'}
          icon={<ClipboardList className="h-4 w-4 text-amber-500" />}
          loading={loading}
        />
        <KpiCard
          title="Active Projects"
          value={data?.projects ?? '--'}
          icon={<Briefcase className="h-4 w-4 text-emerald-500" />}
          loading={loading}
        />
        <KpiCard
          title="Last AI Query"
          value={loading ? '--' : lastQuerySummary}
          icon={<MessageSquare className="h-4 w-4 text-purple-500" />}
          description={!loading && typeof data?.last_ai_query !== 'undefined' ? 'Latest from AI assistant' : ''}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Backend health for this tenant.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            {loading ? (
              <div className="h-6 w-24 rounded bg-muted animate-pulse" />
            ) : (
              <StatusBadge status={data?.health_status} />
            )}
            {!loading && (
              <Badge variant="secondary" className="text-xs">
                API
              </Badge>
            )}
          </CardContent>
        </Card>

        {showGetStarted && (
          <EmptyStateCard
            title="Get Started"
            description={
              data?.documents === 0
                ? 'No documents yet. Upload your first policy or DPA to begin analysis.'
                : 'No projects yet. Create a project to organize processing activities.'
            }
            actionLabel={data?.documents === 0 ? 'Upload document' : 'Create project'}
            onAction={() => navigate('/app/documents')}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
