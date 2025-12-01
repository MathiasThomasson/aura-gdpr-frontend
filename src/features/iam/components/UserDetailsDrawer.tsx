import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IamUser, UserRole, UserStatus } from '../types';
import UserRoleBadge from './UserRoleBadge';
import UserStatusBadge from './UserStatusBadge';

type Mode = 'view' | 'edit' | 'create';

type Props = {
  user: IamUser | null;
  isOpen: boolean;
  mode: Mode;
  onClose: () => void;
  onSave: (user: IamUser, mode: 'create' | 'edit') => void;
};

const roles: UserRole[] = ['owner', 'admin', 'editor', 'viewer'];
const statuses: UserStatus[] = ['active', 'pending_invite', 'disabled'];

const UserDetailsDrawer: React.FC<Props> = ({ user, isOpen, mode, onClose, onSave }) => {
  const [draft, setDraft] = React.useState<IamUser | null>(user);
  const [errors, setErrors] = React.useState<{ name?: string; email?: string }>({});
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(user);
      setErrors({});
    }
  }, [user, isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const firstInput = panelRef.current?.querySelector<HTMLElement>('input, select, textarea, button');
    firstInput?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !draft) return null;

  const isEditable = mode === 'create' || mode === 'edit';

  const updateField = <K extends keyof IamUser>(key: K, value: IamUser[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (!draft.name.trim()) next.name = 'Name is required.';
    if (!draft.email.trim()) next.email = 'Email is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(draft, mode === 'create' ? 'create' : 'edit');
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm" onMouseDown={handleOverlayClick}>
      <div className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                {mode === 'create' ? 'New user' : draft.name || 'User'}
              </h2>
              <UserRoleBadge role={draft.role} />
              <UserStatusBadge status={draft.status} />
            </div>
            <p className="text-sm text-slate-600">{draft.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Name</span>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => updateField('name', e.target.value)}
                disabled={!isEditable}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
              {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
            </label>
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Email</span>
              <input
                type="email"
                value={draft.email}
                onChange={(e) => updateField('email', e.target.value)}
                disabled={!isEditable}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
              {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Role</span>
                <select
                  value={draft.role}
                  onChange={(e) => updateField('role', e.target.value as UserRole)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Status</span>
                <select
                  value={draft.status}
                  onChange={(e) => updateField('status', e.target.value as UserStatus)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {mode !== 'create' && (
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-2">
                <div>
                  <p className="font-semibold text-slate-800">Created</p>
                  <p>{new Date(draft.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Last login</p>
                  <p>{draft.lastLogin ? new Date(draft.lastLogin).toLocaleString() : 'Never'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <div className="flex flex-wrap justify-end gap-2">
            {mode !== 'create' && (
              <>
                {draft.status === 'active' && (
                  <Button
                    variant="outline"
                    onClick={() => updateField('status', 'disabled')}
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    Disable user
                  </Button>
                )}
                {draft.status === 'disabled' && (
                  <Button variant="outline" onClick={() => updateField('status', 'active')}>
                    Enable user
                  </Button>
                )}
                {draft.status === 'pending_invite' && (
                  <>
                    <Button variant="outline" onClick={() => updateField('status', 'pending_invite')}>
                      Resend invite
                    </Button>
                    <Button variant="outline" onClick={() => updateField('status', 'disabled')}>
                      Cancel invite
                    </Button>
                  </>
                )}
              </>
            )}
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{mode === 'create' ? 'Create user' : 'Save changes'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsDrawer;
