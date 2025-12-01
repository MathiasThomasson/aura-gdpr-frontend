export type IncidentStatus = 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  notes?: string;
}

export interface IncidentItem {
  id: string;
  title: string;
  systemName: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  affectedData: string;
  affectedSubjects: string;
  detectionMethod: string;
  createdAt: string;
  lastUpdated: string;
  timeline: IncidentTimelineEvent[];
}
