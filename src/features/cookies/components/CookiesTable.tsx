import React from 'react';
import { CookieItem } from '../types';
import CookieRow from './CookieRow';

type Props = {
  cookies: CookieItem[];
  onSelect: (cookie: CookieItem) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const CookiesTable: React.FC<Props> = ({ cookies, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading cookies...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load cookies.</p>;
  }
  if (cookies.length === 0) {
    return <p className="text-sm text-muted-foreground">No cookies found for the selected filters.</p>;
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
