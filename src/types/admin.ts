export type PlatformOverviewResponse = {
  total_tenants: number;
  total_users: number;
  total_dsrs: number;
  total_dpias: number;
  active_subscriptions?: number;
  mrr_eur?: number;
  ai_tokens_30d?: number;
  new_tenants_by_month?: Array<{ month: string; count: number }>;
  ai_tokens_by_month?: Array<{ month: string; tokens: number }>;
  system_health?: {
    backend?: string;
    database?: string;
    last_deploy?: string;
    git_sha?: string;
  };
};

export type PlatformTenantListItem = {
  id: number;
  name: string;
  plan: string;
  status: string;
  created_at: string;
  users?: number;
  next_billing_date?: string | null;
};
