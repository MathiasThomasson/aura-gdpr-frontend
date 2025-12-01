import React from 'react';
import { ShieldAlert, ShieldCheck, ShieldQuestion, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiLoader from './AiLoader';
import AiError from './AiError';
import { useAiRiskEngine } from '../hooks/useAiRiskEngine';
import type { RiskEvaluationParams } from '../risk';

const badgeMap: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-rose-100 text-rose-700 border-rose-200',
};

const iconMap: Record<string, React.ReactNode> = {
  low: <ShieldCheck className="h-4 w-4" />,
  medium: <Shield className="h-4 w-4" />,
  high: <ShieldAlert className="h-4 w-4" />,
  critical: <ShieldAlert className="h-4 w-4" />,
};

type Props = {
  title?: string;
  entityType: RiskEvaluationParams['entityType'];
  payload: RiskEvaluationParams['payload'];
  context?: string;
};

const AiRiskPanel: React.FC<Props> = ({ title = 'AI Risk Evaluation', entityType, payload, context }) => {
  const { result, loading, error, evaluate } = useAiRiskEngine();

  const handleEvaluate = async () => {
    await evaluate({ entityType, payload, context });
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">AI-estimated likelihood, impact, and recommendations.</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleEvaluate} disabled={loading}>
          {loading ? 'Thinking...' : 'Evaluate risk'}
        </Button>
      </div>

      {loading && <AiLoader label="Evaluating risk with AURA AI..." />}
      {error && <AiError message={error} />}

      {result && (
        <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badgeMap[result.overall]}`}>
              {iconMap[result.overall] ?? <ShieldQuestion className="h-4 w-4" />}
              Overall {result.overall}
            </span>
            <span className="text-xs text-slate-500">Likelihood: {result.likelihood} / 5</span>
            <span className="text-xs text-slate-500">Impact: {result.impact} / 5</span>
          </div>
          {result.explanation && <p className="text-sm text-slate-700">{result.explanation}</p>}
          {result.recommendations.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">Recommendations</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                {result.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiRiskPanel;
