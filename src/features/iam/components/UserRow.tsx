import React from 'react';
import { IamUser } from '../types';
import UserStatusBadge from './UserStatusBadge';
import UserRoleBadge from './UserRoleBadge';

type Props = {
  user: IamUser;
  onClick: () => void;
};

const formatDate = (value?: string) => {
  if (!value) return 'Never';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const UserRow: React.FC<Props> = ({ user, onClick }) => {
  return (
    <tr
      className="cursor-pointer border-b last:border-0 hover:bg-slate-50 focus-within:bg-slate-50"
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <td className="py-3 pr-4 font-semibold text-foreground">{user.name}</td>
      <td className="py-3 pr-4 text-foreground">{user.email}</td>
      <td className="py-3 pr-4">
        <UserRoleBadge role={user.role} />
      </td>
      <td className="py-3 pr-4">
        <UserStatusBadge status={user.status} />
      </td>
      <td className="py-3 pr-4 text-foreground">{formatDate(user.lastLogin)}</td>
    </tr>
  );
};

export default UserRow;
