import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CookieCategory, CookieItem, CookieSource } from '../types';

type Mode = 'view' | 'edit' | 'create';

type Props = {
  cookie: CookieItem | null;
  isOpen: boolean;
  mode: Mode;
  onClose: () => void;
  onSave: (cookie: CookieItem, mode: 'create' | 'edit') => void;
};

const categories: CookieCategory[] = ['necessary', 'preferences', 'analytics', 'marketing', 'unclassified'];
const types: Array<CookieItem['type']> = ['first_party', 'third_party'];
const sources: CookieSource[] = ['manual', 'scanner', 'imported'];

const CookieDetailsDrawer: React.FC<Props> = ({ cookie, isOpen, mode, onClose, onSave }) => {
  const [draft, setDraft] = React.useState<CookieItem | null>(cookie);
  const [errors, setErrors] = React.useState<{ name?: string; domain?: string; purpose?: string }>({});
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(cookie);
      setErrors({});
    }
  }, [cookie, isOpen]);

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

  const updateField = <K extends keyof CookieItem>(key: K, value: CookieItem[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const validate = () => {
    const next: { name?: string; domain?: string; purpose?: string } = {};
    if (!draft.name.trim()) next.name = 'Name is required.';
    if (!draft.domain.trim()) next.domain = 'Domain is required.';
    if (!draft.purpose.trim()) next.purpose = 'Purpose is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(draft, mode === 'create' ? 'create' : 'edit');
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm" onMouseDown={handleOverlayClick}>
      <div className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">{mode === 'create' ? 'New cookie' : draft.name}</h2>
            <p className="text-sm text-slate-600">{draft.domain}</p>
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Name</span>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
                {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Domain</span>
                <input
                  type="text"
                  value={draft.domain}
                  onChange={(e) => updateField('domain', e.target.value)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
                {errors.domain && <p className="text-xs text-rose-600">{errors.domain}</p>}
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Category</span>
                <select
                  value={draft.category}
                  onChange={(e) => updateField('category', e.target.value as CookieCategory)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Type</span>
                <select
                  value={draft.type}
                  onChange={(e) => updateField('type', e.target.value as CookieItem['type'])}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Source</span>
                <select
                  value={draft.source}
                  onChange={(e) => updateField('source', e.target.value as CookieSource)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {sources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Provider</span>
                <input
                  type="text"
                  value={draft.provider}
                  onChange={(e) => updateField('provider', e.target.value)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Duration</span>
                <input
                  type="text"
                  value={draft.duration}
                  onChange={(e) => updateField('duration', e.target.value)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                  placeholder="e.g. 2 years"
                />
              </label>
            </div>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Purpose</span>
              <textarea
                value={draft.purpose}
                onChange={(e) => updateField('purpose', e.target.value)}
                disabled={!isEditable}
                className="min-h-[90px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
              {errors.purpose && <p className="text-xs text-rose-600">{errors.purpose}</p>}
            </label>

            {mode !== 'create' && (
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-2">
                <div>
                  <p className="font-semibold text-slate-800">Created</p>
                  <p>{new Date(draft.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Last updated</p>
                  <p>{new Date(draft.lastUpdated).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {isEditable && (
              <Button onClick={handleSave}>{mode === 'create' ? 'Create cookie' : 'Save changes'}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieDetailsDrawer;
