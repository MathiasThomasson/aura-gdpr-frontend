import React from 'react';
import RopaFiltersBar from './components/RopaFiltersBar';
import RopaTable from './components/RopaTable';
import RopaDetailsDrawer from './components/RopaDetailsDrawer';
import NewRopaButton from './components/NewRopaButton';
import useRopa from './hooks/useRopa';
import { ProcessingCategory, RopaItem } from './types';

type CategoryFilter = ProcessingCategory | 'all';
type OwnerFilter = string | 'all';

const RopaPage: React.FC = () => {
  const { records, loading, detailLoading, saving, error, refresh, create, update, fetchOne } = useRopa();
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<CategoryFilter>('all');
  const [owner, setOwner] = React.useState<OwnerFilter>('all');
  const [selected, setSelected] = React.useState<RopaItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');
  const hasAnyRecords = records.length > 0;

  const owners = React.useMemo(() => Array.from(new Set(records.map((r) => r.owner))), [records]);

  const filtered = React.useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(search.toLowerCase()) ||
        record.systemName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' ? true : record.processingCategory === category;
      const matchesOwner = owner === 'all' ? true : record.owner === owner;
      return matchesSearch && matchesCategory && matchesOwner;
    });
  }, [records, search, category, owner]);

  const handleSelect = (record: RopaItem) => {
    setSelected(record);
    setMode('view');
    if (record.id) {
      fetchOne(record.id).then((detail) => setSelected(detail)).catch(() => {});
    }
  };

  const handleSave = async (record: RopaItem, saveMode: 'create' | 'edit') => {
    if (saveMode === 'create') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = record;
      await create(rest as Omit<RopaItem, 'id'>);
    } else if (record.id) {
      await update(record.id, record);
    }
    await refresh();
    setSelected(null);
    setMode('view');
  };

  const handleNew = () => {
    const now = new Date().toISOString();
    setSelected({
      id: '',
      name: '',
      systemName: '',
      owner: '',
      purpose: '',
      legalBasis: '',
      processingCategory: 'other',
      dataSubjects: '',
      dataCategories: '',
      recipients: '',
      transfersOutsideEU: '',
      retentionPeriod: '',
      securityMeasures: '',
      createdAt: now,
      lastUpdated: now,
    });
    setMode('create');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Records of Processing Activities (ROPA)</h1>
            <p className="text-sm text-slate-600">Maintain your Record of Processing Activities (ROPA) as required by GDPR.</p>
            <p className="text-sm text-slate-600">
              Document processing purposes, legal bases, retention, and data flows for every activity.
            </p>
          </div>
          <NewRopaButton onNew={handleNew} />
        </div>
      </div>

      <RopaFiltersBar
        search={search}
        category={category}
        owner={owner}
        owners={owners}
        onSearch={setSearch}
        onCategoryChange={setCategory}
        onOwnerChange={setOwner}
      />

      <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">ROPA guidance</h3>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
          <li>A Record of Processing Activities lists every way you handle personal data.</li>
          <li>Every company must maintain it to show accountability.</li>
          <li>Add each processing activity with purpose, legal basis, and retention.</li>
          <li>Export the report to share with auditors or regulators.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <RopaTable
          records={filtered}
          onSelect={handleSelect}
          isLoading={loading}
          isError={Boolean(error)}
          errorMessage={error}
          onRetry={refresh}
          hasRecords={hasAnyRecords}
          onCreate={handleNew}
        />
      </div>

      <RopaDetailsDrawer
        record={selected}
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

export default RopaPage;
