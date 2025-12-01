import type { FC } from 'react';
import { usePdfExport } from '../hooks/usePdfExport';
import type { PdfExportResourceType } from '../types';

interface ExportPdfButtonProps {
  resourceType: PdfExportResourceType;
  resourceId: string;
  className?: string;
}

export const ExportPdfButton: FC<ExportPdfButtonProps> = ({ resourceType, resourceId, className }) => {
  const { isExporting, exportPdf } = usePdfExport();

  const handleClick = () => {
    void exportPdf(resourceType, resourceId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isExporting}
      className={
        className ??
        'inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
      }
    >
      {isExporting ? 'Exporting…' : 'Export to PDF'}
    </button>
  );
};

export default ExportPdfButton;
