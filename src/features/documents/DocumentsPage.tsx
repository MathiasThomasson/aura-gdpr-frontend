import React from 'react';
import { Sparkles } from 'lucide-react';
import PageInfoBox from '@/components/PageInfoBox';
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Documents</h1>
          <p className="text-sm text-slate-600">
            Manage all your GDPR-related documents, policies, and agreements in one place.
          </p>
        </div>
        <NewDocumentMenu onNewBlank={handleCreateBlank} onTemplateSelect={handleCreateFromTemplate} />
      </div>

      <PageInfoBox
        title="Document center"
        description="Centralize policies, agreements, and guidelines. Future AI assistance will help you draft, review, and publish faster."
      />

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Documents guidance</h3>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
          <li>Use this space to store GDPR evidence, templates, and signed agreements.</li>
          <li>Every file keeps version history so you can track who changed what.</li>
          <li>AI-assisted generation drafts policies and notices faster.</li>
          <li>Upload rules: PDF and DOCX are supported for storage and review.</li>
        </ul>
      </div>

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

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 text-sky-600" />
          <div>
            <p className="font-semibold text-slate-800">AI document workflows (coming soon)</p>
            <p>
              Generate drafts, review for GDPR gaps, and keep your templates up to date with AI assistance. This UI is
              ready for future integration.
            </p>
          </div>
        </div>
      </div>

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
