import React from 'react';
import SecurityScoreCard from './components/SecurityScoreCard';
import SecurityKpiCard from './components/SecurityKpiCard';
import SecurityHeatmap from './components/SecurityHeatmap';
import SecurityIntegrationCard from './components/SecurityIntegrationCard';
import SecurityWarningsList from './components/SecurityWarningsList';
import SecurityEventsList from './components/SecurityEventsList';
import useSecurityHealthMockData from './hooks/useSecurityHealthMockData';

const SecurityHealthPage: React.FC = () => {
  const { score, kpis, controls, integrations, warnings, events, isLoading, isError } =
    useSecurityHealthMockData();

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading security health...</p>;
  }
  if (isError) {
    return <p className="p-6 text-sm text-red-600">Failed to load security health.</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Security health</h1>
        <p className="text-sm text-slate-600">Overview of your technical and organisational security posture.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <SecurityScoreCard score={score} />
        </div>
        <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
          {kpis.map((kpi) => (
            <SecurityKpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SecurityHeatmap controls={controls} />
        <div className="grid gap-3">
          {integrations.map((int) => (
            <SecurityIntegrationCard key={int.id} integration={int} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">System warnings</h2>
          <p className="text-sm text-slate-600">Actionable items detected by the security engine.</p>
          <div className="mt-3">
            <SecurityWarningsList warnings={warnings} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent security events</h2>
          <p className="text-sm text-slate-600">Latest security signals and activities.</p>
          <div className="mt-3">
            <SecurityEventsList events={events} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityHealthPage;
