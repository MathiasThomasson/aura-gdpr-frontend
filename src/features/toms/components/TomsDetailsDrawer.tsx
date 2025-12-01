import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TomCategory, TomEffectiveness, TomItem } from '../types';

type Mode = 'view' | 'edit' | 'create';

type Props = {
  tom: TomItem | null;
  isOpen: boolean;
  mode: Mode;
  isLoading?: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (tom: TomItem, mode: 'create' | 'edit') => void | Promise<void>;
};

const categories: TomCategory[] = [
  'access_control',
  'encryption',
  'logging_monitoring',
  'network_security',
  'backup_recovery',
  'organizational_policies',
  'data_minimization',
  'vendor_management',
  'other',
];

const effectivenessOptions: TomEffectiveness[] = ['low', 'medium', 'high'];

const TomsDetailsDrawer: React.FC<Props> = ({ tom, isOpen, mode, isLoading, isSaving, onClose, onSave }) => {
  const [draft, setDraft] = React.useState<TomItem | null>(tom);
  const [errors, setErrors] = React.useState<{ name?: string; category?: string; description?: string }>({});
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(tom);
      setErrors({});
    }
  }, [tom, isOpen]);

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

  if (!isOpen || (!draft && !isLoading)) return null;

  const isEditable = (mode === 'create' || mode === 'edit') && !isLoading;
  const isBusy = Boolean(isLoading || isSaving);

  const updateField = <K extends keyof TomItem>(key: K, value: TomItem[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const validate = () => {
    const next: { name?: string; category?: string; description?: string } = {};
    if (!draft.name.trim()) next.name = 'Name is required.';
    if (!draft.category) next.category = 'Category is required.';
    if (!draft.description.trim()) next.description = 'Description is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave(draft, mode === 'create' ? 'create' : 'edit');
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!draft && isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm" onMouseDown={handleOverlayClick}>
        <div className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">Technical measure</h2>
              <p className="text-sm text-slate-600">Loading measure...</p>
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
          <div className="p-5 text-sm text-slate-600">Loading measure...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm" onMouseDown={handleOverlayClick}>
      <div className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {mode === 'create' ? 'New TOM' : draft.name || 'Technical measure'}
            </h2>
            <p className="text-sm text-slate-600">{draft.category.replace('_', ' ')}</p>
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

        {isLoading && draft && <div className="px-5 py-2 text-sm text-slate-600">Loading measure...</div>}

        <div className="space-y-4 p-5">
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Name</span>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  disabled={!isEditable || isBusy}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
                {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Category</span>
                <select
                  value={draft.category}
                  onChange={(e) => updateField('category', e.target.value as TomCategory)}
                  disabled={!isEditable || isBusy}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-rose-600">{errors.category}</p>}
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Owner</span>
                <input
                  type="text"
                  value={draft.owner}
                  onChange={(e) => updateField('owner', e.target.value)}
                  disabled={!isEditable || isBusy}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Effectiveness</span>
                <select
                  value={draft.effectiveness}
                  onChange={(e) => updateField('effectiveness', e.target.value as TomEffectiveness)}
                  disabled={!isEditable || isBusy}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {effectivenessOptions.map((eff) => (
                    <option key={eff} value={eff}>
                      {eff}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Description</span>
              <textarea
                value={draft.description}
                onChange={(e) => updateField('description', e.target.value)}
                disabled={!isEditable || isBusy}
                className="min-h-[90px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
              {errors.description && <p className="text-xs text-rose-600">{errors.description}</p>}
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Implementation</span>
              <textarea
                value={draft.implementation}
                onChange={(e) => updateField('implementation', e.target.value)}
                disabled={!isEditable || isBusy}
                className="min-h-[90px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
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
            <Button variant="outline" onClick={onClose} disabled={isBusy}>
              Cancel
            </Button>
            {isEditable && (
              <Button onClick={handleSave} disabled={isBusy}>
                {isSaving ? 'Saving...' : mode === 'create' ? 'Create measure' : 'Save changes'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TomsDetailsDrawer;
