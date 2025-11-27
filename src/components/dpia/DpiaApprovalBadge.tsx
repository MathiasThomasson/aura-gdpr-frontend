import React from 'react';
import { Badge } from '@/components/ui/badge';

const DpiaApprovalBadge: React.FC<{ approved?: boolean }> = ({ approved }) => (
  <Badge
    className={
      approved
        ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200'
        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
    }
  >
    {approved ? 'Yes' : 'No'}
  </Badge>
);

export default DpiaApprovalBadge;
