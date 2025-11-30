import React from 'react';
import { Plus, RefreshCcw } from 'lucide-react';
import PageInfoBox from '@/components/PageInfoBox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import NewDataSubjectRequestModal from '@/features/dsr/components/NewDataSubjectRequestModal';
import useDataSubjectRequests from '@/features/dsr/hooks/useDataSubjectRequests';
import { CreateDataSubjectRequestInput, DataSubjectRequest } from '@/features/dsr/types';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  in_progress: 'bg-sky-50 text-sky-700 border-sky-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
  unknown: 'bg-slate-100 text-slate-700 border-slate-200',
};

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatType = (value?: string) => {
  if (!value) return '—';
  return value.slice(0, 1).toUpperCase() + value.slice(1);
};

const DataSubjectRequestsPage: React.FC = () => {
  const { data, loading, error, reload, create } = useDataSubjectRequests();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreate = async (payload: CreateDataSubjectRequestInput) => {
    await create(payload);
    await reload();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6 p-6">
        <PageInfoBox
          title="Data Subject Requests"
          description="Track and manage GDPR data subject requests such as access, erasure, rectification, and objection."
        />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Data Subject Requests</h1>
            <p className="text-sm text-muted-foreground">
              Monitor incoming requests and keep deadlines on track.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New request
            </Button>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {loading && <p className="text-sm text-muted-foreground">Loading requests...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && data.length === 0 && (
            <p className="text-sm text-muted-foreground">No data subject requests yet.</p>
          )}

          {data.length > 0 && (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-4 font-semibold">Type</th>
                    <th className="py-2 pr-4 font-semibold">Data subject</th>
                    <th className="py-2 pr-4 font-semibold">Email</th>
                    <th className="py-2 pr-4 font-semibold">Status</th>
                    <th className="py-2 pr-4 font-semibold">Received</th>
                    <th className="py-2 pr-4 font-semibold">Due date</th>
                    <th className="py-2 pr-4 font-semibold">Identifier</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((req: DataSubjectRequest) => (
                    <tr key={req.id ?? `${req.data_subject}-${req.due_at ?? ''}`} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-semibold text-foreground">{formatType(req.type)}</td>
                      <td className="py-3 pr-4 text-foreground">{req.data_subject}</td>
                      <td className="py-3 pr-4 text-foreground">{req.email || 'N/A'}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[req.status ?? 'unknown'] ?? statusStyles.unknown
                          }`}
                        >
                          {formatType(req.status ?? 'pending')}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-foreground">{formatDate(req.received_at)}</td>
                      <td className="py-3 pr-4 text-foreground">{formatDate(req.due_at)}</td>
                      <td className="py-3 pr-4 text-foreground">{req.identifier || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <NewDataSubjectRequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={async (payload) => {
          try {
            await handleCreate(payload);
          } catch (err: any) {
            toast({
              variant: 'destructive',
              title: 'Failed to create request',
              description: err?.message ?? 'Please try again.',
            });
            throw err;
          }
        }}
      />
    </>
  );
};

export default DataSubjectRequestsPage;
