import React from 'react';
import EmptyState from '@/components/EmptyState';
import { RopaItem } from '../types';
import RopaRow from './RopaRow';

type Props = {
  records: RopaItem[];
  onSelect: (record: RopaItem) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  hasRecords?: boolean;
  onCreate?: () => void;
};

const RopaTable: React.FC<Props> = ({
  records,
  onSelect,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  hasRecords,
  onCreate,
}) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading records...</p>;
  }
  if (isError) {
    return (
      <EmptyState
        title="Unable to load records"
        description={errorMessage || 'Something went wrong while loading data. Please try again.'}
        actionLabel={onRetry ? 'Retry' : undefined}
        onAction={onRetry}
        className="bg-rose-50 border-rose-200"
      />
    );
  }
  if (records.length === 0) {
    if (hasRecords) {
      return (
        <EmptyState
          title="No records match these filters"
          description="Try adjusting filters or add a new processing activity."
          actionLabel="New record"
          onAction={onCreate}
        />
      );
    }
    return (
      <EmptyState
        title="No processing records yet"
        description="Capture your first record of processing to maintain GDPR accountability."
        actionLabel="New record"
        onAction={onCreate}
      />
    );
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
