import React from 'react';
import { ShieldCheck, ShieldOff, AlertTriangle, FileWarning, Activity } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import PageIntro from '@/components/PageIntro';
import Card from '@/components/Card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { getAuditSummary, AuditSummary } from './api';
import useAiExplain from '../ai/hooks/useAiExplain';

const ComplianceGauge: React.FC<{ value: number }> = ({ value }) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="relative h-32 w-32">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#0ea5e9 ${clamped * 3.6}deg, #e2e8f0 0deg)`,
        }}
      />
      <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white shadow-inner">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">{clamped}%</p>
          <p className="text-xs text-slate-500">Compliance</p>
        </div>
      </div>
    </div>
  );
};

const AuditSummaryPage: React.FC = () => {
  const [summary, setSummary] = React.useState<AuditSummary | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { result: explainResult, loading: explainLoading, error: explainError, explain } = useAiExplain();
  const [explainPrompt, setExplainPrompt] = React.useState('');

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuditSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load audit summary.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleExplain = async () => {
    const prompt =
      explainPrompt.trim().length > 0
        ? explainPrompt
        : 'Explain the current audit readiness and priorities for leadership.';
    await explain({ text: prompt, audience: 'audit_team' });
  };

  const cards = [
    { label: 'Open DSRs', value: summary?.openDsrs ?? 0, icon: <ShieldCheck className="h-5 w-5 text-sky-600" /> },
    { label: 'Overdue DSRs', value: summary?.overdueDsrs ?? 0, icon: <AlertTriangle className="h-5 w-5 text-amber-600" /> },
    { label: 'Missing DPIA', value: summary?.missingDpia ?? 0, icon: <FileWarning className="h-5 w-5 text-rose-600" /> },
    { label: 'Missing ROPA', value: summary?.missingRopa ?? 0, icon: <FileWarning className="h-5 w-5 text-rose-600" /> },
    { label: 'Open incidents', value: summary?.openIncidents ?? 0, icon: <ShieldOff className="h-5 w-5 text-rose-600" /> },
    { label: 'Policy coverage', value: `${summary?.policyCoverage ?? 0}%`, icon: <Activity className="h-5 w-5 text-emerald-600" /> },
  ];

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Audit dashboard"
        subtitle="Track compliance posture across key GDPR modules."
        actions={
          <Button variant="outline" size="sm" onClick={load}>
            Refresh
          </Button>
        }
      />

      <PageIntro
        title="What you can do here"
        subtitle="Use this overview to understand risk hotspots."
        bullets={[
          'Monitor compliance score and policy coverage.',
          'Spot missing DPIAs or ROPA entries quickly.',
          'Track DSR and incident workload.',
        ]}
      />

      <Card title="Compliance score" subtitle="Calculated from coverage across DPIA, ROPA, incidents, and policies.">
        {loading && !summary ? (
          <Skeleton className="h-32 w-32 rounded-full" />
        ) : summary ? (
          <ComplianceGauge value={summary.complianceScore} />
        ) : (
          <p className="text-sm text-rose-600">{error}</p>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} title={card.label} subtitle="" className="h-full">
            {loading && !summary ? (
              <Skeleton className="h-10 w-20 rounded-md" />
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">{card.icon}</div>
                <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card
        title="Audit explanation (AI)"
        subtitle="Generate a quick narrative for stakeholders."
        actions={
          <Button size="sm" variant="outline" onClick={handleExplain} disabled={explainLoading}>
            {explainLoading ? 'Explaining...' : 'Generate explanation'}
          </Button>
        }
      >
        <Textarea
          placeholder="Ask AURA to explain audit readiness..."
          value={explainPrompt}
          onChange={(e) => setExplainPrompt(e.target.value)}
          rows={4}
        />
        {explainError ? <p className="text-xs text-rose-600">{explainError}</p> : null}
        {explainResult ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
            {explainResult.explanation}
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default AuditSummaryPage;
