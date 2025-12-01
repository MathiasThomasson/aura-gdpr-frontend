import React from 'react';
import { TomItem } from '../types';
import TomsRow from './TomsRow';

type Props = {
  toms: TomItem[];
  onSelect: (tom: TomItem) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const TomsTable: React.FC<Props> = ({ toms, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading measures...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load measures.</p>;
  }
  if (toms.length === 0) {
    return <p className="text-sm text-muted-foreground">No measures found for the selected filters.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">Category</th>
            <th className="py-3 pr-4 font-semibold">Effectiveness</th>
            <th className="py-3 pr-4 font-semibold">Owner</th>
            <th className="py-3 pr-4 font-semibold">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {toms.map((tom) => (
            <TomsRow key={tom.id} tom={tom} onClick={() => onSelect(tom)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TomsTable;
