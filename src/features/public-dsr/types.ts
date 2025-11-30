export type PublicDsrRequestType =
  | 'access'
  | 'rectification'
  | 'erasure'
  | 'restriction'
  | 'portability'
  | 'objection'
  | 'other';

export type PublicDsrPayload = {
  fullName: string;
  email: string;
  requestType: PublicDsrRequestType;
  identifier?: string;
  description: string;
  confirmAccuracy?: boolean;
};
