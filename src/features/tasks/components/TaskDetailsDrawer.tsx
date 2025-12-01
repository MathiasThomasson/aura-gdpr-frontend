import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskItem, TaskPriority, TaskResourceType, TaskStatus } from '../types';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import { NavLink } from 'react-router-dom';

type Mode = 'view' | 'edit' | 'create';

type Props = {
  task: TaskItem | null;
  isOpen: boolean;
  mode: Mode;
  isLoading?: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (task: TaskItem, mode: 'create' | 'edit') => void | Promise<void>;
  onStatusChange?: (id: string, status: TaskStatus) => Promise<void>;
  onPriorityChange?: (id: string, priority: TaskPriority) => Promise<void>;
};

const statuses: TaskStatus[] = ['open', 'in_progress', 'blocked', 'completed', 'cancelled'];
const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
const resources: TaskResourceType[] = ['dsr', 'policy', 'document', 'dpia', 'ropa', 'incident', 'toms', 'general'];

const resourceLinkMap: Partial<Record<TaskResourceType, string>> = {
  dsr: '/app/dsr',
  policy: '/app/policies',
  document: '/app/documents',
  dpia: '/app/dpia',
  ropa: '/app/ropa',
  incident: '/app/incidents',
  toms: '/app/toms',
};

const TaskDetailsDrawer: React.FC<Props> = ({
  task,
  isOpen,
  mode,
  isLoading,
  isSaving,
  onClose,
  onSave,
  onStatusChange,
  onPriorityChange,
}) => {
  const [draft, setDraft] = React.useState<TaskItem | null>(task);
  const [errors, setErrors] = React.useState<{
    title?: string;
    description?: string;
    resourceType?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
  }>({});
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(task);
      setErrors({});
    }
  }, [task, isOpen]);

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
  const allowStatusPatch = onStatusChange && draft?.id && mode !== 'create';
  const allowPriorityPatch = onPriorityChange && draft?.id && mode !== 'create';
  const isBusy = Boolean(isLoading || isSaving);

  const updateField = <K extends keyof TaskItem>(key: K, value: TaskItem[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const validate = () => {
    const next: {
      title?: string;
      description?: string;
      resourceType?: string;
      status?: string;
      priority?: string;
      dueDate?: string;
    } = {};
    if (!draft.title.trim()) next.title = 'Title is required.';
    if (!draft.description.trim()) next.description = 'Description is required.';
    if (!draft.resourceType) next.resourceType = 'Resource type is required.';
    if (!draft.status) next.status = 'Status is required.';
    if (!draft.priority) next.priority = 'Priority is required.';
    if (!draft.dueDate) next.dueDate = 'Due date is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave(draft, mode === 'create' ? 'create' : 'edit');
  };

  const handleStatusChange = async (nextStatus: TaskStatus) => {
    updateField('status', nextStatus);
    if (allowStatusPatch && draft?.id) {
      await onStatusChange?.(draft.id, nextStatus);
    }
  };

  const handlePriorityChange = async (nextPriority: TaskPriority) => {
    updateField('priority', nextPriority);
    if (allowPriorityPatch && draft?.id) {
      await onPriorityChange?.(draft.id, nextPriority);
    }
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
              <h2 className="text-lg font-semibold text-slate-900">Task</h2>
              <p className="text-sm text-slate-600">Loading task...</p>
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
          <div className="p-5 text-sm text-slate-600">Loading task...</div>
        </div>
      </div>
    );
  }

  const resourceLink = draft.resourceType && resourceLinkMap[draft.resourceType];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm" onMouseDown={handleOverlayClick}>
      <div className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                {mode === 'create' ? 'New task' : draft.title || 'Task'}
              </h2>
              <TaskStatusBadge status={draft.status} />
              <TaskPriorityBadge priority={draft.priority} />
            </div>
            <p className="text-sm text-slate-600">{draft.resourceName || draft.resourceType}</p>
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

        {isLoading && draft && <div className="px-5 py-2 text-sm text-slate-600">Loading task...</div>}

        <div className="space-y-4 p-5">
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Title</span>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => updateField('title', e.target.value)}
                disabled={!isEditable || isBusy}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              />
              {errors.title && <p className="text-xs text-rose-600">{errors.title}</p>}
            </label>

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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Status</span>
                <select
                  value={draft.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  disabled={(!isEditable && !allowStatusPatch) || isBusy}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="text-xs text-rose-600">{errors.status}</p>}
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Priority</span>
                <select
                  value={draft.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                  disabled={(!isEditable && !allowPriorityPatch) || isBusy}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.priority && <p className="text-xs text-rose-600">{errors.priority}</p>}
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Due date</span>
                <input
                  type="date"
                  value={draft.dueDate.slice(0, 10)}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  disabled={!isEditable || isBusy}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
                {errors.dueDate && <p className="text-xs text-rose-600">{errors.dueDate}</p>}
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Assignee</span>
                <input
                  type="text"
                  value={draft.assignee}
                  onChange={(e) => updateField('assignee', e.target.value)}
                  disabled={!isEditable || isBusy}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                />
              </label>
              <div className="grid grid-cols-1 gap-2">
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="font-medium">Resource type</span>
                  <select
                    value={draft.resourceType}
                    onChange={(e) => updateField('resourceType', e.target.value as TaskResourceType)}
                    disabled={!isEditable || isBusy}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                  >
                    {resources.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {errors.resourceType && <p className="text-xs text-rose-600">{errors.resourceType}</p>}
                </label>
                <div className="flex flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    placeholder="Resource id (optional)"
                    value={draft.resourceId || ''}
                    onChange={(e) => updateField('resourceId', e.target.value)}
                    disabled={!isEditable || isBusy}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                  />
                  <input
                    type="text"
                    placeholder="Resource name (optional)"
                    value={draft.resourceName || ''}
                    onChange={(e) => updateField('resourceName', e.target.value)}
                    disabled={!isEditable || isBusy}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                  />
                </div>
                {resourceLink && (
                  <NavLink to={resourceLink} className="text-sm font-semibold text-sky-700 hover:underline">
                    Open related module
                  </NavLink>
                )}
              </div>
            </div>
          </div>

          {mode !== 'create' && (
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-2">
              <div>
                <p className="font-semibold text-slate-800">Created</p>
                <p>{new Date(draft.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Last updated</p>
                <p>{new Date(draft.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isBusy}>
              Cancel
            </Button>
            {isEditable && (
              <Button onClick={handleSave} disabled={isBusy}>
                {isSaving ? 'Saving...' : mode === 'create' ? 'Create task' : 'Save changes'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsDrawer;
