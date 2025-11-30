import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { createPublicDataSubjectRequest } from '../api';
import { PublicDsrPayload, PublicDsrRequestType } from '../types';

type PublicDsrFormProps = {
  tenantSlug: string;
  onSuccess: () => void;
};

type FormState = {
  fullName: string;
  email: string;
  requestType: PublicDsrRequestType;
  identifier: string;
  description: string;
  confirmAccuracy: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const REQUEST_TYPES: { value: PublicDsrRequestType; label: string }[] = [
  { value: 'access', label: 'Access' },
  { value: 'rectification', label: 'Rectification' },
  { value: 'erasure', label: 'Erasure' },
  { value: 'restriction', label: 'Restriction' },
  { value: 'portability', label: 'Portability' },
  { value: 'objection', label: 'Objection' },
  { value: 'other', label: 'Other' },
];

const initialState: FormState = {
  fullName: '',
  email: '',
  requestType: 'access',
  identifier: '',
  description: '',
  confirmAccuracy: false,
};

const PublicDsrForm: React.FC<PublicDsrFormProps> = ({ tenantSlug, onSuccess }) => {
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
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError(null);
    try {
      const payload: PublicDsrPayload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        requestType: form.requestType,
        identifier: form.identifier.trim() || undefined,
        description: form.description.trim(),
        confirmAccuracy: form.confirmAccuracy,
      };
      await createPublicDataSubjectRequest(tenantSlug, payload);
      setForm(initialState);
      setErrors({});
      onSuccess();
    } catch (err: any) {
      setFormError(err?.message ?? 'Failed to submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800">
          Full name <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
          value={form.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          disabled={submitting}
          placeholder="Jane Doe"
          required
        />
        {errors.fullName && <p className="text-xs text-rose-600">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800">
          Email address <span className="text-rose-600">*</span>
        </label>
        <input
          type="email"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          disabled={submitting}
          placeholder="name@example.com"
          required
        />
        {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
      </div>

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
        <label className="text-sm font-medium text-slate-800">Identifier / Reference (optional)</label>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
          value={form.identifier}
          onChange={(e) => updateField('identifier', e.target.value)}
          disabled={submitting}
          placeholder="Customer ID, case number, etc."
        />
        {errors.identifier && <p className="text-xs text-rose-600">{errors.identifier}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800">
          Request details <span className="text-rose-600">*</span>
        </label>
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          disabled={submitting}
          placeholder="Describe the request you are making."
          required
        />
        {errors.description && <p className="text-xs text-rose-600">{errors.description}</p>}
      </div>

      <label className="flex items-start gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          checked={form.confirmAccuracy}
          onChange={(e) => updateField('confirmAccuracy', e.target.checked)}
          disabled={submitting}
        />
        <span>I confirm that the information I have provided is accurate.</span>
      </label>

      {formError && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-sky-600" />
          <span>Your submission will be securely sent to the data protection team.</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitting ? 'Submitting...' : 'Submit request'}
      </button>
    </form>
  );
};

export default PublicDsrForm;
