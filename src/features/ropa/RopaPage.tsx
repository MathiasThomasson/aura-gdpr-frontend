import React from 'react';
import RopaFiltersBar from './components/RopaFiltersBar';
import RopaTable from './components/RopaTable';
import RopaDetailsDrawer from './components/RopaDetailsDrawer';
import NewRopaButton from './components/NewRopaButton';
import useRopaMockData from './hooks/useRopaMockData';
import { ProcessingCategory, RopaItem } from './types';

type CategoryFilter = ProcessingCategory | 'all';
type OwnerFilter = string | 'all';

const RopaPage: React.FC = () => {
  const { records, setRecords, isLoading, isError } = useRopaMockData();
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<CategoryFilter>('all');
  const [owner, setOwner] = React.useState<OwnerFilter>('all');
  const [selected, setSelected] = React.useState<RopaItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');

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
  };

  const handleSave = (record: RopaItem, saveMode: 'create' | 'edit') => {
    setRecords((prev) => {
      if (saveMode === 'edit') {
        const idx = prev.findIndex((r) => r.id === record.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...record, lastUpdated: new Date().toISOString() };
          return next;
        }
      }
      return [record, ...prev];
    });
    setSelected(null);
    setMode('view');
  };

  const handleNew = () => {
    const now = new Date().toISOString();
    setSelected({
      id: `ropa-${Date.now()}`,
      name: '',
      systemName: '',
      owner: 'You',
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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Records of Processing Activities (ROPA)</h1>
          <p className="text-sm text-slate-600">Maintain an overview of all personal data processing activities.</p>
        </div>
        <NewRopaButton onNew={handleNew} />
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

      <RopaTable records={filtered} onSelect={handleSelect} isLoading={isLoading} isError={isError} />

      <RopaDetailsDrawer
        record={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => setSelected(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default RopaPage;
