import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitPublicDsrRequest } from '../api';
import { PublicDsrPayload, PublicDsrPriority, PublicDsrRequestType } from '../types';

type PublicDsrFormProps = {
  publicKey: string;
  onSuccess: () => void;
  onUnavailable?: () => void;
};

type FormState = {
  fullName: string;
  email: string;
  requestType: PublicDsrRequestType;
  description: string;
  priority: PublicDsrPriority;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const REQUEST_TYPES: { value: PublicDsrRequestType; label: string }[] = [
  { value: 'access', label: 'Access Request' },
  { value: 'erasure', label: 'Erasure Request' },
  { value: 'rectification', label: 'Rectification Request' },
  { value: 'objection', label: 'Objection Request' },
  { value: 'restriction', label: 'Restriction Request' },
  { value: 'portability', label: 'Data Portability Request' },
  { value: 'other', label: 'Other' },
];

const PRIORITY_OPTIONS: { value: PublicDsrPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const initialState: FormState = {
  fullName: '',
  email: '',
  requestType: 'access',
  description: '',
  priority: 'medium',
};

const unavailableMessage = 'This public request form is not available. Please contact the organization directly.';

const PublicDsrForm: React.FC<PublicDsrFormProps> = ({ publicKey, onSuccess, onUnavailable }) => {
  const [form, setForm] = React.useState<FormState>(initialState);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.requestType) nextErrors.requestType = 'Request type is required.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    if (!form.priority) nextErrors.priority = 'Priority is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publicKey) {
      setFormError(unavailableMessage);
      onUnavailable?.();
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    setFormError(null);
    try {
      const payload: PublicDsrPayload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        requestType: form.requestType,
        description: form.description.trim(),
        priority: form.priority,
      };
      await submitPublicDsrRequest(publicKey, payload);
      setForm(initialState);
      setErrors({});
      onSuccess();
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      if (status === 404 || status === 403) {
        setFormError(unavailableMessage);
        onUnavailable?.();
        return;
      }
      setFormError(err?.message ?? 'Failed to submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800">
          Request type <span className="text-rose-600">*</span>
        </label>
        <select
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
          value={form.requestType}
          onChange={(e) => updateField('requestType', e.target.value as PublicDsrRequestType)}
          disabled={submitting}
          required
        >
          {REQUEST_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.requestType && <p className="text-xs text-rose-600">{errors.requestType}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800">
          Full name <span className="text-rose-600">*</span>
        </label>
        <Input
          type="text"
          value={form.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          disabled={submitting}
          placeholder="Jane Doe"
          className="shadow-sm"
          required
        />
        {errors.fullName && <p className="text-xs text-rose-600">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800">
          Email address <span className="text-rose-600">*</span>
        </label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          disabled={submitting}
          placeholder="name@example.com"
          className="shadow-sm"
          required
        />
        {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800">
          Request details <span className="text-rose-600">*</span>
        </label>
        <Textarea
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          disabled={submitting}
          placeholder="Describe the request you are making."
          className="shadow-sm"
          required
        />
        {errors.description && <p className="text-xs text-rose-600">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800">
          Priority <span className="text-rose-600">*</span>
        </label>
        <select
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
          value={form.priority}
          onChange={(e) => updateField('priority', e.target.value as PublicDsrPriority)}
          disabled={submitting}
          required
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.priority && <p className="text-xs text-rose-600">{errors.priority}</p>}
      </div>

      {formError && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-sky-600" />
          <span>Your submission will be securely sent to the data protection team.</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center bg-sky-600 text-white hover:bg-sky-700"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitting ? 'Submitting...' : 'Submit request'}
      </Button>
    </form>
  );
};

export default PublicDsrForm;
