import React from 'react';

type Props = {
  score: number;
};

const tone = (score: number) => {
  if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
};

const SecurityScoreCard: React.FC<Props> = ({ score }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">Overall security score</p>
      <div className="mt-2 flex items-end gap-3">
        <p className="text-4xl font-semibold text-slate-900">{score}</p>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone(score)}`}>
          {score >= 80 ? 'Good' : score >= 50 ? 'Needs attention' : 'Critical'}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Higher scores indicate stronger technical and organisational measures.
      </p>
    </div>
  );
};

export default SecurityScoreCard;
