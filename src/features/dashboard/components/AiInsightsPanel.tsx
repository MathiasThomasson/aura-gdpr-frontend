import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiInsight } from '../types';
import { cn } from '@/lib/utils';

type AiInsightsPanelProps = {
  insights: AiInsight[];
};

const severityStyles: Record<AiInsight['severity'], string> = {
  info: 'bg-sky-50 text-sky-700 border-sky-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  critical: 'bg-rose-50 text-rose-700 border-rose-100',
};

const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({ insights }) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">AI insights</CardTitle>
          <p className="text-sm text-slate-500">Recommendations to improve your GDPR posture.</p>
        </div>
        <Sparkles className="h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-300"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
              </div>
              <span
                className={cn(
                  'rounded-full border px-2.5 py-1 text-xs font-semibold capitalize',
                  severityStyles[insight.severity]
                )}
              >
                {insight.severity}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{insight.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AiInsightsPanel;
