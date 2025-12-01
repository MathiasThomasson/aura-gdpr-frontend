import React from 'react';
import AuditSummaryCard from './components/AuditSummaryCard';
import AuditAreaCard from './components/AuditAreaCard';
import RecommendationsList from './components/RecommendationsList';
import AuditHistoryTable from './components/AuditHistoryTable';
import RunAuditButton from './components/RunAuditButton';
import useAiAuditMockData from './hooks/useAiAuditMockData';

const AiAuditPage: React.FC = () => {
  const { latestRun, history, isRunning, runAudit } = useAiAuditMockData();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">AI Audit Engine</h1>
          <p className="text-sm text-slate-600">
            Get an AI-generated overview of your GDPR compliance and prioritized recommendations.
          </p>
        </div>
        <RunAuditButton onRun={runAudit} isRunning={isRunning} />
      </div>

      {!latestRun ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
          <p className="font-semibold text-slate-800">No audit run yet</p>
          <p className="text-sm text-slate-600">Run your first AI audit to see compliance insights.</p>
          <div className="mt-4 flex justify-center">
            <RunAuditButton onRun={runAudit} isRunning={isRunning} />
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <AuditSummaryCard overallScore={latestRun.overallScore} lastRunAt={latestRun.completedAt} />
            </div>
            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Latest run</p>
              <p>
                Completed: {new Date(latestRun.completedAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-slate-600">
                The audit reviews key GDPR areas including DSR handling, policies, DPIA, ROPA, incidents, and security measures.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {latestRun.areas.map((area) => (
              <AuditAreaCard key={area.key} area={area} />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">AI recommendations</h2>
                  <p className="text-sm text-slate-600">Prioritized actions to improve compliance.</p>
                </div>
              </div>
              <RecommendationsList recommendations={latestRun.recommendations} />
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Recent audit runs</h2>
                  <p className="text-sm text-slate-600">History of recent AI audits.</p>
                </div>
              </div>
              <AuditHistoryTable history={history} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AiAuditPage;
