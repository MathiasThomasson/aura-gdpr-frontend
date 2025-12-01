export type PdfExportResourceType =
  | 'dsr'
  | 'dpia'
  | 'ropa'
  | 'incident'
  | 'document'
  | 'policy';

export interface PdfExportPayload {
  resourceType: PdfExportResourceType;
  resourceId: string;
}
