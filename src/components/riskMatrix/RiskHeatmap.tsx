import React from 'react';
import RiskCell from './RiskCell';
import { RiskItem } from '@/hooks/useRiskMatrix';

type Props = {
  grouped: { low: RiskItem[]; medium: RiskItem[]; high: RiskItem[] };
  onSelect: (risk: 'low' | 'medium' | 'high') => void;
};

const RiskHeatmap: React.FC<Props> = ({ grouped, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <RiskCell label="Low" count={grouped.low.length} tone="low" onClick={() => onSelect('low')} />
      <RiskCell label="Medium" count={grouped.medium.length} tone="medium" onClick={() => onSelect('medium')} />
      <RiskCell label="High" count={grouped.high.length} tone="high" onClick={() => onSelect('high')} />
    </div>
  );
};

export default RiskHeatmap;
