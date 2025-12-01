import api from '@/lib/apiClient';
import { IamUser, UserRole, UserStatus } from './types';

const statusFallback = (value: any): UserStatus => {
  const allowed: UserStatus[] = ['active', 'disabled', 'pending_invite'];
  return allowed.includes(value) ? value : 'active';
};

const roleFallback = (value: any): UserRole => {
  const allowed: UserRole[] = ['owner', 'admin', 'editor', 'viewer'];
  return allowed.includes(value) ? value : 'viewer';
};

const mapUser = (item: any): IamUser => ({
  id: item?.id ?? item?._id ?? '',
  name: item?.name ?? '',
  email: item?.email ?? '',
  role: roleFallback(item?.role),
  status: statusFallback(item?.status),
  lastLogin: item?.lastLogin ?? item?.last_login ?? item?.last_login_at ?? undefined,
  createdAt: item?.createdAt ?? item?.created_at ?? '',
  updatedAt: item?.updatedAt ?? item?.updated_at ?? undefined,
});

const normalizeList = (payload: unknown): IamUser[] => {
  if (Array.isArray(payload)) return payload.map(mapUser);
  const value = payload as { items?: unknown; users?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapUser);
  if (Array.isArray(value?.users)) return value.users.map(mapUser);
  return [];
};

export async function getUsers(): Promise<IamUser[]> {
  const res = await api.get('/api/iam/users');
  return normalizeList(res.data);
}

export async function getUser(id: string): Promise<IamUser> {
  const res = await api.get(`/api/iam/users/${id}`);
  return mapUser(res.data);
}

export async function inviteUser(payload: { name: string; email: string; role: UserRole }): Promise<IamUser> {
  const res = await api.post('/api/iam/users/invite', payload);
  return mapUser(res.data);
}

export async function updateUser(id: string, payload: Partial<IamUser>): Promise<IamUser> {
  const res = await api.put(`/api/iam/users/${id}`, payload);
  return mapUser(res.data);
}

export async function patchUser(
  id: string,
  payload: Partial<IamUser> & { action?: string }
): Promise<IamUser> {
  const res = await api.patch(`/api/iam/users/${id}`, payload);
  return mapUser(res.data);
}
