import React from 'react';
import { X, Mail, Calendar, User, Hash, Info, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataSubjectRequest, DataSubjectRequestStatus } from '../types';
import DsrStatusBadge from './DsrStatusBadge';

type DsrDetailsDrawerProps = {
  dsr: DataSubjectRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: DataSubjectRequestStatus) => Promise<void>;
  isUpdating?: boolean;
  error?: string | null;
};

const transitions: Record<DataSubjectRequestStatus, DataSubjectRequestStatus[]> = {
  received: ['identity_required', 'in_progress'],
  identity_required: ['in_progress'],
  in_progress: ['waiting_for_information', 'completed', 'rejected'],
  waiting_for_information: ['in_progress', 'completed', 'rejected'],
  completed: [],
  rejected: [],
};

const statusLabels: Record<DataSubjectRequestStatus, string> = {
  received: 'Mark as received',
  identity_required: 'Mark as identity required',
  in_progress: 'Mark as in progress',
  waiting_for_information: 'Mark as waiting for information',
  completed: 'Mark as completed',
  rejected: 'Mark as rejected',
};

const formatDateTime = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateOnly = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const daysRemaining = (value?: string | null): { label: string; tone: 'ok' | 'soon' | 'late' } => {
  if (!value) return { label: 'No due date set', tone: 'ok' };
  const now = new Date();
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return { label: value, tone: 'ok' };
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return { label: `Due in ${diffDays} days`, tone: diffDays <= 7 ? 'soon' : 'ok' };
  if (diffDays === 1) return { label: 'Due tomorrow', tone: 'soon' };
  if (diffDays === 0) return { label: 'Due today', tone: 'soon' };
  return { label: `Overdue by ${Math.abs(diffDays)} days`, tone: 'late' };
};

const activityMock = (dsr: DataSubjectRequest): { label: string; timestamp: string }[] => {
  const base = [
    { label: 'Request created', timestamp: dsr.createdAt ?? dsr.created_at ?? dsr.received_at ?? '' },
    { label: `Status set to ${dsr.status}`, timestamp: dsr.updatedAt ?? dsr.updated_at ?? '' },
  ];
  return base.filter((item) => item.timestamp);
};

const DsrDetailsDrawer: React.FC<DsrDetailsDrawerProps> = ({
  dsr,
  isOpen,
  onClose,
  onStatusChange,
  isUpdating = false,
  error,
}) => {
  const panelRef = React.useRef<HTMLDivElement | null>(null);

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
    const firstInput = panelRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea');
    firstInput?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !dsr) return null;

  const dueInfo = daysRemaining(dsr.dueDate ?? dsr.due_at ?? null);
  const activity = dsr.events && dsr.events.length > 0 ? dsr.events : activityMock(dsr);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
    >
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{dsr.data_subject}</h2>
              <DsrStatusBadge status={dsr.status} />
            </div>
            <p className="text-sm text-slate-600">{dsr.type}</p>
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
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Mail className="h-4 w-4 text-slate-500" />
              <span>{dsr.email || 'No email provided'}</span>
            </div>
            {dsr.identifier && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Hash className="h-4 w-4 text-slate-500" />
                <span>{dsr.identifier}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <User className="h-4 w-4 text-slate-500" />
              <span className="capitalize">{dsr.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Created: {formatDateTime(dsr.createdAt ?? dsr.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Clock className="h-4 w-4 text-slate-500" />
              <span>
                Due: {formatDateOnly(dsr.dueDate ?? dsr.due_at)} •{' '}
                <span
                  className={
                    dueInfo.tone === 'ok'
                      ? 'text-emerald-600'
                      : dueInfo.tone === 'soon'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }
                >
                  {dueInfo.label}
                </span>
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-semibold text-slate-900">Details</h3>
            </div>
            <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
              {dsr.description || 'No additional details provided.'}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-semibold text-slate-900">Activity</h3>
            </div>
            <div className="mt-3 space-y-3">
              {activity.map((item) => (
                <div key={item.timestamp + item.label} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(item.timestamp)}</p>
                  </div>
                </div>
              ))}
              {activity.length === 0 && <p className="text-sm text-slate-500">No activity logged.</p>}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <div className="flex flex-wrap gap-2">
            {transitions[dsr.status].length === 0 && (
              <Button variant="outline" disabled className="cursor-not-allowed">
                No further actions
              </Button>
            )}
            {transitions[dsr.status].map((next) => (
              <Button
                key={next}
                variant="outline"
                size="sm"
                disabled={isUpdating}
                onClick={() => onStatusChange(next)}
              >
                {statusLabels[next] || 'Update status'}
              </Button>
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default DsrDetailsDrawer;
