import React from 'react';
import { RopaItem } from '../types';

type Props = {
  record: RopaItem;
  onClick: () => void;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const RopaRow: React.FC<Props> = ({ record, onClick }) => {
  return (
    <tr
      className="cursor-pointer border-b last:border-0 hover:bg-slate-50 focus-within:bg-slate-50"
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <td className="py-3 pr-4 font-semibold text-foreground">{record.name}</td>
      <td className="py-3 pr-4 text-foreground">{record.systemName}</td>
      <td className="py-3 pr-4 text-foreground capitalize">{record.processingCategory.replace('_', ' ')}</td>
      <td className="py-3 pr-4 text-foreground">{record.owner}</td>
      <td className="py-3 pr-4 text-foreground">{record.legalBasis}</td>
      <td className="py-3 pr-4 text-foreground">{formatDate(record.lastUpdated)}</td>
    </tr>
  );
};

export default RopaRow;
