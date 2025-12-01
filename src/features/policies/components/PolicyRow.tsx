import React from 'react';
import { PolicyItem } from '../types';
import PolicyStatusBadge from './PolicyStatusBadge';

type Props = {
  policy: PolicyItem;
  onClick: () => void;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const PolicyRow: React.FC<Props> = ({ policy, onClick }) => {
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
      <td className="py-3 pr-4 font-semibold text-foreground">{policy.name}</td>
      <td className="py-3 pr-4 text-foreground capitalize">{policy.type.replaceAll('_', ' ')}</td>
      <td className="py-3 pr-4">
        <PolicyStatusBadge status={policy.status} />
      </td>
      <td className="py-3 pr-4 text-foreground">{policy.owner}</td>
      <td className="py-3 pr-4 text-foreground">{formatDate(policy.lastUpdated)}</td>
    </tr>
  );
};

export default PolicyRow;
