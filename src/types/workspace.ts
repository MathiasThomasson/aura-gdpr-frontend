export type WorkspaceRole = 'owner' | 'admin' | 'user' | 'viewer' | 'editor';

export type WorkspaceUserStatus = 'active' | 'disabled';

export interface WorkspaceUser {
  id: number;
  email: string;
  name?: string;
  role: WorkspaceRole;
  status: WorkspaceUserStatus;
  last_login?: string | null;
  lastLogin?: string | null;
}
