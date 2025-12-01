import React from 'react';
import { AuditLogItem } from '../types';
import AuditLogRow from './AuditLogRow';

type Props = {
  items: AuditLogItem[];
  onSelect: (item: AuditLogItem) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const AuditLogTable: React.FC<Props> = ({ items, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading audit log...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load audit log.</p>;
  }
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No audit events found for the selected filters.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Timestamp</th>
            <th className="py-3 pr-4 font-semibold">Actor</th>
            <th className="py-3 pr-4 font-semibold">Action</th>
            <th className="py-3 pr-4 font-semibold">Resource</th>
            <th className="py-3 pr-4 font-semibold">Severity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <AuditLogRow key={item.id} item={item} onClick={() => onSelect(item)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
