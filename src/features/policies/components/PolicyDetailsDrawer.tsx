import React from 'react';
import { X, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportPdfButton from '@/features/pdf-export/components/ExportPdfButton';
import {
  PolicyItem,
  PolicyStatus,
  PolicyType,
  policyStatusLabels,
  policyTypeLabels,
  GeneratePolicyInput,
} from '../types';
import PolicyStatusBadge from './PolicyStatusBadge';

type Mode = 'view' | 'create' | 'edit';

type Props = {
  policy: PolicyItem | null;
  isOpen: boolean;
  mode: Mode;
  onClose: () => void;
  onSave: (policy: PolicyItem) => void;
  onRegenerateAi?: (input: GeneratePolicyInput) => Promise<void>;
  aiGenerating?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
};

const statusOptions: PolicyStatus[] = ['draft', 'in_review', 'approved', 'published', 'archived'];
const typeOptions: PolicyType[] = [
  'privacy_policy',
  'cookie_policy',
  'data_processing_agreement',
  'data_retention_policy',
  'information_security_policy',
  'internal_guideline',
  'other',
];

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const PolicyDetailsDrawer: React.FC<Props> = ({
  policy,
  isOpen,
  mode,
  onClose,
  onSave,
  onRegenerateAi,
  aiGenerating,
  isLoading = false,
  isSaving = false,
}) => {
  const [draft, setDraft] = React.useState<PolicyItem | null>(policy);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(policy);
    }
  }, [policy, isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const firstInput = panelRef.current?.querySelector<HTMLElement>('input, select, textarea, button');
    firstInput?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !draft) return null;

  const isEditable = mode === 'create' || mode === 'edit';

  const updateField = <K extends keyof PolicyItem>(key: K, value: PolicyItem[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = () => {
    if (!draft.name.trim()) return;
    onSave(draft);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleRegenerate = async () => {
    if (!onRegenerateAi) return;
    await onRegenerateAi({ type: draft.type, contextDescription: draft.summary });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
    >
      <div className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{draft.name || 'Untitled policy'}</h2>
              <PolicyStatusBadge status={draft.status} />
            </div>
            <p className="text-sm text-slate-600 capitalize">{policyTypeLabels[draft.type]}</p>
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
          {isLoading && <p className="text-sm text-slate-500">Loading policy...</p>}
          {isLoading && <p className="text-sm text-slate-500">Loading policy details...</p>}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Name</span>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => updateField('name', e.target.value)}
                disabled={!isEditable || isSaving}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Type</span>
                <select
                  value={draft.type}
                  onChange={(e) => updateField('type', e.target.value as PolicyType)}
                  disabled={!isEditable || isSaving}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {policyTypeLabels[t]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Status</span>
                <select
                  value={draft.status}
                  onChange={(e) => updateField('status', e.target.value as PolicyStatus)}
                  disabled={!isEditable || isSaving}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {policyStatusLabels[s]}
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
                disabled={!isEditable || isSaving}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Tags (comma separated)</span>
              <input
                type="text"
                value={draft.tags?.join(', ') || ''}
                onChange={(e) => updateField('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                disabled={!isEditable || isSaving}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Summary</span>
              <textarea
                value={draft.summary || ''}
                onChange={(e) => updateField('summary', e.target.value)}
                disabled={!isEditable || isSaving}
                className="min-h-[80px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                placeholder="Short summary of the policy."
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Content</span>
              <textarea
                value={draft.content || ''}
                onChange={(e) => updateField('content', e.target.value)}
                disabled={!isEditable || isSaving}
                className="min-h-[200px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                placeholder="Full policy content."
              />
            </label>

            {mode === 'create' && (
              <p className="text-xs text-slate-500">
                This is an AI-generated draft. Please review and adapt before publishing.
              </p>
            )}

            {onRegenerateAi && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
                onClick={handleRegenerate}
                disabled={aiGenerating}
              >
                <RotateCw className="h-4 w-4" />
                {aiGenerating ? 'Regenerating...' : 'Regenerate with AI'}
              </Button>
            )}
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
            {mode !== 'create' && draft.id && (
              <ExportPdfButton resourceType="policy" resourceId={draft.id} />
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                {mode === 'create' ? 'Cancel' : 'Close'}
              </Button>
              {isEditable && (
              <Button onClick={handleSave} disabled={aiGenerating || isSaving}>
                {mode === 'create' ? 'Create policy' : 'Save changes'}
              </Button>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailsDrawer;
