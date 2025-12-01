import React from 'react';
import { GaugeCircle, ListChecks, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiLoader from './AiLoader';
import AiError from './AiError';
import AiSourcesList from './AiSourcesList';
import { useAiAuditV2 } from '../hooks/useAiAuditV2';

const scoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-700';
  if (score >= 60) return 'text-amber-700';
  return 'text-rose-700';
};

const AiAuditV2Panel: React.FC = () => {
  const { result, loading, error, run } = useAiAuditV2();

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-sky-600" /> AI Audit v2
          </p>
          <p className="text-xs text-slate-500">Run a full AI audit across policies, DPIAs, ROPA, and incidents.</p>
        </div>
        <Button onClick={run} disabled={loading}>
          {loading ? 'Thinking...' : 'Run AI Audit'}
        </Button>
      </div>

      {loading && <AiLoader label="Running AI audit..." />}
      {error && <AiError message={error} />}

      {result && (
        <div className="space-y-4">
          <div className="flex items-baseline gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <GaugeCircle className="h-10 w-10 text-sky-600" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Overall score</p>
              <p className={`text-3xl font-bold ${scoreColor(result.overallScore)}`}>{result.overallScore}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {result.areas.map((area) => (
              <div key={area.id} className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{area.name}</p>
                  <span className="text-xs text-slate-500">Score: {area.score}</span>
                </div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{area.status.replace('_', ' ')}</p>
                <p className="text-sm text-slate-700">{area.summary}</p>
              </div>
            ))}
            {result.areas.length === 0 && <p className="text-sm text-slate-500">No area details returned.</p>}
          </div>

          {result.recommendations.length > 0 && (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ListChecks className="h-4 w-4 text-sky-600" /> Recommendations
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                {result.recommendations.map((rec, index) => (
                  <li key={`${rec}-${index}`}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <AiSourcesList sources={result.sources} />
        </div>
      )}
    </div>
  );
};

export default AiAuditV2Panel;
