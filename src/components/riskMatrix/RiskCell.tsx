import React from 'react';
import { Badge } from '@/components/ui/badge';

type Props = {
  label: string;
  count: number;
  tone: 'low' | 'medium' | 'high';
  onClick?: () => void;
};

const tones: Record<Props['tone'], string> = {
  low: 'bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-800',
  medium: 'bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-800',
  high: 'bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-800',
};

const RiskCell: React.FC<Props> = ({ label, count, tone, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full rounded-md border border-border px-4 py-6 text-left transition ${tones[tone]}`}
  >
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold capitalize">{label}</span>
      <Badge>{count}</Badge>
    </div>
  </button>
);

export default RiskCell;
