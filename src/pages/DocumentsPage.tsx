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
        setError('Kunde inte hämta dokument.');
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
        if (!res.ok) throw new Error('Kunde inte hämta dokument.');
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
        setError(err?.message ?? 'Ett fel inträffade vid hämtning av dokument.');
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
    <div className="p-6 space-y-6">
      <div style={{ background: 'red', padding: '20px' }}>
        <b>DOCUMENTS PAGE — BUILD TEST</b>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Documents</h1>
        <p className="text-sm text-muted-foreground">
          A simple, safe Documents 1.0 experience while the full module is finalized.
        </p>
      </div>

      <PageInfoBox
        title="Documents"
        description="Här lagras alla GDPR-dokument. Du kan ladda upp egna filer eller generera nya dokument med AI."
      />

      <div className="flex gap-3">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Upload document
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Generate AI Document
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card text-card-foreground p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Dokument</h2>
        {loading && <p className="text-sm text-muted-foreground">Laddar dokument...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && (
          <>
            {hasDocuments ? (
              <ul className="space-y-2">
                {documents.map((doc, idx) => (
                  <li key={doc.id ?? idx} className="rounded border border-border/70 bg-muted/30 px-3 py-2">
                    <div className="font-medium text-foreground">{doc.title ?? doc.name ?? 'Namnlöst dokument'}</div>
                    <div className="text-xs text-muted-foreground">
                      {doc.type ?? 'Okänd typ'} · {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Datum saknas'}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Inga dokument ännu.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
