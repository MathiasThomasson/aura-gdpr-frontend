import React from 'react';
import { Sparkles } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/apiClient';
import useDocuments from './hooks/useDocuments';
import { DocumentItem, DocumentStatus, DocumentType } from './types';
import DocumentFiltersBar from './components/DocumentFiltersBar';
import DocumentTable from './components/DocumentTable';
import DocumentDetailsDrawer from './components/DocumentDetailsDrawer';
import NewDocumentMenu from './components/NewDocumentMenu';

type FilterStatus = DocumentStatus | 'all';
type FilterType = DocumentType | 'all';

const DocumentsPage: React.FC = () => {
  const { documents, loading, detailLoading, saving, error, refresh, create, update, fetchOne } = useDocuments();
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<FilterStatus>('all');
  const [type, setType] = React.useState<FilterType>('all');
  const [selected, setSelected] = React.useState<DocumentItem | null>(null);
  const [drawerMode, setDrawerMode] = React.useState<'view' | 'create'>('view');
  const [aiSource, setAiSource] = React.useState('');
  const [aiInstructions, setAiInstructions] = React.useState('');
  const [aiResult, setAiResult] = React.useState('');
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [aiLoading, setAiLoading] = React.useState(false);
  const hasAnyDocuments = documents.length > 0;

  const filtered = React.useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        (doc.tags || []).some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = status === 'all' ? true : doc.status === status;
      const matchesType = type === 'all' ? true : doc.type === type;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [documents, search, status, type]);

  const handleSelect = (doc: DocumentItem) => {
    setSelected(doc);
    setDrawerMode('view');
    if (doc.id) {
      fetchOne(doc.id).then((detail) => setSelected(detail)).catch(() => {});
    }
  };

  const handleCreateBlank = () => {
    const now = new Date().toISOString();
    setSelected({
      id: '',
      name: 'New document',
      type: 'other',
      status: 'draft',
      owner: '',
      lastUpdated: now,
      createdAt: now,
      description: '',
      tags: [],
    });
    setDrawerMode('create');
  };

  const handleCreateFromTemplate = (template: { name: string; type: string; description?: string }) => {
    const now = new Date().toISOString();
    setSelected({
      id: '',
      name: template.name,
      type: template.type as DocumentType,
      status: 'draft',
      owner: '',
      lastUpdated: now,
      createdAt: now,
      description: template.description ?? '',
      tags: ['template'],
    });
    setDrawerMode('create');
  };

  const handleSave = async (doc: DocumentItem) => {
    if (drawerMode === 'create') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = doc;
      await create(rest as Omit<DocumentItem, 'id'>);
    } else if (doc.id) {
      await update(doc.id, doc);
    }
    await refresh();
    setSelected(null);
    setDrawerMode('view');
  };

  const handleImproveWithAi = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await api.post('/ai/documents/improve', {
        content: aiSource,
        instructions: aiInstructions,
      });
      const improved = (res.data?.content ?? res.data?.improved ?? '') as string;
      setAiResult(improved || 'AI did not return improved content.');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI request failed.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Documents"
        subtitle="Store and manage all GDPR-related documents in one place."
        actions={<NewDocumentMenu onNewBlank={handleCreateBlank} onTemplateSelect={handleCreateFromTemplate} />}
      />

      <PageIntro
        title="What you can do here"
        subtitle="Centralize policies, agreements, and evidence."
        bullets={[
          'Upload and categorize documents by status and type.',
          'Filter drafts and published versions quickly.',
          'Use AI to improve drafts before sharing.',
        ]}
      />

      <Card title="Documents guidance" subtitle="Tips to keep your evidence organized.">
        <ul className="list-disc space-y-1 pl-4 text-sm text-slate-700">
          <li>Use this space to store GDPR evidence, templates, and signed agreements.</li>
          <li>Track versions so you know who changed what and when.</li>
          <li>AI-assisted generation drafts policies and notices faster.</li>
          <li>Upload rules: PDF and DOCX are supported for storage and review.</li>
        </ul>
      </Card>

      <Card title="Documents" subtitle="Filter and manage your library.">
        <DocumentFiltersBar
          search={search}
          status={status}
          type={type}
          onSearch={setSearch}
          onStatusChange={setStatus}
          onTypeChange={setType}
        />

        <DocumentTable
          documents={filtered}
          onSelect={handleSelect}
          isLoading={loading}
          isError={Boolean(error)}
          errorMessage={error}
          onRetry={refresh}
          hasDocuments={hasAnyDocuments}
          onCreate={handleCreateBlank}
        />
      </Card>

      <Card
        title="Improve document with AI"
        subtitle="Send a draft to AURA and get improved wording back."
        actions={
          <Button size="sm" variant="outline" onClick={handleImproveWithAi} disabled={aiLoading}>
            {aiLoading ? 'Improving...' : 'Run AI'}
          </Button>
        }
      >
        <div className="space-y-3">
          <Textarea
            placeholder="Paste your document text"
            value={aiSource}
            onChange={(e) => setAiSource(e.target.value)}
            rows={4}
          />
          <Textarea
            placeholder="Instructions for AI (tone, focus areas, audience)"
            value={aiInstructions}
            onChange={(e) => setAiInstructions(e.target.value)}
            rows={3}
          />
          {aiError ? <p className="text-xs text-rose-600">{aiError}</p> : null}
          {aiResult ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-700">AI suggestion</p>
              <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">{aiResult}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span>AI responses are drafts; review before publishing.</span>
          </div>
        </div>
      </Card>

      <DocumentDetailsDrawer
        document={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        onSave={handleSave}
        mode={drawerMode}
        isLoading={detailLoading}
        isSaving={saving}
      />
    </div>
  );
};

export default DocumentsPage;
