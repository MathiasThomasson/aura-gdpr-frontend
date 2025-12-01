import type { AuditRun } from './types';

export async function fetchLatestAiAudit(): Promise<AuditRun | null> {
  return {
    id: 'audit_001',
    createdAt: '2025-05-10T09:00:00Z',
    completedAt: '2025-05-10T09:00:10Z',
    overallScore: 78,
    areas: [
      {
        key: 'dsr',
        name: 'Data subject requests',
        score: 82,
        status: 'needs_attention',
        summary: 'Response times are good, but you lack a formal identity verification guideline.',
        recommendationsCount: 2,
      },
      {
        key: 'policies',
        name: 'Policies',
        score: 74,
        status: 'needs_attention',
        summary: 'Several policies have not been reviewed in the last 18 months.',
        recommendationsCount: 3,
      },
      {
        key: 'documents',
        name: 'Documents',
        score: 80,
        status: 'good',
        summary: 'Most core GDPR documents exist and are up to date.',
        recommendationsCount: 1,
      },
      {
        key: 'dpia',
        name: 'DPIA',
        score: 65,
        status: 'needs_attention',
        summary: 'Some high-risk processing activities are missing DPIAs.',
        recommendationsCount: 2,
      },
      {
        key: 'ropa',
        name: 'ROPA',
        score: 70,
        status: 'needs_attention',
        summary: 'Your records of processing activities are incomplete for some systems.',
        recommendationsCount: 2,
      },
      {
        key: 'incidents',
        name: 'Incidents',
        score: 85,
        status: 'good',
        summary: 'Incident logging is in place with no unresolved incidents.',
        recommendationsCount: 0,
      },
      {
        key: 'security_measures',
        name: 'Security measures',
        score: 76,
        status: 'needs_attention',
        summary: 'Technical measures are documented, but regular reviews are missing.',
        recommendationsCount: 2,
      },
    ],
    recommendations: [
      {
        id: 'rec_1',
        area: 'policies',
        title: 'Review and update privacy and cookie policies',
        description: 'Your last review was more than 18 months ago. Update the policies and document the review date.',
        severity: 'medium',
        estimatedImpact: 'Improves transparency and reduces legal risk.',
      },
      {
        id: 'rec_2',
        area: 'dpia',
        title: 'Perform DPIA for high-risk processing activities',
        description: 'At least two processing activities meet the criteria for mandatory DPIAs.',
        severity: 'high',
        estimatedImpact: 'Reduces risk of non-compliance with GDPR Article 35.',
      },
      {
        id: 'rec_3',
        area: 'dsr',
        title: 'Introduce a documented identity verification process',
        description:
          'Create and document a clear process for verifying the identity of data subjects before responding to requests.',
        severity: 'medium',
      },
    ],
  };
}

export async function runAiAudit(): Promise<AuditRun> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const result = await fetchLatestAiAudit();
  if (!result) {
    throw new Error('No audit data available.');
  }
  return result;
}
