import React, { useEffect, useState } from 'react';
import PageInfoBox from '@/components/PageInfoBox';
import { useAuth } from '@/contexts/AuthContext';

type DocumentItem = {
  id?: string;
  title?: string;
  name?: string;
  type?: string;
  created_at?: string;
};

const DocumentsPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!accessToken) {
        setError('Unable to fetch documents.');
        setLoading(false);
        setData([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/documents', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error('Unable to fetch documents.');
        const json = await res.json();
        if (cancelled) return;
        const normalized = Array.isArray(json)
          ? json
          : Array.isArray((json as any)?.items)
            ? (json as any).items
            : Array.isArray((json as any)?.documents)
              ? (json as any).documents
              : [];
        setData(normalized);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message ?? 'Unable to fetch documents.');
        setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const documents: DocumentItem[] = Array.isArray(data) ? data : [];
  const hasDocuments = documents.length > 0;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Documents</h1>
          <p className="text-sm text-muted-foreground">
            A clean and stable Documents 1.1 experience while the full module is finalized.
          </p>
        </div>

        <PageInfoBox
          title="Documents"
          description="This is your central library for all GDPR-related documentation. Upload your own files or generate new documents using AURA’s AI."
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Upload Document
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Generate AI Document
          </button>
        </div>

        <div className="rounded-lg border border-border bg-card text-card-foreground p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Documents</h2>
          {loading && <p className="text-sm text-muted-foreground">Loading documents...</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {!loading && !error && (
            <>
              {hasDocuments ? (
                <ul className="space-y-3">
                  {documents.map((doc, idx) => (
                    <li key={doc.id ?? idx} className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
                      <div className="font-medium text-foreground">
                        {doc.title ?? doc.name ?? 'Untitled document'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {doc.type ?? 'Unknown type'} ·{' '}
                        {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Date unavailable'}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No documents yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
