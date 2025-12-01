import { useState } from 'react';
import {
  SecurityEvent,
  SecurityIntegration,
  SecurityKpi,
  SecurityControl,
  SecurityWarning,
} from '../types';

export function useSecurityHealthMockData() {
  const [score] = useState<number>(78);
  const [kpis] = useState<SecurityKpi[]>([
    { id: 'kpi_encryption', label: 'Encryption coverage', value: 90, max: 100 },
    { id: 'kpi_access_control', label: 'Access control maturity', value: 65, max: 100 },
    { id: 'kpi_backup', label: 'Backup integrity', value: 80, max: 100 },
    { id: 'kpi_patch', label: 'Patch compliance', value: 70, max: 100 },
  ]);

  const [controls] = useState<SecurityControl[]>([
    { id: 'ctrl_firewall', name: 'Firewall configuration', category: 'Network', level: 'good' },
    { id: 'ctrl_mfa', name: 'MFA / 2FA enforcement', category: 'Access control', level: 'medium' },
    { id: 'ctrl_encryption', name: 'Encryption at rest', category: 'Encryption', level: 'good' },
    { id: 'ctrl_logging', name: 'Logging & monitoring', category: 'Monitoring', level: 'medium' },
    { id: 'ctrl_backup', name: 'Backup testing', category: 'Resilience', level: 'poor' },
  ]);

  const [integrations] = useState<SecurityIntegration[]>([
    { id: 'int_siem', name: 'SIEM integration', status: 'active', description: 'Security events forwarded to SIEM.' },
    { id: 'int_sso', name: 'SSO / Identity Provider', status: 'active', description: 'SSO configured for all users.' },
    { id: 'int_2fa', name: '2FA enforcement', status: 'inactive', description: '2FA not enforced for all users.' },
    {
      id: 'int_vuln',
      name: 'Vulnerability scanner',
      status: 'not_configured',
      description: 'Scanner not yet connected to assets.',
    },
  ]);

  const [warnings] = useState<SecurityWarning[]>([
    { id: 'warn_1', severity: 'high', message: '2FA is not enforced for all users.' },
    { id: 'warn_2', severity: 'medium', message: 'Backups have not been tested in 90 days.' },
  ]);

  const [events] = useState<SecurityEvent[]>([
    {
      id: 'evt_1',
      timestamp: '2025-05-14T10:00:00Z',
      event: 'User failed login attempt',
      source: 'Identity provider',
      severity: 'warning',
    },
    {
      id: 'evt_2',
      timestamp: '2025-05-14T09:20:00Z',
      event: 'Firewall rule updated',
      source: 'Network firewall',
      severity: 'info',
    },
    {
      id: 'evt_3',
      timestamp: '2025-05-13T18:00:00Z',
      event: 'Backup completed successfully',
      source: 'Backup system',
      severity: 'info',
    },
    {
      id: 'evt_4',
      timestamp: '2025-05-13T16:45:00Z',
      event: 'Unusual login pattern detected',
      source: 'SIEM',
      severity: 'critical',
    },
  ]);

  return {
    score,
    kpis,
    controls,
    integrations,
    warnings,
    events,
    isLoading: false,
    isError: false,
  };
}

export default useSecurityHealthMockData;
