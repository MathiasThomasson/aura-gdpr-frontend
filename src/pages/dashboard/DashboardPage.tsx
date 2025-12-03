import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Download, AlertCircle } from 'lucide-react';
import { useDashboardMockData } from '@/features/dashboard/hooks/useDashboardMockData';
import KpiGrid from '@/features/dashboard/components/KpiGrid';
import DeadlinesPanel from '@/features/dashboard/components/DeadlinesPanel';
import AiInsightsPanel from '@/features/dashboard/components/AiInsightsPanel';
import RecentActivityPanel from '@/features/dashboard/components/RecentActivityPanel';
import RiskOverviewPanel from '@/features/dashboard/components/RiskOverviewPanel';
import GettingStartedChecklist from '@/features/dashboard/components/GettingStartedChecklist';
import { useSystemStatus } from '@/contexts/SystemContext';
import useDashboardSummary from '@/hooks/useDashboardSummary';
import { DashboardSummary, RiskOverview } from '@/features/dashboard/types';

const emptySummary: DashboardSummary = {
  complianceScore: 0,
  openDsrs: 0,
  policiesExpiringSoon: 0,
  ongoingDpiaCount: 0,
  activeIncidents: 0,
  overallRiskLevel: 'medium',
};

const DashboardPage: React.FC = () => {
  const { demoMode } = useSystemStatus();
  const mockData = useDashboardMockData();
  const { data: summaryData, loading, error, reload } = useDashboardSummary();

  const usingDemoData = demoMode;
  const summary: DashboardSummary = usingDemoData ? mockData.summary : summaryData ?? emptySummary;
  const riskOverview: RiskOverview = usingDemoData
    ? mockData.riskOverview
    : {
        overallRiskLevel: summary.overallRiskLevel,
        highRiskSystems: [],
        openIncidents: summary.activeIncidents,
        dpiaRequiredCount: summary.ongoingDpiaCount,
      };
  const deadlines = usingDemoData ? mockData.deadlines : [];
  const activities = usingDemoData ? mockData.activities : [];
  const aiInsights = usingDemoData ? mockData.aiInsights : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">This is your GDPR control center.</p>
          <p className="text-sm text-slate-600">See open risks, ongoing requests, and key compliance indicators at a glance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reload} disabled={loading || usingDemoData}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {usingDemoData && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4" />
          Demo mode is active. Showing sample dashboard data.
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Dashboard guidance</h3>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
          <li>Global GDPR overview shows live posture across all modules.</li>
          <li>Compliance score explains how close you are to meeting baseline controls.</li>
          <li>Open tasks highlight the next actions to reduce risk.</li>
          <li>Deadlines overview surfaces upcoming due dates for DSRs, DPIAs, and reviews.</li>
          <li>Modules live in the left navigation: DSRs, Documents, ROPA, DPIA, Incidents, Policies, Settings.</li>
        </ul>
      </div>

      {!usingDemoData && error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <section aria-label="Key metrics and onboarding" className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <KpiGrid summary={summary} />
          </div>
          <GettingStartedChecklist />
        </div>
      </section>

      <section aria-label="Deadlines and AI insights" className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DeadlinesPanel deadlines={deadlines} />
          </div>
          <AiInsightsPanel insights={aiInsights} />
        </div>
      </section>

      <section aria-label="Activity and risk" className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivityPanel activities={activities} />
          </div>
          <RiskOverviewPanel risk={riskOverview} />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
