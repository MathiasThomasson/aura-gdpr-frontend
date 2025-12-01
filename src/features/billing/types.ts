export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';

export interface TenantPlan {
  type: PlanType;
  name: string;
  pricePerMonth: number;
  currency: string;
  isTrial: boolean;
  trialDaysLeft?: number;
  features: string[];
}

export interface UsageSummaryData {
  dsrCountThisMonth: number;
  documentsCount: number;
  policiesCount: number;
  aiCallsThisMonth: number;
  maxDsrsPerMonth?: number;
  maxAiCallsPerMonth?: number;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}
