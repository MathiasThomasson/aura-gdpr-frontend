import React from 'react';
import { IncidentItem } from '../types';
import IncidentRow from './IncidentRow';

type Props = {
  incidents: IncidentItem[];
  onSelect: (incident: IncidentItem) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const IncidentsTable: React.FC<Props> = ({ incidents, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading incidents...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load incidents.</p>;
  }
  if (incidents.length === 0) {
    return <p className="text-sm text-muted-foreground">No incidents found for the selected filters.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Title</th>
            <th className="py-3 pr-4 font-semibold">System</th>
            <th className="py-3 pr-4 font-semibold">Severity</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <IncidentRow key={incident.id} incident={incident} onClick={() => onSelect(incident)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentsTable;
