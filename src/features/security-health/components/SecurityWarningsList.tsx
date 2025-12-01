import React from 'react';
import { SecurityWarning } from '../types';

type Props = {
  warnings: SecurityWarning[];
};

const styles: Record<SecurityWarning['severity'], string> = {
  low: 'border-slate-200 text-slate-700 bg-slate-50',
  medium: 'border-amber-200 text-amber-700 bg-amber-50',
  high: 'border-rose-200 text-rose-700 bg-rose-50',
  critical: 'border-rose-300 text-rose-800 bg-rose-50',
};

const SecurityWarningsList: React.FC<Props> = ({ warnings }) => {
  if (warnings.length === 0) {
    return <p className="text-sm text-muted-foreground">No warnings. Security posture looks good.</p>;
  }
  return (
    <div className="space-y-3">
      {warnings.map((warn) => (
        <div key={warn.id} className={`rounded-lg border px-3 py-3 text-sm font-semibold ${styles[warn.severity]}`}>
          {warn.message}
        </div>
      ))}
    </div>
  );
};

export default SecurityWarningsList;
