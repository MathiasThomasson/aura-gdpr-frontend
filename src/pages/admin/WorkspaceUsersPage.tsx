import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, MailPlus, ShieldAlert, ShieldCheck } from 'lucide-react';
import api from '@/lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { WorkspaceRole, WorkspaceUser, WorkspaceUserStatus } from '@/types/workspace';

type InviteDialogProps = {
  open: boolean;
  defaultRole: WorkspaceRole;
  onClose: () => void;
  onSubmit: (payload: { email: string; role: WorkspaceRole }) => Promise<void>;
  isSubmitting: boolean;
};

const roleOptions: Array<{ value: WorkspaceRole; label: string }> = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

const normalizeRole = (value: any): WorkspaceRole => {
  const parsed = (value ?? '').toString().toLowerCase();
  if (parsed === 'editor') return 'user';
  const allowed: WorkspaceRole[] = ['owner', 'admin', 'user', 'viewer'];
  return allowed.includes(parsed as WorkspaceRole) ? (parsed as WorkspaceRole) : 'viewer';
};

const normalizeStatus = (value: any): WorkspaceUserStatus => {
  const parsed = (value ?? '').toString().toLowerCase();
  return parsed === 'disabled' ? 'disabled' : 'active';
};

const mapWorkspaceUser = (payload: any): WorkspaceUser => ({
  id: Number(payload?.id ?? payload?.user_tenant_id ?? payload?.userTenantId ?? 0),
  email: payload?.email ?? '',
  name: payload?.name ?? payload?.full_name ?? payload?.fullName ?? undefined,
  role: normalizeRole(payload?.role),
  status: normalizeStatus(payload?.status),
  last_login: payload?.last_login ?? payload?.lastLogin ?? null,
  lastLogin: payload?.lastLogin ?? payload?.last_login ?? null,
});

