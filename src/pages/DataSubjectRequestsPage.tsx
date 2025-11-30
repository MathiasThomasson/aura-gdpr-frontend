import React from 'react';
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

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!accessToken) {
        setError('Unable to load Data Subject Requests.');
        setRequests([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/dsr', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to load DSRs: ${res.status}`);
        }
        const data = await res.json();
        if (cancelled) return;
        setRequests(normalizeRequests(data));
      } catch (e: any) {
        if (cancelled) return;
        setError('Unable to load Data Subject Requests.');
        setRequests([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
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
                    <td className="py-2 pr-4 text-foreground">{req.data_subject ?? '—'}</td>
                    <td className="py-2 pr-4 text-foreground">{req.email ?? '—'}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs bg-gray-100 text-foreground">
                        {req.status ?? 'Pending'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-foreground">{req.received_at ?? '—'}</td>
                    <td className="py-2 pr-4 text-foreground">{req.due_at ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSubjectRequestsPage;
