import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DpiaItem, DpiaStatus, DpiaRiskRating } from '../types';
import DpiaStatusBadge from './DpiaStatusBadge';

type Mode = 'view' | 'edit' | 'create';

type Props = {
  dpia: DpiaItem | null;
  isOpen: boolean;
  mode: Mode;
  onClose: () => void;
  onSave: (dpia: DpiaItem) => void;
};

const statusOptions: DpiaStatus[] = ['draft', 'in_review', 'approved', 'rejected', 'archived'];

const computeRisk = (likelihood: number, impact: number): DpiaRiskRating => {
  const overallScore = likelihood * impact;
  const level = overallScore <= 5 ? 'low' : overallScore <= 12 ? 'medium' : 'high';
  return {
    likelihood: likelihood as DpiaRiskRating['likelihood'],
    impact: impact as DpiaRiskRating['impact'],
    overallScore,
    level,
  };
};

const DpiaDetailsDrawer: React.FC<Props> = ({ dpia, isOpen, mode, onClose, onSave }) => {
  const [draft, setDraft] = React.useState<DpiaItem | null>(dpia);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(dpia);
    }
  }, [dpia, isOpen]);

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

  const updateField = <K extends keyof DpiaItem>(key: K, value: DpiaItem[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateRisk = (key: 'likelihood' | 'impact', value: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const nextRisk = computeRisk(key === 'likelihood' ? value : prev.risk.likelihood, key === 'impact' ? value : prev.risk.impact);
      return { ...prev, risk: nextRisk };
    });
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

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
    >
      <div className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{draft.name || 'Untitled DPIA'}</h2>
              <DpiaStatusBadge status={draft.status} />
            </div>
            <p className="text-sm text-slate-600">{draft.systemName}</p>
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
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">System name</span>
                <input
                  type="text"
                  value={draft.systemName}
                  onChange={(e) => updateField('systemName', e.target.value)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
                <span className="font-medium">Status</span>
                <select
                  value={draft.status}
                  onChange={(e) => updateField('status', e.target.value as DpiaStatus)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Risk level</span>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold capitalize text-slate-900">
                  {draft.risk.level} ({draft.risk.overallScore})
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Purpose</span>
                <textarea
                  value={draft.purpose}
                  onChange={(e) => updateField('purpose', e.target.value)}
                  disabled={!isEditable}
                  className="min-h-[80px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Legal basis</span>
                <textarea
                  value={draft.legalBasis || ''}
                  onChange={(e) => updateField('legalBasis', e.target.value)}
                  disabled={!isEditable}
                  className="min-h-[80px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
            </div>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Processing description</span>
              <textarea
                value={draft.processingDescription}
                onChange={(e) => updateField('processingDescription', e.target.value)}
                disabled={!isEditable}
                className="min-h-[90px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Data subjects</span>
                <textarea
                  value={draft.dataSubjects}
                  onChange={(e) => updateField('dataSubjects', e.target.value)}
                  disabled={!isEditable}
                  className="min-h-[70px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Data categories</span>
                <textarea
                  value={draft.dataCategories}
                  onChange={(e) => updateField('dataCategories', e.target.value)}
                  disabled={!isEditable}
                  className="min-h-[70px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Recipients</span>
                <textarea
                  value={draft.recipients || ''}
                  onChange={(e) => updateField('recipients', e.target.value)}
                  disabled={!isEditable}
                  className="min-h-[60px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Transfers outside EU</span>
                <textarea
                  value={draft.transfersOutsideEU || ''}
                  onChange={(e) => updateField('transfersOutsideEU', e.target.value)}
                  disabled={!isEditable}
                  className="min-h-[60px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
            </div>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Mitigation measures</span>
              <textarea
                value={draft.mitigationMeasures || ''}
                onChange={(e) => updateField('mitigationMeasures', e.target.value)}
                disabled={!isEditable}
                className="min-h-[80px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Risk assessment</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Likelihood (1-5)</span>
                <select
                  value={draft.risk.likelihood}
                  onChange={(e) => updateRisk('likelihood', Number(e.target.value))}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {[1, 2, 3, 4, 5].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Impact (1-5)</span>
                <select
                  value={draft.risk.impact}
                  onChange={(e) => updateRisk('impact', Number(e.target.value))}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {[1, 2, 3, 4, 5].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Overall score</span>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                  {draft.risk.overallScore} ({draft.risk.level})
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {isEditable && (
              <Button onClick={handleSave}>{mode === 'create' ? 'Create DPIA' : 'Save changes'}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DpiaDetailsDrawer;
