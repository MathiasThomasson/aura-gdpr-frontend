import React from 'react';
import { RopaItem } from '../types';
import RopaRow from './RopaRow';

type Props = {
  records: RopaItem[];
  onSelect: (record: RopaItem) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const RopaTable: React.FC<Props> = ({ records, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading records...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load records.</p>;
  }
  if (records.length === 0) {
    return <p className="text-sm text-muted-foreground">No records found for the selected filters.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">System</th>
            <th className="py-3 pr-4 font-semibold">Category</th>
            <th className="py-3 pr-4 font-semibold">Owner</th>
            <th className="py-3 pr-4 font-semibold">Legal basis</th>
            <th className="py-3 pr-4 font-semibold">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <RopaRow key={record.id} record={record} onClick={() => onSelect(record)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RopaTable;
