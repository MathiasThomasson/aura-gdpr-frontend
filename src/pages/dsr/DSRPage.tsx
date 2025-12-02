import React from 'react';
import { Plus, RefreshCcw, Filter } from 'lucide-react';
import PageInfoBox from '@/components/PageInfoBox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DsrStatusBadge from '@/features/dsr/components/DsrStatusBadge';
import DsrDetailsDrawer from '@/features/dsr/components/DsrDetailsDrawer';
import useDataSubjectRequests from '@/features/dsr/hooks/useDataSubjectRequests';
import { DataSubjectRequest, DataSubjectRequestStatus } from '@/features/dsr/types';
import useCreateDSR, { NewDsrRequestPayload } from '@/hooks/dsr/useCreateDSR';
import NewRequestModal from '@/components/dsr/NewRequestModal';
import PublicDsrSettings from '@/components/dsr/PublicDsrSettings';
import { useSystemStatus } from '@/contexts/SystemContext';
import { useUserProgress } from '@/contexts/UserProgressContext';

type StatusFilter = 'all' | 'open' | 'completed' | 'rejected';

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatType = (value?: string) => {
  if (!value) return 'N/A';
  return value.slice(0, 1).toUpperCase() + value.slice(1);
};

const openStatuses: DataSubjectRequestStatus[] = [
  'received',
  'identity_required',
  'in_progress',
  'waiting_for_information',
];

const dueTone = (value?: string | null) => {
  if (!value) return '';
  const now = new Date();
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return '';
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'text-rose-600';
  if (diffDays <= 3) return 'text-amber-600';
  return '';
};

const DSRPage: React.FC = () => {
  const { data, loading, detailLoading, error, reload, updateStatus, fetchDetail } = useDataSubjectRequests();
  const { toast } = useToast();
  const { demoMode } = useSystemStatus();
  const { markComplete } = useUserProgress();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [selectedDsr, setSelectedDsr] = React.useState<DataSubjectRequest | null>(null);
  const [drawerError, setDrawerError] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const { createRequest, loading: creating, error: createError } = useCreateDSR({
    onSuccess: async () => {
      setIsModalOpen(false);
      await reload();
      markComplete('firstDsr').catch(() => {});
    },
  });

  const filteredData = React.useMemo(() => {
    if (statusFilter === 'all') return data;
    if (statusFilter === 'completed') return data.filter((item) => item.status === 'completed');
    if (statusFilter === 'rejected') return data.filter((item) => item.status === 'rejected');
    return data.filter((item) => openStatuses.includes(item.status));
  }, [data, statusFilter]);

  const handleRowClick = (dsr: DataSubjectRequest) => {
    setSelectedDsr(dsr);
    setDrawerError(null);
    if (dsr.id) {
      fetchDetail(dsr.id)
        .then((detail) => setSelectedDsr(detail))
        .catch((err: any) => setDrawerError(err?.message ?? 'Failed to load request details.'));
    }
  };

  const handleStatusChange = async (nextStatus: DataSubjectRequestStatus) => {
    if (!selectedDsr?.id) return;
    setIsUpdating(true);
    setDrawerError(null);
    try {
      const updated = await updateStatus(selectedDsr.id, nextStatus);
      setSelectedDsr(updated);
      toast({ title: 'Status updated', description: `Request marked as ${formatType(nextStatus)}.` });
    } catch (err: any) {
      setDrawerError(err?.message ?? 'Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const closeDrawer = () => {
    setSelectedDsr(null);
    setDrawerError(null);
  };

  const handleCreate = async (payload: NewDsrRequestPayload) => {
    try {
      await createRequest(payload);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to create request',
        description: err?.message ?? 'Please try again.',
      });
    }
  };

  return (
    <>
      <div className="space-y-6 p-6">
        <PageInfoBox
          title="Data Subject Requests"
          description="Track and manage GDPR data subject requests such as access, erasure, rectification, and objection."
        />

        <PublicDsrSettings />

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">DSR guidance</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
            <li>A Data Subject Request lets an individual exercise their privacy rights.</li>
            <li>Workflow: Received → Verification → Investigation → Completed.</li>
            <li>30-day rule: respond and close within 30 days unless extended.</li>
            <li>Create a new DSR with the New Request button and capture the requester details.</li>
            <li>Results are stored in this list and inside each request timeline.</li>
            <li>Export a PDF from the request drawer to share evidence.</li>
          </ul>
        </div>

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
            <Button size="sm" onClick={() => setIsModalOpen(true)} disabled={demoMode}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
            <Filter className="h-4 w-4 text-slate-500" />
            Status
          </div>
          {(['all', 'open', 'completed', 'rejected'] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                statusFilter === filter
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => setStatusFilter(filter)}
            >
              {formatType(filter)}
            </button>
          ))}
        </div>

        {demoMode && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Demo mode - creation and updates are disabled.
          </div>
        )}

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {loading && <p className="text-sm text-muted-foreground">Loading requests...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && filteredData.length === 0 && (
            <p className="text-sm text-muted-foreground">No data subject requests yet.</p>
          )}

          {!loading && filteredData.length > 0 && (
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
                  {filteredData.map((req: DataSubjectRequest) => (
                    <tr
                      key={req.id ?? `${req.data_subject}-${req.due_at ?? ''}`}
                      className="cursor-pointer border-b last:border-0 hover:bg-slate-50 focus-within:bg-slate-50"
                      tabIndex={0}
                      role="button"
                      onClick={() => handleRowClick(req)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRowClick(req);
                        }
                      }}
                    >
                      <td className="py-3 pr-4 font-semibold text-foreground">{formatType(req.type)}</td>
                      <td className="py-3 pr-4 text-foreground">{req.data_subject}</td>
                      <td className="py-3 pr-4 text-foreground">{req.email || 'N/A'}</td>
                      <td className="py-3 pr-4">
                        <DsrStatusBadge status={req.status} />
                      </td>
                      <td className="py-3 pr-4 text-foreground">{formatDate(req.received_at ?? req.createdAt)}</td>
                      <td className={`py-3 pr-4 text-foreground ${dueTone(req.dueDate ?? req.due_at)}`}>
                        {formatDate(req.dueDate ?? req.due_at)}
                      </td>
                      <td className="py-3 pr-4 text-foreground">{req.identifier || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <DsrDetailsDrawer
        dsr={selectedDsr}
        isOpen={Boolean(selectedDsr)}
        onClose={closeDrawer}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
        error={drawerError}
        isLoading={detailLoading}
      />

      <NewRequestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        submitting={creating}
        error={createError}
      />
    </>
  );
};

export default DSRPage;
