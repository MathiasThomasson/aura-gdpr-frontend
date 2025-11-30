import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Download } from 'lucide-react';
import { useDashboardMockData } from '@/features/dashboard/hooks/useDashboardMockData';
import KpiGrid from '@/features/dashboard/components/KpiGrid';
import DeadlinesPanel from '@/features/dashboard/components/DeadlinesPanel';
import AiInsightsPanel from '@/features/dashboard/components/AiInsightsPanel';
import RecentActivityPanel from '@/features/dashboard/components/RecentActivityPanel';
import RiskOverviewPanel from '@/features/dashboard/components/RiskOverviewPanel';

const DashboardPage: React.FC = () => {
  const { summary, deadlines, activities, aiInsights, riskOverview } = useDashboardMockData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Data-driven overview of your GDPR compliance posture.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <section aria-label="Key metrics">
        <KpiGrid summary={summary} />
      </section>

      <section aria-label="Deadlines and AI insights">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DeadlinesPanel deadlines={deadlines} />
          </div>
          <AiInsightsPanel insights={aiInsights} />
        </div>
      </section>

      <section aria-label="Activity and risk">
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
