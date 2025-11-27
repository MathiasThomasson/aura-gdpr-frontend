import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DpiaRisk } from '@/hooks/useDpia';

const styles: Record<DpiaRisk, string> = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200',
};

const DpiaRiskBadge: React.FC<{ risk: DpiaRisk }> = ({ risk }) => (
  <Badge className={styles[risk]}>{risk}</Badge>
);

export default DpiaRiskBadge;
