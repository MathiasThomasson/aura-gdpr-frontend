import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportPdfButton from '@/features/pdf-export/components/ExportPdfButton';
import { DocumentItem, DocumentStatus, DocumentType, documentStatusLabels, documentTypeLabels } from '../types';
import DocumentStatusBadge from './DocumentStatusBadge';

type Mode = 'view' | 'create';

type Props = {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: DocumentItem) => void;
  mode: Mode;
};

const statusOptions: DocumentStatus[] = ['draft', 'in_review', 'approved', 'published', 'archived'];
const typeOptions: DocumentType[] = [
  'privacy_policy',
  'cookie_policy',
  'data_processing_agreement',
  'security_policy',
  'internal_guideline',
  'other',
];

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const DocumentDetailsDrawer: React.FC<Props> = ({ document, isOpen, onClose, onSave, mode }) => {
  const [draft, setDraft] = React.useState<DocumentItem | null>(document);
  const [aiHint, setAiHint] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(document);
      setAiHint(null);
    }
  }, [document, isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !draft) return null;

  const isEditable = mode === 'create';

  const updateField = <K extends keyof DocumentItem>(key: K, value: DocumentItem[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleGenerate = () => {
    const generated =
      'This document was generated as a placeholder. Replace with your organization-specific policy language.';
    updateField('description', generated);
    setAiHint('AI generation preview placeholder. Replace with real content later.');
  };

  const handleSave = () => {
    if (!draft.name.trim()) return;
    onSave(draft);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{draft.name || 'Untitled document'}</h2>
              <DocumentStatusBadge status={draft.status} />
            </div>
            <p className="text-sm text-slate-600 capitalize">{documentTypeLabels[draft.type]}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Name</span>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => updateField('name', e.target.value)}
                disabled={!isEditable}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Type</span>
                <select
                  value={draft.type}
                  onChange={(e) => updateField('type', e.target.value as DocumentType)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {documentTypeLabels[t]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Status</span>
                <select
                  value={draft.status}
                  onChange={(e) => updateField('status', e.target.value as DocumentStatus)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {documentStatusLabels[s]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Owner</span>
              <input
                type="text"
                value={draft.owner}
                onChange={(e) => updateField('owner', e.target.value)}
                disabled={!isEditable}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Tags (comma separated)</span>
              <input
                type="text"
                value={draft.tags?.join(', ') || ''}
                onChange={(e) => updateField('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                disabled={!isEditable}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Description</span>
              <textarea
                value={draft.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                disabled={!isEditable}
                className="min-h-[120px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                placeholder="Summary or key points for this document."
              />
            </label>

            <button
              type="button"
              disabled
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 text-sm text-sky-600 disabled:cursor-not-allowed"
              title="AI generation will be available soon."
            >
              <Sparkles className="h-4 w-4" />
              Generate with AI (coming soon)
            </button>
            {aiHint && <p className="text-xs text-slate-500">{aiHint}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-2">
            <div>
              <p className="font-semibold text-slate-800">Created</p>
              <p>{formatDateTime(draft.createdAt)}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Last updated</p>
              <p>{formatDateTime(draft.lastUpdated)}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {!isEditable && draft.id && <ExportPdfButton resourceType="document" resourceId={draft.id} />}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {isEditable ? (
                <Button onClick={handleSave}>Create document</Button>
              ) : (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsDrawer;
