import React from 'react';
import { PolicyItem } from '../types';
import PolicyRow from './PolicyRow';

type Props = {
  policies: PolicyItem[];
  onSelect: (policy: PolicyItem) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const PolicyTable: React.FC<Props> = ({ policies, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading policies...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load policies.</p>;
  }
  if (policies.length === 0) {
    return <p className="text-sm text-muted-foreground">No policies found for the selected filters.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">Type</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Owner</th>
            <th className="py-3 pr-4 font-semibold">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <PolicyRow key={policy.id} policy={policy} onClick={() => onSelect(policy)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PolicyTable;
