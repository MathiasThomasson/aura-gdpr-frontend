import React from 'react';
import { AuditRecommendation, AuditAreaKey } from '../types';

type Props = {
  recommendations: AuditRecommendation[];
};

const areaLabels: Record<AuditAreaKey, string> = {
  dsr: 'Data subject requests',
  policies: 'Policies',
  documents: 'Documents',
  dpia: 'DPIA',
  ropa: 'ROPA',
  incidents: 'Incidents',
  security_measures: 'Security measures',
};

const severityStyles: Record<AuditRecommendation['severity'], string> = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
};

const RecommendationsList: React.FC<Props> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return <p className="text-sm text-muted-foreground">No recommendations. You are all set.</p>;
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec) => (
        <div key={rec.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                {areaLabels[rec.area]}
              </span>
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${severityStyles[rec.severity]}`}>
                {rec.severity} priority
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">{rec.title}</p>
          <p className="text-sm text-slate-700">{rec.description}</p>
          {rec.estimatedImpact && <p className="text-xs text-slate-500">Impact: {rec.estimatedImpact}</p>}
        </div>
      ))}
    </div>
  );
};

export default RecommendationsList;
