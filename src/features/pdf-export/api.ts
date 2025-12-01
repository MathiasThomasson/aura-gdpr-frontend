import type { PdfExportPayload } from './types';

// TODO: replace with real API call when backend export is available.
export async function exportResourceToPdf(payload: PdfExportPayload): Promise<void> {
  console.log('PDF export stub called with payload:', payload);

  // Example of how this could be implemented later:
  // const res = await fetch('/exports/pdf', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error('Failed to export PDF');
  // const blob = await res.blob();
  // const url = URL.createObjectURL(blob);
  // window.open(url, '_blank');

  await new Promise((resolve) => setTimeout(resolve, 1200));
}
