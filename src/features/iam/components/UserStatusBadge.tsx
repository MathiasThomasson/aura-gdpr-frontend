import React from 'react';
import { UserStatus } from '../types';

const styles: Record<UserStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  disabled: 'bg-rose-50 text-rose-700 border-rose-200',
  pending_invite: 'bg-amber-50 text-amber-700 border-amber-200',
};

const labels: Record<UserStatus, string> = {
  active: 'Active',
  disabled: 'Disabled',
  pending_invite: 'Pending invite',
};

type Props = {
  status: UserStatus;
};

const UserStatusBadge: React.FC<Props> = ({ status }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
    {labels[status]}
  </span>
);

export default UserStatusBadge;
