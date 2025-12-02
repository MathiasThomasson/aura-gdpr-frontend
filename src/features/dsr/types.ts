export type DataSubjectRequestType =
  | 'access'
  | 'rectification'
  | 'erasure'
  | 'restriction'
  | 'portability'
  | 'objection'
  | 'other';

export type DataSubjectRequestPriority = 'low' | 'medium' | 'high';

export type DataSubjectRequestStatus =
  | 'received'
  | 'identity_required'
  | 'in_progress'
  | 'waiting_for_information'
  | 'completed'
  | 'rejected';

export type DataSubjectRequestEvent = {
  id: string;
  label: string;
  timestamp: string;
};

export type DataSubjectRequest = {
  id?: string;
  type: DataSubjectRequestType;
  data_subject: string;
  email?: string | null;
  status: DataSubjectRequestStatus;
  received_at?: string;
  due_at?: string | null;
  created_at?: string;
  updated_at?: string;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  identifier?: string | null;
  description?: string | null;
  priority?: DataSubjectRequestPriority | null;
  events?: DataSubjectRequestEvent[];
};

export type CreateDataSubjectRequestInput = {
  type: DataSubjectRequestType;
  data_subject: string;
  email: string;
  identifier?: string;
  description: string;
  due_at: string;
  priority?: DataSubjectRequestPriority;
};

export type PublicDsrLink = {
  enabled: boolean;
  publicKey: string | null;
};
