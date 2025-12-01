import React from 'react';
import { DpiaItem } from '../types';
import DpiaStatusBadge from './DpiaStatusBadge';

type Props = {
  dpia: DpiaItem;
  onClick: () => void;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const DpiaRow: React.FC<Props> = ({ dpia, onClick }) => {
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
      <td className="py-3 pr-4 font-semibold text-foreground">{dpia.name}</td>
      <td className="py-3 pr-4 text-foreground">{dpia.systemName}</td>
      <td className="py-3 pr-4">
        <DpiaStatusBadge status={dpia.status} />
      </td>
      <td className="py-3 pr-4 text-foreground capitalize">{dpia.risk.level}</td>
      <td className="py-3 pr-4 text-foreground">{dpia.owner}</td>
      <td className="py-3 pr-4 text-foreground">{formatDate(dpia.lastUpdated)}</td>
    </tr>
  );
};

export default DpiaRow;