const formatDate = (value?: string | null) => {
  if (!value) return '\u2014';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const InviteDialog: React.FC<InviteDialogProps> = ({ open, defaultRole, onClose, onSubmit, isSubmitting }) => {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<WorkspaceRole>(defaultRole);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setEmail('');
      setRole(defaultRole);
      setError(null);
    }
  }, [defaultRole, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }
    setError(null);
    await onSubmit({ email: trimmedEmail, role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Invite user</p>
            <p className="text-lg font-semibold text-slate-900">Add a teammate</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            aria-label="Close dialog"
          >
            x
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              disabled={isSubmitting}
            />
            {error && <p className="text-xs text-rose-600">{error}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Role</label>
            <select
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
              value={role}
              onChange={(e) => setRole(e.target.value as WorkspaceRole)}
              disabled={isSubmitting}
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              'Invite'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const WorkspaceUsersPage: React.FC = () => {
  const { user } = useAuth() as { user?: { role?: string } };
  const { toast } = useToast();
  const [users, setUsers] = React.useState<WorkspaceUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [forbidden, setForbidden] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [inviteSubmitting, setInviteSubmitting] = React.useState(false);
  const [savingMap, setSavingMap] = React.useState<Record<number, boolean>>({});

  const currentRole = user?.role?.toString().toLowerCase();
  const canManage = currentRole === 'owner' || currentRole === 'admin';

  const setUserSaving = (id: number, saving: boolean) => {
    setSavingMap((prev) => ({ ...prev, [id]: saving }));
  };

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setForbidden(false);
    try {
      const res = await api.get<WorkspaceUser[]>('/api/admin/workspace/users', {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 403,
      });

      if (res.status === 403) {
        setForbidden(true);
        setUsers([]);
        return;
      }

      const payload = Array.isArray(res.data) ? res.data : [];
      setUsers(payload.map(mapWorkspaceUser));
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load workspace users.');
      toast({
        variant: 'destructive',
        title: 'Failed to load users',
        description: err?.message ?? 'Something went wrong while fetching workspace users.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    if (canManage) {
      loadUsers();
    }
  }, [canManage, loadUsers]);

  const handleInvite = async (payload: { email: string; role: WorkspaceRole }) => {
    setInviteSubmitting(true);
    try {
      const res = await api.post<WorkspaceUser>('/api/admin/workspace/users/invite', payload);
      const invited = mapWorkspaceUser(res.data);
      setUsers((prev) => [...prev, invited]);
      toast({ title: 'Invitation recorded', description: `${payload.email} has been added to the workspace.` });
      setInviteOpen(false);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to invite user',
        description: err?.message ?? 'Please try again.',
      });
    } finally {
      setInviteSubmitting(false);
    }
  };

  const updateUserState = (id: number, updates: Partial<WorkspaceUser>) => {
    setUsers((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const revertUserState = (snapshot?: WorkspaceUser) => {
    if (!snapshot) return;
    setUsers((prev) => prev.map((item) => (item.id === snapshot.id ? snapshot : item)));
  };

  const handleRoleChange = async (id: number, nextRole: WorkspaceRole) => {
    const existing = users.find((u) => u.id === id);
    const fallback = existing ? { ...existing } : undefined;
    updateUserState(id, { role: nextRole });
    setUserSaving(id, true);
    try {
      await api.patch(`/api/admin/workspace/users/${id}`, { role: nextRole });
      toast({ title: 'Role updated', description: `Role changed to ${roleOptions.find((r) => r.value === nextRole)?.label ?? nextRole}.` });
    } catch (err: any) {
      revertUserState(fallback);
      toast({
        variant: 'destructive',
        title: 'Failed to update role',
        description: err?.message ?? 'Please try again.',
      });
    } finally {
      setUserSaving(id, false);
    }
  };

  const handleStatusChange = async (id: number, nextStatus: WorkspaceUserStatus) => {
    const existing = users.find((u) => u.id === id);
    const fallback = existing ? { ...existing } : undefined;
    updateUserState(id, { status: nextStatus });
    setUserSaving(id, true);
    try {
      await api.patch(`/api/admin/workspace/users/${id}`, { status: nextStatus });
      toast({
        title: 'Status updated',
        description: `User marked as ${nextStatus === 'active' ? 'active' : 'disabled'}.`,
      });
    } catch (err: any) {
      revertUserState(fallback);
      toast({
        variant: 'destructive',
        title: 'Failed to update status',
        description: err?.message ?? 'Please try again.',
      });
    } finally {
      setUserSaving(id, false);
    }
  };

  if (!canManage) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Workspace Admin</p>
          <h1 className="text-3xl font-semibold text-slate-900">Workspace Users & Roles</h1>
          <p className="text-sm text-slate-600">Manage who can access your workspace and what they are allowed to do.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="inline-flex items-center gap-2">
          <MailPlus className="h-4 w-4" />
          Invite user
        </Button>
      </div>

      {forbidden ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="rounded-full bg-white p-2 text-amber-600 shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg text-amber-900">You do not have permission</CardTitle>
              <CardDescription className="text-amber-800">
                You do not have permission to manage workspace users. Contact your workspace owner.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl text-slate-900">Team directory</CardTitle>
              <CardDescription>See everyone with access to this workspace and manage their permissions.</CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <ShieldCheck className="h-4 w-4 text-sky-500" />
              Owner/Admin only
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="grid grid-cols-12 items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div className="col-span-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="col-span-2 h-8" />
                    <Skeleton className="col-span-2 h-6" />
                    <Skeleton className="col-span-3 h-4" />
                    <Skeleton className="col-span-1 h-4" />
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6">
                <div>
                  <p className="text-sm font-semibold text-slate-800">No users yet.</p>
                  <p className="text-sm text-slate-600">
                    Invite your team to collaborate on GDPR compliance.
                  </p>
                </div>
                <Button variant="outline" onClick={() => setInviteOpen(true)}>
                  Invite user
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <div className="col-span-4">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">Last login</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                <div className="divide-y divide-slate-200 bg-white">
                  {users.map((member) => (
                    <div key={member.id} className="grid grid-cols-12 items-center gap-3 px-4 py-3 hover:bg-slate-50">
                      <div className="col-span-4">
                        <p className="text-sm font-semibold text-slate-900">{member.email}</p>
                        <p className="text-xs text-slate-600">{member.name ?? '\u2014'}</p>
                      </div>
                      <div className="col-span-2">
                        <select
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as WorkspaceRole)}
                          disabled={Boolean(savingMap[member.id])}
                        >
                          {roleOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2 flex items-center gap-3">
                        <Badge
                          className={
                            member.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          }
                          variant="outline"
                        >
                          {member.status === 'active' ? 'Active' : 'Disabled'}
                        </Badge>
                        <Switch
                          checked={member.status === 'active'}
                          onCheckedChange={(checked) => handleStatusChange(member.id, checked ? 'active' : 'disabled')}
                          disabled={Boolean(savingMap[member.id])}
                        />
                      </div>
                      <div className="col-span-3 text-sm text-slate-700">
                        {formatDate(member.last_login ?? member.lastLogin)}
                      </div>
                      <div className="col-span-1 text-right text-sm text-slate-400">\u2014</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <InviteDialog
        open={inviteOpen}
        defaultRole="user"
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
        isSubmitting={inviteSubmitting}
      />
    </div>
  );
};

export default WorkspaceUsersPage;
