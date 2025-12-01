import { useState } from 'react';
import { IamUser } from '../types';

export function useIamMockData() {
  const [users, setUsers] = useState<IamUser[]>([
    {
      id: 'user_001',
      name: 'Alice Owner',
      email: 'owner@aura.test',
      role: 'owner',
      status: 'active',
      createdAt: '2025-01-01T09:00:00Z',
      lastLogin: '2025-05-10T10:00:00Z',
    },
    {
      id: 'user_002',
      name: 'Andy Admin',
      email: 'admin@aura.test',
      role: 'admin',
      status: 'active',
      createdAt: '2025-01-10T09:00:00Z',
      lastLogin: '2025-05-12T11:00:00Z',
    },
    {
      id: 'user_003',
      name: 'Eva Editor',
      email: 'editor@aura.test',
      role: 'editor',
      status: 'active',
      createdAt: '2025-02-01T08:00:00Z',
      lastLogin: '2025-05-11T14:00:00Z',
    },
    {
      id: 'user_004',
      name: 'Victor Viewer',
      email: 'viewer@aura.test',
      role: 'viewer',
      status: 'active',
      createdAt: '2025-02-15T10:00:00Z',
      lastLogin: '2025-05-09T09:30:00Z',
    },
    {
      id: 'user_005',
      name: 'Doris Disabled',
      email: 'disabled@aura.test',
      role: 'viewer',
      status: 'disabled',
      createdAt: '2025-02-20T09:00:00Z',
      lastLogin: '2025-03-01T12:00:00Z',
    },
    {
      id: 'user_006',
      name: 'Peter Pending',
      email: 'pending@aura.test',
      role: 'editor',
      status: 'pending_invite',
      createdAt: '2025-05-01T09:00:00Z',
    },
  ]);

  return { users, setUsers, isLoading: false, isError: false };
}

export default useIamMockData;
