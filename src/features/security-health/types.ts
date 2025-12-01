export interface SecurityKpi {
  id: string;
  label: string;
  value: number;
  max: number;
}

export type ControlHealthLevel = 'good' | 'medium' | 'poor';

export interface SecurityControl {
  id: string;
  name: string;
  category: string;
  level: ControlHealthLevel;
}

export type IntegrationStatus = 'active' | 'inactive' | 'not_configured';

export interface SecurityIntegration {
  id: string;
  name: string;
  status: IntegrationStatus;
  description: string;
}

export interface SecurityWarning {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  severity: 'info' | 'warning' | 'critical';
}
