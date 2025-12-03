import React from 'react';
import EmptyState from '@/components/EmptyState';
import { DpiaItem } from '../types';
import DpiaRow from './DpiaRow';

type Props = {
  dpias: DpiaItem[];
  onSelect: (dpia: DpiaItem) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  hasDpias?: boolean;
  onCreate?: () => void;
};

const DpiaTable: React.FC<Props> = ({
  dpias,
  onSelect,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  hasDpias,
  onCreate,
}) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading DPIAs...</p>;
  }
  if (isError) {
    return (
      <EmptyState
        title="Unable to load DPIAs"
        description={errorMessage || 'Something went wrong while loading data. Please try again.'}
        actionLabel={onRetry ? 'Retry' : undefined}
        onAction={onRetry}
        className="bg-rose-50 border-rose-200"
      />
    );
  }
  if (dpias.length === 0) {
    if (hasDpias) {
      return (
        <EmptyState
          title="No DPIAs match these filters"
          description="Adjust filters or start a new assessment."
          actionLabel="New DPIA"
          onAction={onCreate}
        />
      );
    }
    return (
      <EmptyState
        title="No DPIAs yet"
        description="Create your first DPIA to assess high-risk processing and capture mitigation actions."
        actionLabel="New DPIA"
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
