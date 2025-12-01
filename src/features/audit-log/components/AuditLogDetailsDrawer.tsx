import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuditLogItem } from '../types';
import AuditSeverityBadge from './AuditSeverityBadge';

type Props = {
  item: AuditLogItem | null;
  isOpen: boolean;
  onClose: () => void;
};

const formatDateTime = (value?: string) => {
  if (!value) return '—';
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

const AuditLogDetailsDrawer: React.FC<Props> = ({ item, isOpen, onClose }) => {
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

  if (!isOpen || !item) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm" onMouseDown={handleOverlayClick}>
      <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl" ref={panelRef}>
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">Audit event</h2>
            <div className="flex items-center gap-2">
              <AuditSeverityBadge severity={item.severity} />
              <span className="text-sm text-slate-600">{formatDateTime(item.timestamp)}</span>
            </div>
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

        <div className="space-y-3 p-5 text-sm text-slate-800">
          <div>
            <p className="font-semibold text-slate-900">Actor</p>
            <p>{item.actor}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Action</p>
            <p>{item.action}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Resource</p>
            <p>
              {item.resourceType}
              {item.resourceName ? ` - ${item.resourceName}` : ''}
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Timestamp</p>
            <p>{formatDateTime(item.timestamp)}</p>
          </div>
          {item.ipAddress && (
            <div>
              <p className="font-semibold text-slate-900">IP address</p>
              <p>{item.ipAddress}</p>
            </div>
          )}
          {item.userAgent && (
            <div>
              <p className="font-semibold text-slate-900">User agent</p>
              <p className="break-all">{item.userAgent}</p>
            </div>
          )}
          {item.details && (
            <div>
              <p className="font-semibold text-slate-900">Details</p>
              <pre className="overflow-auto rounded-md bg-slate-50 p-3 text-xs text-slate-800">{item.details}</pre>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogDetailsDrawer;
