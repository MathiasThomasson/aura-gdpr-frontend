export type UserStatus = 'active' | 'disabled' | 'pending_invite';

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface IamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  owner: ['All permissions'],
  admin: ['Manage users', 'Manage all GDPR modules', 'View billing'],
  editor: ['Edit Documents', 'Edit Policies', 'Manage DSR'],
  viewer: ['Read-only access'],
};
