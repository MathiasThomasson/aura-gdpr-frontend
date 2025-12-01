import React from 'react';
import { DpiaItem } from '../types';
import DpiaRow from './DpiaRow';

type Props = {
  dpias: DpiaItem[];
  onSelect: (dpia: DpiaItem) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const DpiaTable: React.FC<Props> = ({ dpias, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading DPIAs...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load DPIAs.</p>;
  }
  if (dpias.length === 0) {
    return <p className="text-sm text-muted-foreground">No DPIAs found for the selected filters.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">System</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Risk level</th>
            <th className="py-3 pr-4 font-semibold">Owner</th>
            <th className="py-3 pr-4 font-semibold">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {dpias.map((dpia) => (
            <DpiaRow key={dpia.id} dpia={dpia} onClick={() => onSelect(dpia)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DpiaTable;
