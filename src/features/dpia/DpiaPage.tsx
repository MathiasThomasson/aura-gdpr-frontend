import React from 'react';
import DpiaFiltersBar from './components/DpiaFiltersBar';
import DpiaTable from './components/DpiaTable';
import DpiaDetailsDrawer from './components/DpiaDetailsDrawer';
import NewDpiaMenu from './components/NewDpiaMenu';
import useDpiaMockData from './hooks/useDpiaMockData';
import { DpiaItem, DpiaStatus } from './types';

type RiskLevel = 'all' | 'low' | 'medium' | 'high';

const DpiaPage: React.FC = () => {
  const { dpias, setDpias, isLoading, isError } = useDpiaMockData();
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<DpiaStatus | 'all'>('all');
  const [risk, setRisk] = React.useState<RiskLevel>('all');
  const [selected, setSelected] = React.useState<DpiaItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');

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
  };

  const handleSave = (dpia: DpiaItem) => {
    setDpias((prev) => {
      const exists = prev.findIndex((d) => d.id === dpia.id);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = dpia;
        return next;
      }
      return [dpia, ...prev];
    });
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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">DPIA</h1>
          <p className="text-sm text-slate-600">
            Manage your Data Protection Impact Assessments for high-risk processing activities.
          </p>
        </div>
        <NewDpiaMenu onNewBlank={handleNewBlank} onTemplateSelect={handleNewFromTemplate} />
      </div>

      <DpiaFiltersBar
        search={search}
        status={status}
        risk={risk}
        onSearch={setSearch}
        onStatusChange={setStatus}
        onRiskChange={setRisk}
      />

      <DpiaTable dpias={filtered} onSelect={handleSelect} isLoading={isLoading} isError={isError} />

      <DpiaDetailsDrawer
        dpia={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => setSelected(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default DpiaPage;
