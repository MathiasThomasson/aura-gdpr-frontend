import React, { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, PlusCircle, Filter, RefreshCcw, UploadCloud, Info, Wand2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import useDocuments, { DocumentRecord } from '@/hooks/useDocuments';
import useUploadDocument from '@/hooks/useUploadDocument';
import DocumentStatusBadge from '@/components/documents/DocumentStatusBadge';
import { useToast } from '@/components/ui/use-toast';

const formatDate = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleDateString();
};

const bytesToSize = (bytes?: number) => {
  if (!bytes) return '—';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

const DocumentsPage: React.FC = () => {
  const { data, loading, error, reload } = useDocuments();
  const { upload, uploading, error: uploadError } = useUploadDocument();
  const { toast } = useToast();
  const [selected, setSelected] = useState<DocumentRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const raw = data ?? (data as any) ?? null;
  const documents = useMemo(() => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw as any[];
    if (Array.isArray((raw as any)?.documents)) return (raw as any).documents as any[];
    if (Array.isArray((raw as any)?.items)) return (raw as any).items as any[];
    return [];
  }, [raw]);

  const handleFileSelect = async (file: File) => {
    try {
      const doc = await upload(file);
      toast({ title: 'Upload complete', description: `${doc.name} uploaded successfully.` });
      reload();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: err?.message ?? 'Could not upload document.',
      });
    }
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const aiSummary = useMemo(() => {
    if (!selected) return 'Select a document to view its AI summary.';
    return selected.ai_summary || 'No AI summary available yet.';
  }, [selected]);

  const renderRows = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, idx) => (
        <tr key={idx} className="border-b border-border/50">
          <td className="p-3"><Skeleton className="h-4 w-10" /></td>
          <td className="p-3"><Skeleton className="h-4 w-40" /></td>
          <td className="p-3"><Skeleton className="h-4 w-20" /></td>
          <td className="p-3"><Skeleton className="h-4 w-24" /></td>
          <td className="p-3"><Skeleton className="h-4 w-16" /></td>
        </tr>
      ));
    }

    if (!documents.length) {
      return (
        <tr>
          <td colSpan={5} className="p-6 text-center text-muted-foreground">
            No documents yet. Upload your first file to get started.
          </td>
        </tr>
      );
    }

    return documents.map((doc) => (
      <tr
        key={doc.id}
        className="border-b border-border/50 hover:bg-muted/50 cursor-pointer"
        onClick={() => setSelected(doc)}
      >
        <td className="p-3 w-32">
          <DocumentStatusBadge status={doc.status ?? 'unknown'} />
        </td>
        <td className="p-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-500" />
            <div>
              <div className="font-medium">{doc.name}</div>
              <div className="text-xs text-muted-foreground">Updated {formatDate(doc.updated_at ?? doc.created_at)}</div>
            </div>
          </div>
        </td>
        <td className="p-3 text-sm text-muted-foreground">{doc.type || '—'}</td>
        <td className="p-3 text-sm text-muted-foreground">{bytesToSize(doc.size_bytes)}</td>
        <td className="p-3">
          <div className="flex flex-wrap gap-1">
            {doc.tags?.length
              ? doc.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[11px]">
                    {tag}
                  </Badge>
                ))
              : '—'}
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Upload, manage, and analyze your GDPR-related documents."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-r from-sky-500 to-purple-600 text-white"
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>
        }
      />

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-destructive">Failed to load documents: {error}</p>
              <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
            </div>
            <Button size="sm" onClick={reload}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {uploadError && (
        <Card className="border-amber-400/50">
          <CardContent className="py-3 text-sm text-amber-700">Upload warning: {uploadError}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Library</CardTitle>
              <CardDescription>Tenant documents and processing files.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Document</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Tags</th>
                </tr>
              </thead>
              <tbody>{renderRows()}</tbody>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="border-dashed hover:border-primary transition-colors"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-sky-500" />
                Upload a document
              </CardTitle>
              <CardDescription>Drag & drop, or click to select a file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className="border border-dashed border-muted rounded-md p-4 text-center text-sm text-muted-foreground cursor-pointer hover:border-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                Drop PDF/DOCX files here, or click to browse.
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Choose file
              </Button>
              <p className="text-xs text-muted-foreground">Max 25MB per file. Supported: PDF, DOCX, TXT.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4 text-sky-500" />
                Details
              </CardTitle>
              <CardDescription>Metadata for the selected document.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {selected ? (
                <>
                  <div className="font-semibold">{selected.name}</div>
                  <div className="text-muted-foreground">Type: {selected.type || '—'}</div>
                  <div className="text-muted-foreground">Last updated: {formatDate(selected.updated_at)}</div>
                  <div className="text-muted-foreground">Size: {bytesToSize(selected.size_bytes)}</div>
                  <div className="text-muted-foreground">Status: <DocumentStatusBadge status={selected.status} /></div>
                  {selected.metadata && (
                    <div className="pt-2">
                      <div className="text-xs uppercase text-muted-foreground">Metadata</div>
                      <pre className="text-xs bg-muted/60 rounded p-2 overflow-auto max-h-40">
                        {JSON.stringify(selected.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Select a document to see its details.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-purple-500" />
                AI Summary
              </CardTitle>
              <CardDescription>Extracted insight from the selected document.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{aiSummary}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
