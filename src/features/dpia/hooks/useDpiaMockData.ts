import { useState } from 'react';
import { DpiaItem } from '../types';

export function useDpiaMockData() {
  const [dpias, setDpias] = useState<DpiaItem[]>([
    {
      id: 'dpia_001',
      name: 'Marketing automation DPIA',
      systemName: 'Hubspot Marketing',
      owner: 'Data Protection Officer',
      status: 'approved',
      createdAt: '2025-02-10T09:00:00Z',
      lastUpdated: '2025-03-01T09:00:00Z',
      purpose: 'Assess risks related to automated email campaigns and tracking.',
      legalBasis: 'Legitimate interest and consent.',
      processingDescription:
        'Processing of contact details, engagement metrics and website behaviour for marketing purposes.',
      dataSubjects: 'Existing customers and newsletter subscribers.',
      dataCategories: 'Contact details, behavioural data, communication preferences.',
      recipients: 'Internal marketing team and CRM provider.',
      transfersOutsideEU: 'Data is stored in EU data centers; some support access from US.',
      mitigationMeasures: 'Data minimisation, clear consent management, opt-out for marketing, DPIA review every 12 months.',
      risk: {
        likelihood: 3,
        impact: 3,
        overallScore: 9,
        level: 'medium',
      },
    },
    {
      id: 'dpia_002',
      name: 'Employee monitoring DPIA',
      systemName: 'Workplace Monitoring Tool',
      owner: 'HR Director',
      status: 'in_review',
      createdAt: '2025-04-01T10:00:00Z',
      lastUpdated: '2025-04-15T11:30:00Z',
      purpose: 'Monitor workstation usage for security and productivity analysis.',
      legalBasis: 'Legitimate interest.',
      processingDescription: 'Processing of log-in times, application usage and visited websites for employees.',
      dataSubjects: 'Employees in EU offices.',
      dataCategories: 'Usage logs, metadata, device identifiers.',
      recipients: 'Security team and HR.',
      transfersOutsideEU: 'No transfers outside the EU are planned.',
      mitigationMeasures: 'Strict access control, pseudonymisation for analytics, clear employee information, limited retention.',
      risk: {
        likelihood: 4,
        impact: 4,
        overallScore: 16,
        level: 'high',
      },
    },
  ]);

  return {
    dpias,
    setDpias,
    isLoading: false,
    isError: false,
  };
}

export default useDpiaMockData;
