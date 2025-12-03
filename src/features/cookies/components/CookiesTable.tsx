import React from 'react';
import EmptyState from '@/components/EmptyState';
import { CookieItem } from '../types';
import CookieRow from './CookieRow';

type Props = {
  cookies: CookieItem[];
  onSelect: (cookie: CookieItem) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
};

const CookiesTable: React.FC<Props> = ({ cookies, onSelect, isLoading, isError, errorMessage, onRetry }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading cookies...</p>;
  }
  if (isError) {
    return (
      <EmptyState
        title="Unable to load cookies"
        description={errorMessage || 'Something went wrong while loading data. Please try again.'}
        actionLabel={onRetry ? 'Retry' : undefined}
        onAction={onRetry}
        className="bg-rose-50 border-rose-200"
      />
    );
  }
  if (cookies.length === 0) {
    return (
      <EmptyState
        title="No cookies yet"
        description="Start by creating your first cookie entry to track web technologies and retention."
      />
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">Domain</th>
            <th className="py-3 pr-4 font-semibold">Category</th>
            <th className="py-3 pr-4 font-semibold">Duration</th>
            <th className="py-3 pr-4 font-semibold">Type</th>
            <th className="py-3 pr-4 font-semibold">Provider</th>
            <th className="py-3 pr-4 font-semibold">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie) => (
            <CookieRow key={cookie.id} cookie={cookie} onClick={() => onSelect(cookie)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CookiesTable;
