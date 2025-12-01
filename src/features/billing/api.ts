import api from '@/lib/apiClient';
import type { BillingHistoryItem, TenantPlan, UsageSummaryData } from './types';

const mapPlan = (item: any): TenantPlan => ({
  type: item?.type ?? 'free',
  name: item?.name ?? 'Plan',
  pricePerMonth: item?.pricePerMonth ?? item?.price_per_month ?? 0,
  currency: item?.currency ?? 'EUR',
  isTrial: Boolean(item?.isTrial ?? item?.is_trial ?? false),
  trialDaysLeft: item?.trialDaysLeft ?? item?.trial_days_left ?? undefined,
  features: item?.features ?? [],
});

const mapUsage = (item: any): UsageSummaryData => ({
  dsrCountThisMonth: item?.dsrCountThisMonth ?? item?.dsr_count_this_month ?? 0,
  documentsCount: item?.documentsCount ?? item?.documents_count ?? 0,
  policiesCount: item?.policiesCount ?? item?.policies_count ?? 0,
  aiCallsThisMonth: item?.aiCallsThisMonth ?? item?.ai_calls_this_month ?? 0,
  maxDsrsPerMonth: item?.maxDsrsPerMonth ?? item?.max_dsrs_per_month ?? undefined,
  maxAiCallsPerMonth: item?.maxAiCallsPerMonth ?? item?.max_ai_calls_per_month ?? undefined,
});

const mapHistoryItem = (item: any): BillingHistoryItem => ({
  id: item?.id ?? item?._id ?? '',
  date: item?.date ?? item?.created_at ?? '',
  amount: item?.amount ?? 0,
  currency: item?.currency ?? 'EUR',
  description: item?.description ?? '',
  status: item?.status ?? 'paid',
  invoiceUrl: item?.invoiceUrl ?? item?.invoice_url ?? undefined,
});

const normalizeHistory = (payload: unknown): BillingHistoryItem[] => {
  if (Array.isArray(payload)) return payload.map(mapHistoryItem);
  const value = payload as { items?: unknown; invoices?: unknown };
  if (Array.isArray(value?.items)) return value.items.map(mapHistoryItem);
  if (Array.isArray(value?.invoices)) return value.invoices.map(mapHistoryItem);
  return [];
};

export async function getCurrentPlan(): Promise<TenantPlan> {
  const res = await api.get('/api/billing/plan');
  return mapPlan(res.data);
}

export async function getUsage(): Promise<UsageSummaryData> {
  const res = await api.get('/api/billing/usage');
  return mapUsage(res.data);
}

export async function getBillingHistory(): Promise<BillingHistoryItem[]> {
  const res = await api.get('/api/billing/invoices');
  return normalizeHistory(res.data);
}

export async function openBillingPortal(): Promise<void> {
  const res = await api.post('/api/billing/portal');
  const url: string | undefined = res?.data?.url;
  if (url) {
    window.open(url, '_blank');
  } else {
    throw new Error('Billing portal URL not available.');
  }
}
