import React from 'react';
import { UserRole, UserStatus } from '../types';

type Props = {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
  onSearch: (value: string) => void;
  onRoleChange: (value: UserRole | 'all') => void;
  onStatusChange: (value: UserStatus | 'all') => void;
};

const roles: UserRole[] = ['owner', 'admin', 'editor', 'viewer'];
const statuses: UserStatus[] = ['active', 'pending_invite', 'disabled'];

const IamFiltersBar: React.FC<Props> = ({ search, role, status, onSearch, onRoleChange, onStatusChange }) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search users by name or email..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={role}
          onChange={(e) => onRoleChange(e.target.value as UserRole | 'all')}
        >
          <option value="all">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as UserStatus | 'all')}
        >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default IamFiltersBar;
