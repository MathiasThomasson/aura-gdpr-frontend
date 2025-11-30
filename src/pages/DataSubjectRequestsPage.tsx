import React from 'react';
import SimpleModal from '@/components/SimpleModal';
import PageInfoBox from '@/components/PageInfoBox';
import { useAuth } from '@/contexts/AuthContext';

type DataSubjectRequest = {
  id?: string;
  type?: string;
  data_subject?: string;
  email?: string | null;
  status?: string;
  received_at?: string;
  due_at?: string | null;
};

const normalizeRequests = (value: any): DataSubjectRequest[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.requests)) return value.requests;
  return [];
};

const DataSubjectRequestsPage: React.FC = () => {
  const { accessToken } = useAuth();
  const [requests, setRequests] = React.useState<DataSubjectRequest[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [type, setType] = React.useState('access');
  const [dataSubject, setDataSubject] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [dueAt, setDueAt] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const mountedRef = React.useRef(true);

  const resetForm = React.useCallback(() => {
    setType('access');
    setDataSubject('');
    setEmail('');
    setDueAt('');
    setNotes('');
    setSubmitError(null);
  }, []);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadRequests = React.useCallback(async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    if (!accessToken) {
      if (!mountedRef.current) return;
      setError('Unable to load Data Subject Requests.');
      setRequests([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/dsr', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to load DSRs: ${res.status}`);
      }
      const data = await res.json();
      if (!mountedRef.current) return;
      setRequests(normalizeRequests(data));
    } catch (e: any) {
      if (!mountedRef.current) return;
      setError('Unable to load Data Subject Requests.');
      setRequests([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [accessToken]);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const trimmedDataSubject = dataSubject.trim();
    const trimmedEmail = email.trim();
    const trimmedNotes = notes.trim();

    if (!type) {
      setSubmitError('Type is required.');
      return;
    }
    if (!trimmedDataSubject) {
      setSubmitError('Data subject is required.');
      return;
    }
    if (trimmedEmail && !trimmedEmail.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!accessToken) {
        throw new Error('Missing access token.');
      }
      const res = await fetch('/api/dsr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          type,
          data_subject: trimmedDataSubject,
          email: trimmedEmail || null,
          due_at: dueAt || null,
          notes: trimmedNotes || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create data subject request.');
      }

      const created = await res.json();
      if (!mountedRef.current) return;

      setRequests((prev) => [...prev, created]);
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      if (!mountedRef.current) return;
      setSubmitError('Failed to create data subject request.');
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <PageInfoBox
          title="Data Subject Requests"
          description="Track and manage GDPR data subject requests such as access, erasure, rectification, and objection."
        />

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Data Subject Requests</h1>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-primary text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            New Request
          </button>
        </div>

        <div className="p-4 border rounded-md bg-white shadow-sm space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading requests...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && requests.length === 0 && (
            <p className="text-sm text-muted-foreground">No data subject requests yet.</p>
          )}

          {requests.length > 0 && (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-2 pr-4 font-medium">Type</th>
                    <th className="py-2 pr-4 font-medium">Data Subject</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Received</th>
                    <th className="py-2 pr-4 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, idx) => (
                    <tr key={req.id ?? idx} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium text-foreground">{req.type ?? 'Unknown'}</td>
                      <td className="py-2 pr-4 text-foreground">{req.data_subject ?? 'N/A'}</td>
                      <td className="py-2 pr-4 text-foreground">{req.email ?? 'N/A'}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex rounded-full px-2 py-0.5 text-xs bg-gray-100 text-foreground">
                          {req.status ?? 'Pending'}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-foreground">{req.received_at ?? 'N/A'}</td>
                      <td className="py-2 pr-4 text-foreground">{req.due_at ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <SimpleModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="New Data Subject Request"
        footer={
          <>
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-dsr-form"
              disabled={submitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </>
        }
      >
        <form id="new-dsr-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-foreground">
              <span className="font-medium">
                Type <span className="text-red-600">*</span>
              </span>
              <select
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="access">Access</option>
                <option value="erasure">Erasure</option>
                <option value="rectification">Rectification</option>
                <option value="objection">Objection</option>
              </select>
            </label>
            <label className="space-y-1 text-sm text-foreground">
              <span className="font-medium">
                Data Subject <span className="text-red-600">*</span>
              </span>
              <input
                type="text"
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={dataSubject}
                onChange={(e) => setDataSubject(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-foreground">
              <span className="font-medium">Email (optional)</span>
              <input
                type="email"
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </label>
            <label className="space-y-1 text-sm text-foreground">
              <span className="font-medium">Due date (optional)</span>
              <input
                type="date"
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </label>
          </div>

          <label className="space-y-1 text-sm text-foreground">
            <span className="font-medium">Notes (optional)</span>
            <textarea
              className="min-h-[90px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional context about the request..."
            />
          </label>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        </form>
      </SimpleModal>
    </>
  );
};

export default DataSubjectRequestsPage;
