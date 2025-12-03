import React from 'react';
import DpiaFiltersBar from './components/DpiaFiltersBar';
import DpiaTable from './components/DpiaTable';
import DpiaDetailsDrawer from './components/DpiaDetailsDrawer';
import NewDpiaMenu from './components/NewDpiaMenu';
import useDpia from './hooks/useDpia';
import { DpiaItem, DpiaStatus } from './types';

type RiskLevel = 'all' | 'low' | 'medium' | 'high';

const DpiaPage: React.FC = () => {
  const { dpias, loading, detailLoading, saving, error, refresh, create, update, fetchOne } = useDpia();
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<DpiaStatus | 'all'>('all');
  const [risk, setRisk] = React.useState<RiskLevel>('all');
  const [selected, setSelected] = React.useState<DpiaItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');
  const hasAnyDpias = dpias.length > 0;

  const filtered = React.useMemo(() => {
    return dpias.filter((dpia) => {
      const matchesSearch =
        dpia.name.toLowerCase().includes(search.toLowerCase()) ||
        dpia.systemName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' ? true : dpia.status === status;
      const matchesRisk = risk === 'all' ? true : dpia.risk.level === risk;
      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [dpias, search, status, risk]);

  const handleSelect = (dpia: DpiaItem) => {
    setSelected(dpia);
    setMode('view');
    if (dpia.id) {
      fetchOne(dpia.id).then((detail) => setSelected(detail)).catch(() => {});
    }
  };

  const handleSave = async (dpia: DpiaItem) => {
    if (mode === 'create') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = dpia;
      await create(rest as Omit<DpiaItem, 'id'>);
    } else if (dpia.id) {
      await update(dpia.id, dpia);
    }
    await refresh();
    setSelected(null);
    setMode('view');
  };

  const handleNewBlank = () => {
    const now = new Date().toISOString();
    setSelected({
      id: `dpia-${Date.now()}`,
      name: 'New DPIA',
      systemName: '',
      owner: 'You',
      status: 'draft',
      createdAt: now,
      lastUpdated: now,
      purpose: '',
      legalBasis: '',
      processingDescription: '',
      dataSubjects: '',
      dataCategories: '',
      recipients: '',
      transfersOutsideEU: '',
      mitigationMeasures: '',
      risk: { likelihood: 1, impact: 1, overallScore: 1, level: 'low' },
    });
    setMode('create');
  };

  const handleNewFromTemplate = (tpl: { name: string; purpose: string; processingDescription: string }) => {
    const now = new Date().toISOString();
    setSelected({
      id: `dpia-${Date.now()}`,
      name: tpl.name,
      systemName: tpl.name,
      owner: 'You',
      status: 'draft',
      createdAt: now,
      lastUpdated: now,
      purpose: tpl.purpose,
      legalBasis: '',
      processingDescription: tpl.processingDescription,
      dataSubjects: '',
      dataCategories: '',
      recipients: '',
      transfersOutsideEU: '',
      mitigationMeasures: '',
      risk: { likelihood: 2, impact: 2, overallScore: 4, level: 'low' },
    });
    setMode('create');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">DPIA</h1>
            <p className="text-sm text-slate-600">
              Create and maintain Data Protection Impact Assessments (DPIA) for high-risk processing activities.
            </p>
            <p className="text-sm text-slate-600">
              Use this page to capture risks, mitigation actions, and approval history for each assessment.
            </p>
          </div>
          <NewDpiaMenu onNewBlank={handleNewBlank} onTemplateSelect={handleNewFromTemplate} />
        </div>
      </div>

      <DpiaFiltersBar
        search={search}
        status={status}
        risk={risk}
        onSearch={setSearch}
        onStatusChange={setStatus}
        onRiskChange={setRisk}
      />

      <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">DPIA guidance</h3>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
          <li>A Data Protection Impact Assessment evaluates high-risk processing.</li>
          <li>Mandatory when processing is likely to cause high risk to individuals.</li>
          <li>Risk scoring combines likelihood and impact for an overall level.</li>
          <li>Create a DPIA for new systems, large datasets, or sensitive processing.</li>
          <li>Export completed DPIAs for sign-off and evidence.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <DpiaTable
          dpias={filtered}
          onSelect={handleSelect}
          isLoading={loading}
          isError={Boolean(error)}
          errorMessage={error}
          onRetry={refresh}
          hasDpias={hasAnyDpias}
          onCreate={handleNewBlank}
        />
      </div>

      <DpiaDetailsDrawer
        dpia={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => setSelected(null)}
        onSave={handleSave}
        isLoading={detailLoading}
        isSaving={saving}
      />
    </div>
  );
};

export default DpiaPage;
