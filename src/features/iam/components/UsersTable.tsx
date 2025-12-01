import React from 'react';
import { IamUser } from '../types';
import UserRow from './UserRow';

type Props = {
  users: IamUser[];
  onSelect: (user: IamUser) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const UsersTable: React.FC<Props> = ({ users, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading users...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load users.</p>;
  }
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No users found for the selected filters.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">Email</th>
            <th className="py-3 pr-4 font-semibold">Role</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Last login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} onClick={() => onSelect(user)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
