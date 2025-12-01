import React from 'react';
import UsersTable from './components/UsersTable';
import IamFiltersBar from './components/IamFiltersBar';
import UserDetailsDrawer from './components/UserDetailsDrawer';
import InviteUserModal from './components/InviteUserModal';
import useIam from './hooks/useIam';
import { IamUser, UserRole, UserStatus, ROLE_PERMISSIONS } from './types';
import { Button } from '@/components/ui/button';

type RoleFilter = UserRole | 'all';
type StatusFilter = UserStatus | 'all';

const IamPage: React.FC = () => {
  const { users, isLoading, isError, invite, update, patch, refresh, fetchUser, isSaving } = useIam();
  const [search, setSearch] = React.useState('');
  const [role, setRole] = React.useState<RoleFilter>('all');
  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [selected, setSelected] = React.useState<IamUser | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');
  const [inviteOpen, setInviteOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = role === 'all' ? true : user.role === role;
      const matchesStatus = status === 'all' ? true : user.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const handleSelect = (user: IamUser) => {
    setSelected(user);
    setMode('edit');
    if (user.id) {
      fetchUser(user.id)
        .then((detail) => setSelected(detail))
        .catch(() => {});
    }
  };

  const handleSave = async (user: IamUser, saveMode: 'create' | 'edit') => {
    if (saveMode === 'edit' && user.id) {
      await update(user.id, user);
    }
    await refresh();
    setSelected(null);
    setMode('view');
  };

  const handleInvite = async (payload: { name: string; email: string; role: UserRole }) => {
    await invite(payload);
    await refresh();
    setInviteOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Identity & Access Management</h1>
          <p className="text-sm text-slate-600">Manage user accounts, roles and permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setInviteOpen(true)}>
            Invite user
          </Button>
        </div>
      </div>

      <IamFiltersBar
        search={search}
        role={role}
        status={status}
        onSearch={setSearch}
        onRoleChange={setRole}
        onStatusChange={setStatus}
      />

      {isError && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Failed to load users. Please try again.
        </div>
      )}

      <UsersTable users={filtered} onSelect={handleSelect} isLoading={isLoading} isError={isError} />

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Roles & Permissions</h2>
        <p className="text-sm text-slate-600">Overview of default roles and their permissions.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {(Object.keys(ROLE_PERMISSIONS) as UserRole[]).map((roleKey) => (
            <div key={roleKey} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900 capitalize">{roleKey}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
                {ROLE_PERMISSIONS[roleKey].map((perm) => (
                  <li key={perm}>{perm}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <UserDetailsDrawer
        user={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => setSelected(null)}
        onSave={handleSave}
        onPatch={async (id, payload) => {
          await patch(id, payload);
          await refresh();
        }}
        isSaving={isSaving}
      />

      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
        isSubmitting={isSaving}
      />
    </div>
  );
};

export default IamPage;
