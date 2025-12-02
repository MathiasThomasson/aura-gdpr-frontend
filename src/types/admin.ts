export type PlatformOverviewResponse = {
  tenants_total: number;
  users_total: number;
  dsr_total: number;
  dpia_total: number;
};

export type PlatformTenantListItem = {
  id: string | number;
  name: string;
  plan: string;
  status: string;
  created_at: string;
};
