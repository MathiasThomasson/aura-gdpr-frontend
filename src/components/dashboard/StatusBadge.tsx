import React from 'react';
import { Badge } from '@/components/ui/badge';

type Status = 'green' | 'yellow' | 'red' | string | null | undefined;

const statusStyles: Record<string, string> = {
  green: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-200',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200',
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const key = typeof status === 'string' ? status.toLowerCase() : 'unknown';
  const style = statusStyles[key] ?? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
  const label = status ? status.toString() : 'Unknown';

  return <Badge className={style}>{label}</Badge>;
};

export default StatusBadge;
