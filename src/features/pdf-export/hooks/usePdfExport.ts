import { useState } from 'react';
import { exportResourceToPdf } from '../api';
import type { PdfExportResourceType } from '../types';

interface UsePdfExportOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function usePdfExport(options?: UsePdfExportOptions) {
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = async (resourceType: PdfExportResourceType, resourceId: string) => {
    setIsExporting(true);
    try {
      await exportResourceToPdf({ resourceType, resourceId });
      if (options?.onSuccess) {
        options.onSuccess();
      } else {
        // eslint-disable-next-line no-alert
        alert('PDF export completed. In a future update this will download the generated PDF.');
      }
    } catch (error) {
      console.error('Failed to export PDF', error);
      if (options?.onError) {
        options.onError();
      } else {
        // eslint-disable-next-line no-alert
        alert('Failed to export PDF. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, exportPdf };
}
