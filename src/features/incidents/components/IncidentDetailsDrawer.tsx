import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportPdfButton from '@/features/pdf-export/components/ExportPdfButton';
import { IncidentItem, IncidentSeverity, IncidentStatus, IncidentTimelineEvent } from '../types';

type Mode = 'view' | 'edit' | 'create';

type Props = {
  incident: IncidentItem | null;
  isOpen: boolean;
  mode: Mode;
  onClose: () => void;
  onSave: (incident: IncidentItem, mode: 'create' | 'edit') => void;
};

const severityOptions: IncidentSeverity[] = ['low', 'medium', 'high', 'critical'];
const statusOptions: IncidentStatus[] = ['open', 'investigating', 'contained', 'resolved', 'closed'];

const IncidentDetailsDrawer: React.FC<Props> = ({ incident, isOpen, mode, onClose, onSave }) => {
  const [draft, setDraft] = React.useState<IncidentItem | null>(incident);
  const [errors, setErrors] = React.useState<{ title?: string; systemName?: string; description?: string }>({});
  const [newEvent, setNewEvent] = React.useState<{ actor: string; action: string; notes?: string }>({
    actor: '',
    action: '',
    notes: '',
  });
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(incident);
      setErrors({});
      setNewEvent({ actor: '', action: '', notes: '' });
    }
  }, [incident, isOpen]);

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

  const updateField = <K extends keyof IncidentItem>(key: K, value: IncidentItem[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const validate = () => {
    const next: { title?: string; systemName?: string; description?: string } = {};
    if (!draft.title.trim()) next.title = 'Title is required.';
    if (!draft.systemName.trim()) next.systemName = 'System name is required.';
    if (!draft.description.trim()) next.description = 'Description is required.';
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

  const addTimelineEvent = () => {
    if (!newEvent.actor.trim() || !newEvent.action.trim()) return;
    const event: IncidentTimelineEvent = {
      id: `event-${Date.now()}`,
      actor: newEvent.actor.trim(),
      action: newEvent.action.trim(),
      notes: newEvent.notes?.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    setDraft((prev) => (prev ? { ...prev, timeline: [event, ...prev.timeline] } : prev));
    setNewEvent({ actor: '', action: '', notes: '' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
    >
      <div className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {mode === 'create' ? 'New incident' : draft.title || 'Incident'}
            </h2>
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
                <span className="font-medium">Title</span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
                {errors.title && <p className="text-xs text-rose-600">{errors.title}</p>}
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">System</span>
                <input
                  type="text"
                  value={draft.systemName}
                  onChange={(e) => updateField('systemName', e.target.value)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
                {errors.systemName && <p className="text-xs text-rose-600">{errors.systemName}</p>}
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Severity</span>
                <select
                  value={draft.severity}
                  onChange={(e) => updateField('severity', e.target.value as IncidentSeverity)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {severityOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Status</span>
                <select
                  value={draft.status}
                  onChange={(e) => updateField('status', e.target.value as IncidentStatus)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Detection method</span>
                <input
                  type="text"
                  value={draft.detectionMethod}
                  onChange={(e) => updateField('detectionMethod', e.target.value)}
                  disabled={!isEditable}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </div>
            </div>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Description</span>
              <textarea
                value={draft.description}
                onChange={(e) => updateField('description', e.target.value)}
                disabled={!isEditable}
                className="min-h-[90px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
              {errors.description && <p className="text-xs text-rose-600">{errors.description}</p>}
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Affected data</span>
                <textarea
                  value={draft.affectedData}
                  onChange={(e) => updateField('affectedData', e.target.value)}
                  disabled={!isEditable}
                  className="min-h-[70px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Affected subjects</span>
                <textarea
                  value={draft.affectedSubjects}
                  onChange={(e) => updateField('affectedSubjects', e.target.value)}
                  disabled={!isEditable}
                  className="min-h-[70px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Timeline</p>
            </div>
            <div className="space-y-3">
              {draft.timeline.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{event.action}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleString()} - {event.actor}
                    </p>
                    {event.notes && <p className="text-xs text-slate-600">{event.notes}</p>}
                  </div>
                </div>
              ))}
              {draft.timeline.length === 0 && <p className="text-sm text-muted-foreground">No timeline events yet.</p>}
            </div>
            {isEditable && (
              <div className="space-y-2 rounded-lg border border-dashed border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">Add timeline event</p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Actor"
                    value={newEvent.actor}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, actor: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                  <input
                    type="text"
                    placeholder="Action"
                    value={newEvent.action}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, action: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <textarea
                  placeholder="Notes (optional)"
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, notes: e.target.value }))}
                  className="min-h-[60px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                <Button type="button" variant="outline" size="sm" onClick={addTimelineEvent}>
                  Add event
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {mode !== 'create' && draft.id && (
              <ExportPdfButton resourceType="incident" resourceId={draft.id} />
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {isEditable && (
                <Button onClick={handleSave}>{mode === 'create' ? 'Create incident' : 'Save changes'}</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailsDrawer;
