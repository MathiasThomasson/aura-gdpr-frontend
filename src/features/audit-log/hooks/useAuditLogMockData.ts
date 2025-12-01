import { useState } from 'react';
import { AuditLogItem } from '../types';

const now = new Date('2025-05-15T12:00:00Z').getTime();

const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

export function useAuditLogMockData() {
  const [items] = useState<AuditLogItem[]>([
    {
      id: 'log_001',
      timestamp: daysAgo(0),
      actor: 'system',
      action: 'AI audit run completed',
      resourceType: 'system',
      severity: 'info',
      details: 'Overall score 78. Areas reviewed: DSR, policies, DPIA, ROPA, incidents.',
    },
    {
      id: 'log_002',
      timestamp: daysAgo(1),
      actor: 'dpo@aura.test',
      action: 'Created DSR request',
      resourceType: 'dsr',
      resourceId: 'dsr_123',
      resourceName: 'DSR request for Jane Doe',
      severity: 'info',
      ipAddress: '192.168.1.10',
    },
    {
      id: 'log_003',
      timestamp: daysAgo(2),
      actor: 'analyst@aura.test',
      action: 'Updated DPIA status to approved',
      resourceType: 'dpia',
      resourceId: 'dpia_002',
      resourceName: 'Employee monitoring DPIA',
      severity: 'warning',
    },
    {
      id: 'log_004',
      timestamp: daysAgo(3),
      actor: 'security@aura.test',
      action: 'Created incident',
      resourceType: 'incident',
      resourceId: 'inc_003',
      resourceName: 'Unauthorized access attempt',
      severity: 'critical',
      details: 'Incident severity: critical. Status: contained.',
    },
    {
      id: 'log_005',
      timestamp: daysAgo(4),
      actor: 'legal@aura.test',
      action: 'Updated policy',
      resourceType: 'policy',
      resourceId: 'pol_1',
      resourceName: 'Privacy Policy',
      severity: 'info',
    },
    {
      id: 'log_006',
      timestamp: daysAgo(5),
      actor: 'system',
      action: 'New TOM added',
      resourceType: 'toms',
      resourceId: 'tom_004',
      resourceName: 'Backup & disaster recovery',
      severity: 'info',
    },
    {
      id: 'log_007',
      timestamp: daysAgo(6),
      actor: 'owner@aura.test',
      action: 'Added ROPA record',
      resourceType: 'ropa',
      resourceId: 'ropa_002',
      resourceName: 'Employee HR processing',
      severity: 'info',
    },
    {
      id: 'log_008',
      timestamp: daysAgo(7),
      actor: 'system',
      action: 'User login',
      resourceType: 'user',
      resourceId: 'user_123',
      resourceName: 'admin@aura.test',
      severity: 'info',
      ipAddress: '10.1.0.5',
      userAgent: 'Chrome on Windows',
    },
    {
      id: 'log_009',
      timestamp: daysAgo(8),
      actor: 'security@aura.test',
      action: 'Updated incident status to resolved',
      resourceType: 'incident',
      resourceId: 'inc_002',
      resourceName: 'Lost laptop with customer data',
      severity: 'warning',
    },
    {
      id: 'log_010',
      timestamp: daysAgo(9),
      actor: 'system',
      action: 'Document generated via AI',
      resourceType: 'document',
      resourceId: 'doc_009',
      resourceName: 'AI generated DPIA summary',
      severity: 'info',
      details: 'Draft created for review.',
    },
  ]);

  return {
    items,
    isLoading: false,
    isError: false,
  };
}

export default useAuditLogMockData;
