import React from 'react';
import { Button } from '@/components/ui/button';
import { UserRole } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onInvite: (user: { name: string; email: string; role: UserRole }) => void;
};

const roles: UserRole[] = ['owner', 'admin', 'editor', 'viewer'];

const InviteUserModal: React.FC<Props> = ({ open, onClose, onInvite }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('viewer');
  const [errors, setErrors] = React.useState<{ name?: string; email?: string }>({});

  React.useEffect(() => {
    if (open) {
      setName('');
      setEmail('');
      setRole('viewer');
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleInvite = () => {
    if (!validate()) return;
    onInvite({ name: name.trim(), email: email.trim(), role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-slate-900">Invite user</h2>
        <p className="text-sm text-slate-600">Send an invite to a new user with a selected role.</p>
        <div className="mt-4 space-y-3">
          <div className="space-y-1 text-sm text-slate-700">
            <label className="font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
          </div>
          <div className="space-y-1 text-sm text-slate-700">
            <label className="font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
          </div>
          <div className="space-y-1 text-sm text-slate-700">
            <label className="font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInvite}>Send invite</Button>
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;
