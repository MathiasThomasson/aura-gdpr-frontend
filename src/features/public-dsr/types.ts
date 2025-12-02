export type PublicDsrRequestType =
  | 'access'
  | 'rectification'
  | 'erasure'
  | 'restriction'
  | 'portability'
  | 'objection'
  | 'other';

export type PublicDsrPriority = 'low' | 'medium' | 'high';

export type PublicDsrPayload = {
  fullName: string;
  email: string;
  requestType: PublicDsrRequestType;
  description: string;
  priority: PublicDsrPriority;
};
