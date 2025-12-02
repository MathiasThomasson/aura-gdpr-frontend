import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewDsrRequestPayload } from '@/hooks/dsr/useCreateDSR';

type NewRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: NewDsrRequestPayload) => Promise<void>;
  submitting?: boolean;
  error?: string | null;
};

type FieldErrors = Partial<Record<keyof NewDsrRequestPayload, string>>;

const REQUEST_TYPES = [
  { value: 'access', label: 'Access Request' },
  { value: 'erasure', label: 'Erasure Request' },
  { value: 'rectification', label: 'Rectification Request' },
  { value: 'objection', label: 'Objection Request' },
  { value: 'restriction', label: 'Restriction Request' },
  { value: 'portability', label: 'Data Portability Request' },
  { value: 'other', label: 'Other' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const defaultDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};

const NewRequestModal: React.FC<NewRequestModalProps> = ({
  open,
  onClose,
  onSubmit,
  submitting = false,
  error,
}) => {
  const [form, setForm] = React.useState<NewDsrRequestPayload>({
    request_type: 'access',
    name: '',
    email: '',
    description: '',
    priority: 'medium',
    deadline: defaultDeadline(),
  });
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setForm({
      request_type: 'access',
      name: '',
      email: '',
      description: '',
      priority: 'medium',
      deadline: defaultDeadline(),
    });
    setFieldErrors({});
    setFormError(null);
  }, [open]);

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (!form.request_type) nextErrors.request_type = 'Request type is required.';
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setFormError(null);
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        description: form.description.trim(),
      });
    } catch (err: any) {
      setFormError(err?.message ?? 'Unable to create request. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-dsr-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">New DSR</p>
            <h2 id="new-dsr-title" className="text-lg font-semibold text-slate-900">
              Create new request
            </h2>
            <p className="text-sm text-slate-600">
              Capture the details of a new data subject request.
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

        <form className="space-y-4 px-6 py-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">
                Request Type <span className="text-rose-600">*</span>
              </span>
              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.request_type}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, request_type: e.target.value as NewDsrRequestPayload['request_type'] }))
                }
                disabled={submitting}
                required
              >
                {REQUEST_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.request_type && <p className="text-xs text-rose-600">{fieldErrors.request_type}</p>}
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">
                Priority <span className="text-rose-600">*</span>
              </span>
              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.priority}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, priority: e.target.value as NewDsrRequestPayload['priority'] }))
                }
                disabled={submitting}
                required
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">
                Data Subject Name <span className="text-rose-600">*</span>
              </span>
              <input
                type="text"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                disabled={submitting}
                placeholder="Full name of the data subject"
                required
              />
              {fieldErrors.name && <p className="text-xs text-rose-600">{fieldErrors.name}</p>}
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">
                Email <span className="text-rose-600">*</span>
              </span>
              <input
                type="email"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                disabled={submitting}
                placeholder="contact@example.com"
                required
              />
              {fieldErrors.email && <p className="text-xs text-rose-600">{fieldErrors.email}</p>}
            </label>
          </div>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Description</span>
            <textarea
              className="min-h-[110px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              disabled={submitting}
              placeholder="Add any context provided by the requester."
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Deadline (30 days)</span>
              <input
                type="date"
                value={form.deadline}
                readOnly
                className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm"
              />
            </label>
          </div>

          {(formError || error) && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {formError || error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequestModal;
