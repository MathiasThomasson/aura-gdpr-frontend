import { useState } from 'react';
import { TomItem } from '../types';

export function useTomsMockData() {
  const [toms, setToms] = useState<TomItem[]>([
    {
      id: 'tom_001',
      name: 'Access control',
      category: 'access_control',
      description: 'Role-based access control enforced across systems.',
      implementation: 'SSO + MFA for all admins; RBAC in SaaS apps; quarterly access reviews.',
      effectiveness: 'high',
      owner: 'Security Lead',
      createdAt: '2025-02-10T09:00:00Z',
      lastUpdated: '2025-03-05T10:00:00Z',
    },
    {
      id: 'tom_002',
      name: 'Encryption at rest',
      category: 'encryption',
      description: 'All data at rest encrypted with strong ciphers.',
      implementation: 'AES-256 encryption for databases and storage buckets; key rotation via KMS.',
      effectiveness: 'high',
      owner: 'Infrastructure',
      createdAt: '2025-01-15T09:00:00Z',
      lastUpdated: '2025-03-01T09:30:00Z',
    },
    {
      id: 'tom_003',
      name: 'Logging & monitoring',
      category: 'logging_monitoring',
      description: 'Centralized logging with alerting for anomalous activity.',
      implementation: 'SIEM with detections for failed logins, privilege escalation, data export anomalies.',
      effectiveness: 'medium',
      owner: 'Security Operations',
      createdAt: '2025-02-01T10:00:00Z',
      lastUpdated: '2025-04-10T11:15:00Z',
    },
    {
      id: 'tom_004',
      name: 'Backup & disaster recovery',
      category: 'backup_recovery',
      description: 'Regular backups with tested restore procedures.',
      implementation: 'Nightly backups, weekly restore tests, offsite replication.',
      effectiveness: 'medium',
      owner: 'Infrastructure',
      createdAt: '2025-02-20T08:00:00Z',
      lastUpdated: '2025-03-15T12:00:00Z',
    },
  ]);

  return {
    toms,
    setToms,
    isLoading: false,
    isError: false,
  };
}

export default useTomsMockData;
