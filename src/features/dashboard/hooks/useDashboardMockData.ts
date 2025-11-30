import { useMemo } from 'react';
import { ActivityItem, AiInsight, DashboardSummary, DeadlineItem, RiskOverview } from '../types';

type DashboardData = {
  summary: DashboardSummary;
  deadlines: DeadlineItem[];
  activities: ActivityItem[];
  aiInsights: AiInsight[];
  riskOverview: RiskOverview;
};

export const useDashboardMockData = (): DashboardData => {
  return useMemo(() => {
    const summary: DashboardSummary = {
      complianceScore: 78,
      openDsrs: 3,
      policiesExpiringSoon: 2,
      ongoingDpiaCount: 4,
      activeIncidents: 1,
      overallRiskLevel: 'medium',
    };

    const deadlines: DeadlineItem[] = [
      {
        id: 'dl-1',
        type: 'DSR',
        title: 'Respond to DSR: Jane Doe',
        dueDate: '2025-12-08T10:00:00Z',
        status: 'in_progress',
      },
      {
        id: 'dl-2',
        type: 'Policy',
        title: 'Review Data Retention Policy',
        dueDate: '2025-12-18T09:00:00Z',
        status: 'open',
      },
      {
        id: 'dl-3',
        type: 'DPIA',
        title: 'DPIA for AI Chatbot',
        dueDate: '2026-01-05T12:00:00Z',
        status: 'open',
      },
    ];

    const activities: ActivityItem[] = [
      {
        id: 'act-1',
        timestamp: '2025-12-01T09:14:00Z',
        actor: 'System',
        action: 'Closed DSR request for John Doe.',
        resourceType: 'DSR',
        resourceName: 'DSR-4412',
      },
      {
        id: 'act-2',
        timestamp: '2025-11-30T15:22:00Z',
        actor: 'Admin user',
        action: 'Approved DPIA for Customer Analytics.',
        resourceType: 'DPIA',
        resourceName: 'DPIA-103',
      },
      {
        id: 'act-3',
        timestamp: '2025-11-30T11:08:00Z',
        actor: 'System',
        action: 'Flagged Policy update overdue by 7 days.',
        resourceType: 'Policy',
        resourceName: 'Access Control Policy',
      },
      {
        id: 'act-4',
        timestamp: '2025-11-29T18:45:00Z',
        actor: 'Privacy Officer',
        action: 'Opened new incident: Vendor outage.',
        resourceType: 'Incident',
        resourceName: 'INC-208',
      },
    ];

    const aiInsights: AiInsight[] = [
      {
        id: 'ai-1',
        title: 'High-risk processing without DPIA',
        description: 'You have 3 high-risk processing activities without a completed DPIA.',
        severity: 'critical',
      },
      {
        id: 'ai-2',
        title: 'Policies overdue for review',
        description: 'Two policies have not been reviewed in over 18 months.',
        severity: 'warning',
      },
      {
        id: 'ai-3',
        title: 'DSR response time healthy',
        description: 'Average DSR response time is 4.2 days, within SLA.',
        severity: 'info',
      },
    ];

    const riskOverview: RiskOverview = {
      overallRiskLevel: 'medium',
      highRiskSystems: ['Marketing Automation', 'Data Lake'],
      openIncidents: 1,
      dpiaRequiredCount: 3,
    };

    return { summary, deadlines, activities, aiInsights, riskOverview };
  }, []);
};
