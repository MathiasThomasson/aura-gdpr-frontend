export type TomCategory =
  | 'access_control'
  | 'encryption'
  | 'logging_monitoring'
  | 'network_security'
  | 'backup_recovery'
  | 'organizational_policies'
  | 'data_minimization'
  | 'vendor_management'
  | 'other';

export type TomEffectiveness = 'low' | 'medium' | 'high';

export interface TomItem {
  id: string;
  name: string;
  category: TomCategory;
  description: string;
  implementation: string;
  effectiveness: TomEffectiveness;
  owner: string;
  createdAt: string;
  lastUpdated: string;
}
