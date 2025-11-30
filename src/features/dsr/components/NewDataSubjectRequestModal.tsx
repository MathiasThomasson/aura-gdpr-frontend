import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CreateDataSubjectRequestInput, DataSubjectRequestPriority, DataSubjectRequestType } from '../types';

type NewDataSubjectRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateDataSubjectRequestInput) => Promise<void>;
};

type FieldErrors = Partial<Record<keyof Omit<CreateDataSubjectRequestInput, 'priority'> | 'priority', string>>;

const REQUEST_TYPES: { value: DataSubjectRequestType; label: string }[] = [
  { value: 'access', label: 'Access' },
  { value: 'rectification', label: 'Rectification' },
  { value: 'erasure', label: 'Erasure' },
  { value: 'restriction', label: 'Restriction' },
  { value: 'portability', label: 'Portability' },
  { value: 'objection', label: 'Objection' },
  { value: 'other', label: 'Other' },
];

const PRIORITY_OPTIONS: { value: DataSubjectRequestPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const DEFAULT_DUE_DATE = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0] ?? '';
};

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const NewDataSubjectRequestModal: React.FC<NewDataSubjectRequestModalProps> = ({ open, onClose, onCreate }) => {
  const { toast } = useToast();
  const [form, setForm] = React.useState<CreateDataSubjectRequestInput>({
    type: 'access',
    data_subject: '',
    email: '',
    identifier: '',
    description: '',
    due_at: DEFAULT_DUE_DATE(),
    priority: 'medium',
  });
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);

  const resetForm = React.useCallback(() => {
    setForm({
      type: 'access',
      data_subject: '',
      email: '',
      identifier: '',
      description: '',
      due_at: DEFAULT_DUE_DATE(),
      priority: 'medium',
    });
    setErrors({});
    setFormError(null);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    resetForm();
  }, [open, resetForm]);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement;

        if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const firstInput = dialogRef.current?.querySelector<HTMLElement>('input, select, textarea, button');
    firstInput?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const updateField = <K extends keyof CreateDataSubjectRequestInput>(key: K, value: CreateDataSubjectRequestInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};
    if (!form.data_subject.trim()) {
      nextErrors.data_subject = 'Name is required.';
    }
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      nextErrors.email = 'Email format is invalid.';
    }
    if (!form.type) {
      nextErrors.type = 'Request type is required.';
    }
    if (!form.description.trim()) {
      nextErrors.description = 'Description is required.';
    }
    if (!form.due_at) {
      nextErrors.due_at = 'Due date is required.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await onCreate({
        ...form,
        data_subject: form.data_subject.trim(),
        email: form.email.trim(),
        identifier: form.identifier?.trim() || undefined,
        description: form.description.trim(),
        due_at: form.due_at,
        priority: form.priority || undefined,
      });
      toast({
        title: 'Data subject request created',
        description: 'The new request has been registered successfully.',
      });
      onClose();
      resetForm();
    } catch (err: any) {
      setFormError(err?.message ?? 'Failed to create data subject request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-dsr-title"
        className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl focus:outline-none"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="new-dsr-title" className="text-lg font-semibold text-slate-900">
              Create data subject request
            </h2>
            <p className="text-sm text-slate-600">
              Register a new GDPR data subject request and track its status.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">
                Data subject name <span className="text-rose-600">*</span>
              </span>
              <input
                type="text"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.data_subject}
                onChange={(e) => updateField('data_subject', e.target.value)}
                disabled={submitting}
                required
              />
              {errors.data_subject && <p className="text-xs text-rose-600">{errors.data_subject}</p>}
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">
                Email address <span className="text-rose-600">*</span>
              </span>
              <input
                type="email"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                disabled={submitting}
                required
              />
              {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">
                Request type <span className="text-rose-600">*</span>
              </span>
              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.type}
                onChange={(e) => updateField('type', e.target.value as DataSubjectRequestType)}
                disabled={submitting}
                required
              >
                {REQUEST_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-rose-600">{errors.type}</p>}
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Priority</span>
              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.priority ?? ''}
                onChange={(e) =>
                  updateField('priority', (e.target.value as DataSubjectRequestPriority) || undefined)
                }
                disabled={submitting}
              >
                <option value="">Select priority</option>
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.priority && <p className="text-xs text-rose-600">{errors.priority}</p>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Identifier / Reference</span>
              <input
                type="text"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.identifier ?? ''}
                onChange={(e) => updateField('identifier', e.target.value)}
                disabled={submitting}
                placeholder="Customer ID, case number, etc."
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">
                Due date <span className="text-rose-600">*</span>
              </span>
              <input
                type="date"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.due_at}
                onChange={(e) => updateField('due_at', e.target.value)}
                disabled={submitting}
                required
              />
              {errors.due_at && <p className="text-xs text-rose-600">{errors.due_at}</p>}
            </label>
          </div>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">
              Description <span className="text-rose-600">*</span>
            </span>
            <textarea
              className="min-h-[110px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              disabled={submitting}
              placeholder="Short description of the request."
              required
            />
            {errors.description && <p className="text-xs text-rose-600">{errors.description}</p>}
          </label>

          {formError && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {formError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDataSubjectRequestModal;
