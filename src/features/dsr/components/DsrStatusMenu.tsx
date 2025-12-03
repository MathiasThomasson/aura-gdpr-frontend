import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DsrStatusBadge from './DsrStatusBadge';
import { DataSubjectRequestStatus } from '../types';

type Props = {
  open: boolean;
  currentStatus: DataSubjectRequestStatus;
  onClose: () => void;
  onSubmit: (status: DataSubjectRequestStatus, note?: string) => Promise<void>;
  isSubmitting?: boolean;
};

const statusOptions: { value: DataSubjectRequestStatus; label: string }[] = [
  { value: 'received', label: 'Received' },
  { value: 'identity_required', label: 'Identity verification' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

const DsrStatusMenu: React.FC<Props> = ({ open, currentStatus, onClose, onSubmit, isSubmitting }) => {
  const [selectedStatus, setSelectedStatus] = React.useState<DataSubjectRequestStatus>(currentStatus);
  const [note, setNote] = React.useState<string>('');

  React.useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus);
      setNote('');
    }
  }, [currentStatus, open]);

  const handleSubmit = async () => {
    if (selectedStatus === currentStatus) return;
    await onSubmit(selectedStatus, note.trim() ? note.trim() : undefined);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">Change status</h3>
          <p className="text-sm text-slate-600">Update the request status and add an optional note.</p>
        </div>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-900">New status</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStatus(option.value)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-200 ${
                    selectedStatus === option.value
                      ? 'border-sky-300 bg-sky-50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <span>{option.label}</span>
                  <DsrStatusBadge status={option.value} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dsr-status-note" className="text-sm font-semibold text-slate-900">
              Note (optional)
            </Label>
            <Textarea
              id="dsr-status-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add context for this status change."
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-500">Notes are saved with the status update.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedStatus === currentStatus}
            className="inline-flex items-center gap-2"
          >
            {isSubmitting && <Sparkles className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Updating...' : 'Update status'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DsrStatusMenu;
