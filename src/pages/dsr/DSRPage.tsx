import React from 'react';
import { Plus, RefreshCcw, Filter } from 'lucide-react';
import PageInfoBox from '@/components/PageInfoBox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DsrStatusBadge from '@/features/dsr/components/DsrStatusBadge';
import DsrStatusMenu from '@/features/dsr/components/DsrStatusMenu';
import DsrDetailsDrawer from '@/features/dsr/components/DsrDetailsDrawer';
import useDataSubjectRequests from '@/features/dsr/hooks/useDataSubjectRequests';
import { DataSubjectRequest, DataSubjectRequestStatus } from '@/features/dsr/types';
import useCreateDSR, { NewDsrRequestPayload } from '@/hooks/dsr/useCreateDSR';
import NewRequestModal from '@/components/dsr/NewRequestModal';
import PublicDsrSettings from '@/components/dsr/PublicDsrSettings';
import { useSystemStatus } from '@/contexts/SystemContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import EmptyState from '@/components/EmptyState';
import { Switch } from '@/components/ui/switch';

type StatusFilter = 'all' | 'open' | 'received' | 'identity_required' | 'in_progress' | 'completed' | 'rejected';

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

const openStatuses: DataSubjectRequestStatus[] = ['received', 'identity_required', 'in_progress', 'waiting_for_information'];

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
  const {
    data,
    loading,
    detailLoading,
    error,
    reload,
    updateStatus,
    fetchDetail,
    setStatusFilter: setStatusFilterParam,
    overdueOnly,
    setOverdueOnly,
  } = useDataSubjectRequests();
  const { toast } = useToast();
  const { demoMode } = useSystemStatus();
  const { markComplete } = useUserProgress();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [selectedDsr, setSelectedDsr] = React.useState<DataSubjectRequest | null>(null);
  const [drawerError, setDrawerError] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = React.useState(false);
  const [statusMenuTarget, setStatusMenuTarget] = React.useState<DataSubjectRequest | null>(null);
  const hasAnyRequests = data.length > 0;

  const { createRequest, loading: creating, error: createError } = useCreateDSR({
    onSuccess: async () => {
      setIsModalOpen(false);
      await reload();
      markComplete('firstDsr').catch(() => {});
    },
  });

  React.useEffect(() => {
    const nextStatusParam =
      statusFilter === 'all'
        ? undefined
        : statusFilter === 'open'
          ? openStatuses
          : statusFilter;
    setStatusFilterParam(nextStatusParam as any);
  }, [setStatusFilterParam, statusFilter]);

  const filteredData = data;

  const handleRowClick = (dsr: DataSubjectRequest) => {
    setSelectedDsr(dsr);
    setDrawerError(null);
    if (dsr.id) {
      fetchDetail(dsr.id)
        .then((detail) => setSelectedDsr(detail))
        .catch((err: any) => setDrawerError(err?.message ?? 'Failed to load request details.'));
    }
  };

  const handleStatusChange = async (
    nextStatus: DataSubjectRequestStatus,
    note?: string,
    target?: DataSubjectRequest | null
  ) => {
    const targetDsr = target ?? selectedDsr;
    if (!targetDsr?.id) return;
    if (nextStatus === targetDsr.status) return;
    setIsUpdating(true);
    setDrawerError(null);
    try {
      const updated = await updateStatus(targetDsr.id, nextStatus, note);
      if (selectedDsr?.id === updated.id) {
        setSelectedDsr(updated);
      }
      await reload();
      toast({ title: 'Status updated', description: 'Status updated successfully.' });
    } catch (err: any) {
      setDrawerError(err?.message ?? 'Failed to update status. Please try again.');
      toast({ variant: 'destructive', title: 'Failed to update status', description: err?.message ?? 'Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusMenuSubmit = async (newStatus: DataSubjectRequestStatus, note?: string) => {
    if (!statusMenuTarget?.id || newStatus === statusMenuTarget.status) return;
    await handleStatusChange(newStatus, note, statusMenuTarget);
    setStatusMenuOpen(false);
    setStatusMenuTarget(null);
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
        <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Data Subject Requests</h1>
            <p className="text-sm text-muted-foreground">Track and respond to Data Subject Requests (DSR) end-to-end.</p>
            <p className="text-sm text-muted-foreground">
              Use this page to register new requests, manage deadlines, and keep a full history of actions.
            </p>
          </div>
        </div>

        <PageInfoBox
          title="Data Subject Requests"
          description="Track and manage GDPR data subject requests such as access, erasure, rectification, and objection."
        />

        <PublicDsrSettings />

        <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">DSR guidance</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
            <li>A Data Subject Request lets an individual exercise their privacy rights.</li>
            <li>Workflow: Received -&gt; Verification -&gt; Investigation -&gt; Completed.</li>
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

        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
            <Filter className="h-4 w-4 text-slate-500" />
            Filters
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-800" htmlFor="dsr-status-filter">
              Status
            </label>
            <select
              id="dsr-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            >
              <option value="all">All statuses</option>
              <option value="received">Received</option>
              <option value="identity_required">Identity verification</option>
              <option value="in_progress">In progress</option>
              <option value="open">Open</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="dsr-overdue-only" checked={overdueOnly} onCheckedChange={setOverdueOnly} />
            <label htmlFor="dsr-overdue-only" className="text-sm text-slate-800">
              Overdue only
            </label>
          </div>
        </div>

        {demoMode && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Demo mode - creation and updates are disabled.
          </div>
        )}

        <div className="space-y-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm">
          {loading && <p className="text-sm text-muted-foreground">Loading requests...</p>}
          {error && (
            <EmptyState
              title="Unable to load requests"
              description={error}
              actionLabel="Retry"
              onAction={reload}
              className="bg-rose-50 border-rose-200"
            />
          )}
          {!loading && !error && filteredData.length === 0 && (
            <EmptyState
              title={hasAnyRequests ? 'No requests match these filters' : 'No data subject requests yet'}
              description={
                hasAnyRequests
                  ? 'Adjust filters or add a new request to keep this list moving.'
                  : 'When individuals submit requests, they will appear here. You can also create internal requests manually.'
              }
              actionLabel="New request"
              onAction={() => setIsModalOpen(true)}
            />
          )}

          {!loading && filteredData.length > 0 && (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left text-slate-500">
                    <th className="py-2 pr-4 font-semibold">Request</th>
                    <th className="py-2 pr-4 font-semibold">Data subject</th>
                    <th className="py-2 pr-4 font-semibold">Email</th>
                    <th className="py-2 pr-4 font-semibold">Status</th>
                    <th className="py-2 pr-4 font-semibold">Received</th>
                    <th className="py-2 pr-4 font-semibold">Due date</th>
                    <th className="py-2 pr-4 font-semibold">Identifier</th>
                    <th className="py-2 pr-4 font-semibold text-right">Actions</th>
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
                          <div className="flex items-center gap-2">
                            <span>{formatDate(req.dueDate ?? req.due_at)}</span>
                            {req.is_overdue && req.status !== 'completed' && (
                              <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                                Overdue
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-foreground">{req.identifier || 'N/A'}</td>
                        <td className="py-3 pr-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setStatusMenuTarget(req);
                              setStatusMenuOpen(true);
                            }}
                            disabled={isUpdating}
                          >
                            Change status
                          </Button>
                        </td>
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

      <DsrStatusMenu
        open={statusMenuOpen && Boolean(statusMenuTarget)}
        currentStatus={statusMenuTarget?.status ?? 'received'}
        onClose={() => {
          setStatusMenuOpen(false);
          setStatusMenuTarget(null);
        }}
        onSubmit={handleStatusMenuSubmit}
        isSubmitting={isUpdating}
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
