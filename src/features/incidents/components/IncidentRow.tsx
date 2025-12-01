import React from 'react';
import { IncidentItem } from '../types';
import IncidentStatusBadge from './IncidentStatusBadge';
import IncidentSeverityBadge from './IncidentSeverityBadge';

type Props = {
  incident: IncidentItem;
  onClick: () => void;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const IncidentRow: React.FC<Props> = ({ incident, onClick }) => {
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
      <td className="py-3 pr-4 font-semibold text-foreground">{incident.title}</td>
      <td className="py-3 pr-4 text-foreground">{incident.systemName}</td>
      <td className="py-3 pr-4">
        <IncidentSeverityBadge severity={incident.severity} />
      </td>
      <td className="py-3 pr-4">
        <IncidentStatusBadge status={incident.status} />
      </td>
      <td className="py-3 pr-4 text-foreground">{formatDate(incident.lastUpdated)}</td>
    </tr>
  );
};

export default IncidentRow;
