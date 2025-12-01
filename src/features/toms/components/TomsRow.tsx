import React from 'react';
import { TomItem } from '../types';
import TomCategoryBadge from './TomCategoryBadge';

type Props = {
  tom: TomItem;
  onClick: () => void;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const effectivenessColor: Record<TomItem['effectiveness'], string> = {
  low: 'text-slate-600',
  medium: 'text-amber-600',
  high: 'text-emerald-700',
};

const TomsRow: React.FC<Props> = ({ tom, onClick }) => {
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
      <td className="py-3 pr-4 font-semibold text-foreground">{tom.name}</td>
      <td className="py-3 pr-4">
        <TomCategoryBadge category={tom.category} />
      </td>
      <td className={`py-3 pr-4 font-semibold ${effectivenessColor[tom.effectiveness]}`}>{tom.effectiveness}</td>
      <td className="py-3 pr-4 text-foreground">{tom.owner}</td>
      <td className="py-3 pr-4 text-foreground">{formatDate(tom.lastUpdated)}</td>
    </tr>
  );
};

export default TomsRow;
