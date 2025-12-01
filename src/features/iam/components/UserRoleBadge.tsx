import React from 'react';
import { UserRole } from '../types';

const styles: Record<UserRole, string> = {
  owner: 'bg-purple-50 text-purple-700 border-purple-200',
  admin: 'bg-sky-50 text-sky-700 border-sky-200',
  editor: 'bg-amber-50 text-amber-700 border-amber-200',
  viewer: 'bg-slate-100 text-slate-700 border-slate-200',
};

const labels: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

type Props = {
  role: UserRole;
};

const UserRoleBadge: React.FC<Props> = ({ role }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[role]}`}>
    {labels[role]}
  </span>
);

export default UserRoleBadge;
