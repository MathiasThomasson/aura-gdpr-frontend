import { BillingHistoryItem, TenantPlan, UsageSummaryData } from '../types';

export function useBillingMockData() {
  const currentPlan: TenantPlan = {
    type: 'pro',
    name: 'Pro plan',
    pricePerMonth: 99,
    currency: 'EUR',
    isTrial: false,
    trialDaysLeft: 0,
    features: [
      'Unlimited data subject requests',
      'Unlimited documents and policies',
      'AI policy and DPIA generator',
      'Priority support',
    ],
  };

  const usage: UsageSummaryData = {
    dsrCountThisMonth: 7,
    documentsCount: 24,
    policiesCount: 6,
    aiCallsThisMonth: 132,
    maxDsrsPerMonth: undefined,
    maxAiCallsPerMonth: 2000,
  };

  const history: BillingHistoryItem[] = [
    {
      id: 'inv_001',
      date: '2025-03-01T09:15:00Z',
      amount: 99,
      currency: 'EUR',
      description: 'AURA-GDPR Pro plan – March 2025',
      status: 'paid',
      invoiceUrl: '#',
    },
    {
      id: 'inv_002',
      date: '2025-02-01T09:12:00Z',
      amount: 99,
      currency: 'EUR',
      description: 'AURA-GDPR Pro plan – February 2025',
      status: 'paid',
      invoiceUrl: '#',
    },
  ];

  return {
    currentPlan,
    usage,
    history,
    isLoading: false,
    isError: false,
  };
}

export default useBillingMockData;
