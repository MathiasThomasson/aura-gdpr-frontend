import React from 'react';
import { AuditRun } from '../types';

type Props = {
  history: AuditRun[];
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const durationMs = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '—';
  const diff = Math.max(0, endDate.getTime() - startDate.getTime());
  return `${(diff / 1000).toFixed(1)}s`;
};

const AuditHistoryTable: React.FC<Props> = ({ history }) => {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">No audit runs yet.</p>;
  }

  return (
    <div className="overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Date</th>
            <th className="py-3 pr-4 font-semibold">Overall score</th>
            <th className="py-3 pr-4 font-semibold">Duration</th>
            <th className="py-3 pr-4 font-semibold">Recommendations</th>
          </tr>
        </thead>
        <tbody>
          {history.slice(0, 8).map((run) => (
            <tr key={run.id} className="border-b last:border-0">
              <td className="py-3 pr-4 text-foreground">{formatDate(run.createdAt)}</td>
              <td className="py-3 pr-4 text-foreground">{run.overallScore}</td>
              <td className="py-3 pr-4 text-foreground">{durationMs(run.createdAt, run.completedAt)}</td>
              <td className="py-3 pr-4 text-foreground">{run.recommendations.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditHistoryTable;
