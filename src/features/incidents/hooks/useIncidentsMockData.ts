import { useState } from 'react';
import { IncidentItem } from '../types';

export function useIncidentsMockData() {
  const [incidents, setIncidents] = useState<IncidentItem[]>([
    {
      id: 'inc_001',
      title: 'Phishing attack reported',
      systemName: 'Email Gateway',
      severity: 'medium',
      status: 'investigating',
      description: 'Multiple employees reported suspicious emails requesting credentials.',
      affectedData: 'Employee contact details and login credentials (potential exposure).',
      affectedSubjects: 'Employees',
      detectionMethod: 'User report and email security alerts.',
      createdAt: '2025-04-12T09:00:00Z',
      lastUpdated: '2025-04-12T10:30:00Z',
      timeline: [
        { id: 't1', timestamp: '2025-04-12T09:00:00Z', actor: 'Security system', action: 'Detected unusual inbound emails' },
        { id: 't2', timestamp: '2025-04-12T09:30:00Z', actor: 'Support', action: 'Incident escalated to DPO' },
        { id: 't3', timestamp: '2025-04-12T10:30:00Z', actor: 'Security team', action: 'Investigation started' },
      ],
    },
    {
      id: 'inc_002',
      title: 'Lost laptop with customer data',
      systemName: 'Endpoint Management',
      severity: 'high',
      status: 'resolved',
      description: 'Laptop containing limited customer PII was lost during travel.',
      affectedData: 'Customer contact details stored locally in encrypted form.',
      affectedSubjects: 'EU customers (limited subset)',
      detectionMethod: 'Employee self-report.',
      createdAt: '2025-03-20T08:00:00Z',
      lastUpdated: '2025-03-22T12:00:00Z',
      timeline: [
        { id: 't4', timestamp: '2025-03-20T08:00:00Z', actor: 'Employee', action: 'Reported lost laptop' },
        { id: 't5', timestamp: '2025-03-20T10:00:00Z', actor: 'Security team', action: 'Device remotely wiped' },
        { id: 't6', timestamp: '2025-03-22T12:00:00Z', actor: 'DPO', action: 'Incident resolved, risk deemed low' },
      ],
    },
    {
      id: 'inc_003',
      title: 'Unauthorized access attempt',
      systemName: 'Identity Provider',
      severity: 'critical',
      status: 'contained',
      description: 'Repeated failed logins from unusual locations targeting admin accounts.',
      affectedData: 'No confirmed data exposure; potential admin access risk.',
      affectedSubjects: 'Internal admins',
      detectionMethod: 'SIEM alert',
      createdAt: '2025-05-01T14:00:00Z',
      lastUpdated: '2025-05-01T15:15:00Z',
      timeline: [
        { id: 't7', timestamp: '2025-05-01T14:00:00Z', actor: 'SIEM', action: 'Detected unusual login attempt' },
        { id: 't8', timestamp: '2025-05-01T14:30:00Z', actor: 'Security team', action: 'MFA enforced and accounts locked' },
        { id: 't9', timestamp: '2025-05-01T15:15:00Z', actor: 'Security team', action: 'Containment measures applied' },
      ],
    },
  ]);

  return {
    incidents,
    setIncidents,
    isLoading: false,
    isError: false,
  };
}

export default useIncidentsMockData;
