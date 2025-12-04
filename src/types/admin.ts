export type PlatformOverviewResponse = {
  total_tenants: number;
  total_users: number;
  total_dsrs: number;
  total_dpias: number;
};

export type PlatformTenantListItem = {
  id: number;
  name: string;
  plan: string;
  status: string;
  created_at: string;
};
