import { useState, useCallback } from 'react';
import api from '@/lib/apiClient';
import { DocumentRecord } from './useDocuments';

type UploadResponse = {
  document: DocumentRecord;
};

export const useUploadDocument = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post<UploadResponse>('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.document;
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error };
};

export default useUploadDocument;
