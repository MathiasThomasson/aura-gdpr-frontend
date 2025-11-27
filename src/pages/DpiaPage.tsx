import React, { useMemo, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import DpiaRiskBadge from '@/components/dpia/DpiaRiskBadge';
import DpiaApprovalBadge from '@/components/dpia/DpiaApprovalBadge';
import useDpia, { Dpia, DpiaPayload, DpiaRisk } from '@/hooks/useDpia';
import { RefreshCcw, Plus, X } from 'lucide-react';

const DpiaPage: React.FC = () => {
  const { data, loading, error, reload, saveDpia } = useDpia();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Dpia | null>(null);
  const [form, setForm] = useState<DpiaPayload>({
    title: '',
    process_name: '',
    purpose: '',
    overall_risk: 'medium',
    dpo_approved: false,
  });
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditing(null);
    setForm({
      title: '',
      process_name: '',
      purpose: '',
      overall_risk: 'medium',
      dpo_approved: false,
    });
    setDrawerOpen(true);
  };

  const openEdit = (dpia: Dpia) => {
    setEditing(dpia);
    setForm({
      id: dpia.id,
      title: dpia.title,
      process_name: dpia.process_name,
      purpose: dpia.purpose,
      overall_risk: dpia.overall_risk,
      dpo_approved: dpia.dpo_approved ?? false,
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await saveDpia(form);
      setDrawerOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const renderRows = useMemo(() => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, idx) => (
        <tr key={idx} className="border-b border-border/50">
          <td className="p-3"><Skeleton className="h-4 w-48" /></td>
          <td className="p-3"><Skeleton className="h-4 w-32" /></td>
          <td className="p-3"><Skeleton className="h-4 w-20" /></td>
          <td className="p-3"><Skeleton className="h-4 w-16" /></td>
          <td className="p-3"><Skeleton className="h-4 w-24" /></td>
        </tr>
      ));
    }
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="p-6 text-center text-muted-foreground">
            No DPIAs yet. Create your first DPIA.
          </td>
        </tr>
      );
    }
    return data.map((dpia) => (
      <tr
        key={dpia.id}
        className="border-b border-border/50 hover:bg-muted/50 cursor-pointer"
        onClick={() => openEdit(dpia)}
      >
        <td className="p-3 font-medium">{dpia.title}</td>
        <td className="p-3 text-muted-foreground">{dpia.process_name || '—'}</td>
        <td className="p-3"><DpiaRiskBadge risk={dpia.overall_risk} /></td>
        <td className="p-3"><DpiaApprovalBadge approved={dpia.dpo_approved} /></td>
        <td className="p-3 text-muted-foreground">{new Date(dpia.updated_at).toLocaleDateString()}</td>
      </tr>
    ));
  }, [data, loading]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="DPIA"
        description="Data Protection Impact Assessments"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-sky-500 to-purple-600 text-white" onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" />
              New DPIA
            </Button>
          </div>
        }
      />

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-destructive flex items-center justify-between">
            <span>Failed to load DPIA list: {error}</span>
            <Button size="sm" variant="outline" onClick={reload}>Retry</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Process</th>
                  <th className="p-3">Risk</th>
                  <th className="p-3">DPO approved</th>
                  <th className="p-3">Updated</th>
                </tr>
              </thead>
              <tbody>{renderRows}</tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {drawerOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDrawerOpen(false)} />}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-background shadow-2xl z-50 transform transition-transform ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-xs uppercase text-muted-foreground">{editing ? 'Edit DPIA' : 'New DPIA'}</p>
            <h3 className="text-xl font-semibold">{form.title || 'DPIA'}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} aria-label="Close DPIA drawer">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4 overflow-auto h-[calc(100%-56px)]">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Process name</label>
            <Input
              value={form.process_name ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, process_name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Purpose</label>
            <Input
              value={form.purpose ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Overall risk</label>
            <select
              value={form.overall_risk ?? 'medium'}
              onChange={(e) => setForm((p) => ({ ...p, overall_risk: e.target.value as DpiaRisk }))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="dpo-approved"
              type="checkbox"
              checked={!!form.dpo_approved}
              onChange={(e) => setForm((p) => ({ ...p, dpo_approved: e.target.checked }))}
            />
            <label htmlFor="dpo-approved" className="text-sm">DPO approved</label>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.title.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DpiaPage;
