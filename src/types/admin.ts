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
  contact_email?: string | null;
  paypal_subscription_id?: string | null;
  feature_flags?: Record<string, boolean>;
  ai_usage?: { tokens?: number; calls?: number };
};

export type PlatformUserItem = {
  id: number;
  email: string;
  role: string;
  tenant_id?: number | null;
  tenant_name?: string | null;
  last_login_at?: string | null;
  status: string;
};

export type PlatformPlan = {
  id: string;
  name: string;
  monthly_price_eur: number;
  yearly_price_eur: number;
  paypal_product_id?: string | null;
  paypal_plan_id_monthly?: string | null;
  paypal_plan_id_yearly?: string | null;
  included_ai_tokens: number;
  max_users: number;
  features: string[];
};

export type PlatformBillingStatus = {
  tenant_id: number;
  plan: string;
  billing_cycle: string;
  next_payment_date?: string | null;
  paypal_subscription_id?: string | null;
  status: string;
  payment_history: any[];
};

export type PayPalConfig = {
  mode: string;
  client_id_masked: string;
  webhook_id?: string | null;
};

export type PayPalWebhookEvent = {
  event_id: string;
  event_type: string;
  status: string;
  received_at: string;
  tenant_id?: number | null;
  message?: string | null;
};

export type AIUsageItem = {
  tenant_id: number;
  tenant_name: string;
  plan: string;
  ai_tokens_30d: number;
  ai_calls_30d: number;
  overage_tokens: number;
  status: string;
  limits?: Record<string, any>;
};

export type AIUsageSummary = {
  tokens_24h: number;
  tokens_7d: number;
  tokens_30d: number;
  cost_eur_estimate: number;
  items: AIUsageItem[];
};

export type LogItem = {
  timestamp: string;
  level: string;
  service: string;
  tenant_id?: number | null;
  message: string;
  details?: string | null;
};

export type JobStatus = {
  name: string;
  last_run?: string | null;
  status: string;
  message?: string | null;
};

export type WebhookItem = {
  id: string;
  name: string;
  target_url: string;
  events: string[];
  status: string;
  last_delivery_status?: string | null;
};

export type ApiKeyItem = {
  id: string;
  name: string;
  key_id: string;
  created_at: string;
  last_used?: string | null;
  scopes: string[];
  status: string;
};

export type FeatureFlagItem = {
  name: string;
  description?: string | null;
  status: boolean;
  scope: string;
};

export type GlobalConfig = {
  default_ai_model: string;
  max_upload_mb: number;
  global_rate_limit_rpm: number;
  dsr_default_deadline_days: number;
  monthly_audit_day: number;
};
