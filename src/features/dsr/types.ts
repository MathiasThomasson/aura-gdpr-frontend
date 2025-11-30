export type DataSubjectRequestType =
  | 'access'
  | 'rectification'
  | 'erasure'
  | 'restriction'
  | 'portability'
  | 'objection'
  | 'other';

export type DataSubjectRequestPriority = 'low' | 'medium' | 'high';

export type DataSubjectRequestStatus = 'pending' | 'in_progress' | 'completed' | 'closed' | 'unknown';

export type DataSubjectRequest = {
  id?: string;
  type: DataSubjectRequestType;
  data_subject: string;
  email?: string | null;
  status?: DataSubjectRequestStatus;
  received_at?: string;
  due_at?: string | null;
  identifier?: string | null;
  description?: string | null;
  priority?: DataSubjectRequestPriority | null;
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
