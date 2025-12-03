import React from 'react';
import EmptyState from '@/components/EmptyState';
import { PolicyItem } from '../types';
import PolicyRow from './PolicyRow';

type Props = {
  policies: PolicyItem[];
  onSelect: (policy: PolicyItem) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  hasPolicies?: boolean;
  onCreate?: () => void;
};

const PolicyTable: React.FC<Props> = ({
  policies,
  onSelect,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  hasPolicies,
  onCreate,
}) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading policies...</p>;
  }
  if (isError) {
    return (
      <EmptyState
        title="Unable to load policies"
        description={errorMessage || 'Something went wrong while loading data. Please try again.'}
        actionLabel={onRetry ? 'Retry' : undefined}
        onAction={onRetry}
        className="bg-rose-50 border-rose-200"
      />
    );
  }
  if (policies.length === 0) {
    if (hasPolicies) {
      return (
        <EmptyState
          title="No policies match these filters"
          description="Try adjusting filters or start a new policy."
          actionLabel="New policy"
          onAction={onCreate}
        />
      );
    }
    return (
      <EmptyState
        title="No policies yet"
        description="Use this space to manage internal and external GDPR policies. Create your first policy to get started."
        actionLabel="New policy"
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
